//import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from "uuid";
import { QdrantClient } from "@qdrant/js-client-rest";

export class QdrantService {
  private static qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
  });

  private static embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

  static async getCollection(collectionName: string) {
    if (!collectionName) {
      console.error("Please provide a valid collection name!");
    }

    const result = await this.qdrantClient.getCollections();
    const indexed = result.collections.find(
      (collection) => collection.name === collectionName
    );

    // Create collection if not exists
    if (!indexed) {
      console.log("Creating a collection => ", collectionName);
      await this.qdrantClient.createCollection(collectionName, {
        vectors: { size: 1536, distance: "Cosine", on_disk: true },
      });
    }

    const collectionInfo = await this.qdrantClient.getCollection(
      collectionName
    );

    return collectionInfo;
  }

  static async addToCollection(
    collectionName: string,
    records: AIDevsAPI.UnknowRecord[]
  ): Promise<boolean> {
    const collection = await this.getCollection(collectionName);

    const isAlreadyIndexed = !!collection.points_count;

    if (isAlreadyIndexed) {
      console.log("The collection is already populated!");
      return true;
    }

    try {
      const documents = records.map(
        (record) =>
          new Document({
            pageContent: record.info,
            metadata: {
              source: collectionName,
              content: record,
              uuid: uuidv4(),
            },
          })
      );

      // Generate embeddings
      const points: {
        id: string;
        payload: any;
        vector: number[];
      }[] = [];
      for (const document of documents) {
        const [embedding] = await this.embeddings.embedDocuments([
          document.pageContent,
        ]);
        points.push({
          id: document.metadata.uuid,
          payload: document.metadata,
          vector: embedding,
        });
      }

      // Index
      await this.qdrantClient.upsert(collectionName, {
        wait: true,
        batch: {
          ids: points.map((point) => point.id),
          vectors: points.map((point) => point.vector),
          payloads: points.map((point) => point.payload),
        },
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async searchCollection(collectionName: string, query: string) {
    const queryEmbedding = await this.embeddings.embedQuery(query);
    const result = await this.qdrantClient.search(collectionName, {
      vector: queryEmbedding,
      limit: 1,
      filter: {
        must: [
          {
            key: "source",
            match: {
              value: collectionName,
            },
          },
        ],
      },
    });

    return result;
  }
}

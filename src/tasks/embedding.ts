import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MODELS } from "../consts";

type EmbeddingTask = AIDevsAPI.BaseResponse & {
  hint1: string;
  hint2: string;
  hint3: string;
};

export const generateAnswer = async (task: EmbeddingTask): Promise<string> => {
  const embeddings = new OpenAIEmbeddings({
    modelName: MODELS.TEXT_EMBEDDING_ADA_002,
  });
  const embedded = await embeddings.embedQuery("Hawaiian pizza");
  return JSON.stringify(embedded);
};

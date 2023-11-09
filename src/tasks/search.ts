import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { QdrantService } from "../services/qdrantService";

type SearchTask = AIDevsAPI.BaseResponse & {
  question?: string;
};

export const generateAnswer = async (task: SearchTask): Promise<string> => {
  const { question = "" } = task;
  const COLLECTION_NAME = "unknowNews";
  const RECORDS_URL = "https://unknow.news/archiwum.json";
  let records: AIDevsAPI.UnknowRecord[] = [];

  try {
    const res = await fetch(RECORDS_URL);
    records = await res.json();
  } catch (e) {
    console.error("Could not fetch records :(");
    return "";
  }

  const wasAddSuccess = await QdrantService.addToCollection(
    COLLECTION_NAME,
    records.slice(0, 300)
  );

  if (!wasAddSuccess) {
    console.error("Error while adding to vector DB :(");
    return "";
  }

  const results = await QdrantService.searchCollection(
    COLLECTION_NAME,
    question
  );

  const found = results.length;

  if (!found) {
    console.log("No matches were found, sorry :(");
  }

  const answer = (results[0]?.payload?.content as AIDevsAPI.UnknowRecord)?.url;

  return answer;
};

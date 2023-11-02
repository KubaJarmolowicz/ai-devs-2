import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { TranscriptionService } from "../services/transcriptService";

type WhisperTask = AIDevsAPI.BaseResponse & {
  hint: string;
};

export const generateAnswer = async (task: WhisperTask): Promise<string> => {
  const { msg } = task;
  const chat = new ChatOpenAI();
  const { content: url } = await chat.call([
    new SystemMessage(
      "Please extract a URL from the user's message and return it. Respond only with the URL itself, skip any comments and details."
    ),
    new HumanMessage(`${msg}`),
  ]);

  const mp3File = await fetch(url);
  const text = await TranscriptionService.speechToText(mp3File);

  return text;
};

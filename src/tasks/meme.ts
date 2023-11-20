import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { RenderFormService } from "../services/renderFormService";

type MemeTask = AIDevsAPI.BaseResponse & {
  service: string;
  image: string;
  text: string;
  hint: string;
};

export const generateAnswer = async (task: MemeTask): Promise<string> => {
  const { text, image: imageUrl } = task;

  return await RenderFormService.getRenderedImageHref({ text, imageUrl });
};

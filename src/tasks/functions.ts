import { ChatOpenAI } from "langchain/chat_models/openai";
import { addUserSchema } from "../fn_schemas/addUser";

type FunctionsTask = AIDevsAPI.BaseResponse & {
  hint1: string;
  hint2: string;
};

export const generateAnswer = async (_: FunctionsTask): Promise<string> => {
  const model = new ChatOpenAI({ modelName: "gpt-4-0613" }).bind({
    functions: [addUserSchema],
  });

  return JSON.stringify(model?.lc_kwargs.kwargs?.functions?.[0] ?? "");
};

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { MODELS } from "../consts";

type ToolsTask = AIDevsAPI.BaseResponse & {
  hint: string;
  question: string;
};

const examples = `
user: 'Przypomnij mi, że mam kupić mleko'
AI: {"tool":"ToDo","desc":"Kup mleko"}
user: 'Jutro mam spotkanie z Marianem'
AI: {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2023-11-15"}
`;

export const generateAnswer = async (task: ToolsTask): Promise<string> => {
  const { msg, hint, question } = task;
  const chat = new ChatOpenAI({ modelName: MODELS.GPT_4 });
  const { content: json } = await chat.call([
    new SystemMessage(
      `${msg} Any day's names mentioned refer to the nearest future. ${hint} Today is ${
        new Date().toISOString().split("T")[0]
      }. ### EXAMPLES: ${examples} ###`
    ),
    new HumanMessage(`${question}`),
  ]);

  return JSON.parse(json);
};

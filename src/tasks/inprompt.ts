import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

type InPromptTask = AIDevsAPI.BaseResponse & {
  input: string[];
  question: string;
};

export const generateAnswer = async (task: InPromptTask): Promise<string> => {
  const { question, input, msg } = task;
  const chat = new ChatOpenAI();
  const { content: name } = await chat.call([
    new SystemMessage(
      "You will be provided a question about a certain person. Do not try to answer the question, respond only with one word, the name of this person!"
    ),
    new HumanMessage(`${question}`),
  ]);

  console.log("### Name from inprompt: ", name);

  const context = input.filter((sentance) => sentance.includes(name));

  console.log("### Context from inprompt: ", context);

  const { content: answer } = await chat.call([
    new SystemMessage(`${msg}: ###CONTEXT: ${context} ###`),
    new HumanMessage(`${question}`),
  ]);

  return JSON.stringify(answer);
};

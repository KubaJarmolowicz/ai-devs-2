import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { performCourseTask } from "../performCourseTask";

type WhoAmITask = AIDevsAPI.BaseResponse & {
  hint: "string";
};

const dynamicContext = [];

export const generateAnswer = async (task: WhoAmITask): Promise<string> => {
  const { hint } = task;
  dynamicContext.push(hint);
  console.log("@@@ Dynamic context so far: ", dynamicContext);
  const chat = new ChatOpenAI();
  const { content: answer } = await chat.call([
    new SystemMessage(
      "You will be provided a set of hints by the user. Your job is to guess who the hints are about. If you are absolutely, 100% sure who the user means, answer with the person's full name. Otherwise, answer ONLY with the word 'NO'. Do not include any comments or insights."
    ),
    new HumanMessage(`${dynamicContext.join(" ")}`),
  ]);

  console.log("### Model's answer: ", answer);
  const didAnswer = answer !== "NO";

  if (!didAnswer) {
    performCourseTask("whoami", generateAnswer);
    return "";
  }

  return JSON.stringify(answer);
};

import { OpenAIService } from "../services/openAIService";
import { getNonStreamingChatMsg } from "../utils";
type LiarTask = AIDevsAPI.BaseResponse & {
  answer: string;
};

export const generateAnswer = async (
  task: LiarTask,
  additionalParams: AIDevsAPI.CourseTaskAdditionalParams["task"]
): Promise<string> => {
  const system = `You are a fact checker and a moderator. You will be provided a human-generated question and an AI generated answer.
  Your job is to verify if the AI model provided an answer to the human question (YES) or if it is talking about something completely different (NO). Answer only YES or NO.`;

  const user = `  ### Question: ${additionalParams.body.question} ###
  ^^^ Answer: ${task.answer} ^^^`;
  try {
    const res = await OpenAIService.chat.completions.create(
      getNonStreamingChatMsg(system, user)
    );
    const choices = res.choices || [];
    if (choices.length) {
      const latestResponse = choices[choices.length - 1]?.message;
      console.log(
        "SUCCESSFUL TEST INTEGRATION. HERE'S ASSISSTANT'S RESPONSE ### =>",
        latestResponse
      );
      return latestResponse.content;
    }
  } catch (e) {
    console.error("ERROR in testIntegration =>", e);
  }
};

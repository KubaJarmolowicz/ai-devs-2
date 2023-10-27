import { MODELS } from "./consts";
import { OpenAIService } from "./services/openAIService";
import { ChatCompletionMessageParam } from "openai/resources";

const messages: ChatCompletionMessageParam[] = [
  { role: "user", content: "Greet my dear and lovely Anna!" },
];

const model = MODELS.GPT_3_5_turbo;

export const testIntegration = async () => {
  try {
    const res = await OpenAIService.chat.completions.create({
      messages,
      model,
    });
    const choices = res.choices || [];
    if (choices.length) {
      const latestResponse = choices[choices.length - 1]?.message;
      console.log(
        "SUCCESSFUL TEST INTEGRATION. HERE'S ASSISSTANT'S RESPONSE ### =>",
        latestResponse
      );
    }
  } catch (e) {
    console.error("ERROR in testIntegration =>", e);
  }
};

import { MODELS } from "./consts";
import { OpenAIService } from "./openAIService";

const messages: OpenAI.ChatCompletionMessageParam[] = [
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
      console.log("SUCCESS ### =>", latestResponse);
    }
  } catch (e) {
    console.log("ERROR :(( =>", e);
  }
};

import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";
import { MODELS } from "./consts";

export const getNonStreamingChatMsg = (
  system: string,
  content: string
): ChatCompletionCreateParamsNonStreaming => {
  const messages: ChatCompletionMessageParam[] = [
    { role: "user", content },
    { role: "system", content: system },
  ];

  const model = MODELS.GPT_3_5_turbo;

  return {
    messages,
    model,
  };
};

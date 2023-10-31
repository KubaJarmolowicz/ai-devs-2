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

  const model = MODELS.GPT_4;

  return {
    messages,
    model,
  };
};

export const getSimulatedFormData = (data: {
  [key: string]: string;
}): FormData => {
  const formData = new FormData();
  const entries = Object.entries(data);
  entries.map((entry) => formData.append(entry[0], entry[1]));

  return formData;
};

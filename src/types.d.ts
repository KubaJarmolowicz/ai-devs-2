declare namespace OpenAI {
  type ChatCompletionMessageParam = {
    role: "function" | "user" | "system" | "assistant";
    content: string;
  };
}

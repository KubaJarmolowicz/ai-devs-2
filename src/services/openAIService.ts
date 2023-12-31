import { ClientOptions, OpenAI } from "openai";

const configuration: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
};

export const OpenAIService = new OpenAI(configuration);

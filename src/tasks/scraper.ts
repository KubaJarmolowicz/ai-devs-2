import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

type ScrapperTask = AIDevsAPI.BaseResponse & {
  input: string;
  question: string;
};

export const generateAnswer = async (task: ScrapperTask): Promise<string> => {
  const { msg, question, input } = task;
  const chat = new ChatOpenAI();

  let article = null;

  while (!article) {
    article = await fetchArticleEBO(input, 1);
  }

  console.log("^^^ article: ", article);

  const { content: answer } = await chat.call([
    new SystemMessage(`${msg} ### Article: ${article} ###`),
    new HumanMessage(`${question}`),
  ]);

  return answer;
};

export const fetchArticleEBO = async (
  url: string,
  waitTimeSec: number
): Promise<string | null> => {
  let article = null;

  const maxWaitSecs = 10;
  const resolvedWaitTimeSecs = Math.min(waitTimeSec, maxWaitSecs);

  const controller = new AbortController();

  // 30 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  console.log("%%% resolvedWaitTimeSecs", resolvedWaitTimeSecs);

  try {
    const headers = new Headers({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    });
    const request = new Request(url, {
      headers,
      signal: controller.signal,
    });

    const res = await fetch(request);
    article = await res.text();

    const isValidResponse = article.length >= 100;

    if (!isValidResponse) {
      throw new Error(`The provided text is not a valid article => ${article}`);
    }

    return article;
  } catch (e) {
    console.log("*** Problem with scraper article API => ", e);
    await timeout(resolvedWaitTimeSecs * 1000);
    return fetchArticleEBO(url, resolvedWaitTimeSecs + 3);
  }
};

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

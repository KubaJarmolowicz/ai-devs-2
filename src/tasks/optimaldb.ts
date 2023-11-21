import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { MODELS } from "../consts";

const fs = require("fs");

const examples = `
  user: Podczas ostatniej konferencji technologicznej, program który stworzył Zygfryd wygrał nagrodę za innowacyjność w użyciu JavaScript.
  AI: Jego program w JS wygrał nagrodę za innowacyjność.
  user: Wśród ulubionych gier wideo Zygfryda królują strategiczne RPGi, gdzie może pokazać swoje umiejętności planowania.
  AI: Uwielbia strategiczne RPGi.
  user: Jamnik, który ozdabia skórę Stefana, to tatuaż, który symbolizuje jego miłość do wiernego psa z dzieciństwa.
  AI: Ma tatuaż jamnika na pamiątkę psa z dzieciństwa.
  user: W wolnych chwilach Ania prowadzi kanał na YouTube, gdzie dzieli się poradami z zakresu beauty.
  AI: Prowadzi kanał beauty na Youtube.
  `;

type OptimalDBTask = AIDevsAPI.BaseResponse & {
  database: string;
  hint: string;
};

export const generateAnswer = async (_: OptimalDBTask): Promise<string> => {
  const chat = new ChatOpenAI({
    modelName: MODELS.GPT_3_5_turbo_16k,
    maxTokens: -1,
  });
  const raw = fs.readFileSync("./src/assets/threeFriends.json", {
    encoding: "utf8",
  });
  const db = JSON.parse(raw);

  const { zygfryd, stefan, ania } = db;

  const people = [
    {
      name: "zygfryd",
      data: zygfryd,
    },
    {
      name: "stefan",
      data: stefan,
    },
    {
      name: "ania",
      data: ania,
    },
  ];

  const result = await optimiseDB(people);

  return result;
};

const optimiseDB = async (people) => {
  const chat = new ChatOpenAI();
  let result = "";
  for (let person of people) {
    const { data } = person;

    let partial = "";

    const sliceSize = 30;

    for (let i = 0; i < data.length - 1; i += sliceSize) {
      const startIndex = Math.min(i, data.length - sliceSize);
      const stopindex = Math.min(i + sliceSize, data.length + 1);

      const dataSlice = data.slice(startIndex, stopindex);
      console.log({ dataSlice });
      try {
        const { content: short } = await chat.call([
          new SystemMessage(
            `You will be provided with a bunch of information about a person. Your job is to optimise it so that all the information provided is still there, but the output is significantly lighter. Their name will be known to the recepient, so no need to repeat it. Use only the info provided by the user! Preserve all information, just make the whole thing shorter. You must respond with simple text, without any comments or punctuation. Every piece of info must be preserved, as I will then need to answer questions about the person based on your answer. ''' EXAMPLES: ${examples} '''`
          ),
          new HumanMessage(
            `${dataSlice.reduce((acc, item) => (acc += `${item} `), "")}`
          ),
        ]);

        partial += short;
        console.log({ partial });
      } catch (e) {
        console.log("Chat failed to optimise :(( => ", e);
      }
    }

    result += `### ${person.name}: ${partial} ### `;
    console.log("result so far: ", result);
  }

  return result;
};

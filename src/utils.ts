import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";
import { MODELS } from "./consts";
//import { Person } from "./types";
const fs = require("fs");

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

export const sortPeopleAtoZ = async () => {
  const unsorted = fs.readFileSync("./src/assets/peopleDB.json", {
    encoding: "utf8",
  });
  const sorted = JSON.parse(unsorted)?.reduce((acc, person: Person) => {
    const key = person.nazwisko.split("")[0].toLowerCase();
    const rest = acc[key] || [];

    const { imie, nazwisko, o_mnie, ulubiony_kolor } = person;

    return {
      ...acc,
      [key]: [...rest, { imie, nazwisko, o_mnie, ulubiony_kolor }],
    };
  }, {});

  const wasSortingSuccess = Object.keys(sorted).length > 0;

  if (!wasSortingSuccess) {
    console.error("Sth went wrong with creating on optimised database :(");
    return;
  }

  for (let key in sorted) {
    const people = sorted[key];
    people.sort();
  }

  fs.writeFileSync("./src/assets/peopleSorted.json", JSON.stringify(sorted), {
    encoding: "utf8",
  });
};

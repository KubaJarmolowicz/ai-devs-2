import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { sortPeopleAtoZ } from "../utils";

type PeopleTask = AIDevsAPI.BaseResponse & {
  question: string;
};

export const generateAnswer = async (task: PeopleTask): Promise<string> => {
  const fs = require("fs");
  const db = JSON.parse(fs.readFileSync("./src/assets/peopleSorted.json"));
  const chat = new ChatOpenAI();

  const { question } = task;

  const { content: fullName } = await chat.call([
    new SystemMessage(
      `Don't answer the user's question. You need to reply only with the full name of the person in question. Do not include any comments or remarks or punctuation, just a JSON. IMPORTANT: First name should be an official form, so if it is a diminutive, please return an official form ### Example: user: Jaki jest ulubiony kolor Kuby Jarmolowicza? AI: {"firstName": "Jakub", "lastName":"Jarmolowicz"} ###`
    ),
    new HumanMessage(`${question}`),
  ]);

  const { firstName, lastName } = JSON.parse(fullName);

  const key = lastName.split("")[0].toLowerCase();

  const data = db[key].find(
    (person) => person.imie === firstName && person.nazwisko === lastName
  );

  if (!data) {
    console.error("No such person was found :(", { firstName, lastName });
    return "";
  }

  console.log("Person found!!: ", data);

  const { content: answer } = await chat.call([
    new SystemMessage(
      `Please answer the question as truthfully, using only and exclusively the context provided! If you can't answer based on the context, say 'Don't know', ### Context: Hej! Jestem ${data.imie} ${data.nazwisko}. Coś o mnie: ${data.o_mnie}. Mój ulubiony kolor to ${data.ulubiony_kolor} ###`
    ),
    new HumanMessage(`${question}`),
  ]);

  return answer;
};

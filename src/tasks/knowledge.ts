import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

const DB_1 = "database #1";
const DB_2 = "database #2";

type Knowledge = AIDevsAPI.BaseResponse & {
  hint: string;
  question: string;
  [DB_1]: string;
  [DB_2]: string;
};

export const generateAnswer = async (task: Knowledge): Promise<string> => {
  const { question } = task;
  const currencyApiURL = "http://api.nbp.pl/api/exchangerates/tables/a";
  const chat = new ChatOpenAI();
  const { content: category } = await chat.call([
    new SystemMessage(
      "Zaklasyfikuj, na temat czego użytkownik zadaje pytanie. Odpowiedz jedną z 3 możliwości, pomijając jakiekolwiek inne znaki i komentarze. Do wyboru: curr, pop, misc"
    ),
    new HumanMessage(`${question}`),
  ]);

  let result = "";

  switch (category) {
    case "curr": {
      const res = await fetch(currencyApiURL);
      const context = await res.json();
      console.log("CONTEXT CURR: ", context);
      const { content: answer } = await chat.call([
        new SystemMessage(
          `Odpowiedz na pytanie tylko i wyłącznie na podstawie podanego kontekstu. Jeżeli w konteście nie będzie niezbędnych danych, odpowiedz 'Nie wiem'. ### KONTEKST: ${context.rates.map(
            (rate) => {
              return `
                \n\n
                Waluta: ${rate.currency}, kurs: ${rate.mid}
                `;
            }
          )} ###`
        ),
        new HumanMessage(`${question}`),
      ]);

      result = answer;
      break;
    }
    case "pop": {
      const { content: country } = await chat.call([
        new SystemMessage(
          `Nie odpowiadaj na pytanie użytkownika. Zwróć jedynie nazwę kraju po angielsku, bez zbędnych znaków i komentarzy.`
        ),
        new HumanMessage(`${question}`),
      ]);

      const countryApiURL = `https://restcountries.com/v3.1/name/${country}`;
      const res = await fetch(countryApiURL);
      const context = await res.json();
      console.log("CONTEXT POP: ", context);
      const { content: answer } = await chat.call([
        new SystemMessage(
          `Odpowiedz na pytanie tylko i wyłącznie na podstawie podanego kontekstu. Jeżeli w konteście nie będzie niezbędnych danych, odpowiedz 'Nie wiem'. ### KONTEKST: Nazwa państwa: ${context[0]?.name.common} Populacja: ${context[0]?.population} ###`
        ),
        new HumanMessage(`${question}`),
      ]);

      result = answer;
      break;
    }
    case "misc": {
      const { content: answer } = await chat.call([
        new SystemMessage(
          "Jesteś mistrzem wiedzy ogólnej. Odpowiedz na pytanie użytkownika krótko i bez zbędnych komentarzy."
        ),
        new HumanMessage(`${question}`),
      ]);

      result = answer;
      break;
    }
  }

  return result;
};

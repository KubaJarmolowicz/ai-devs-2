import { OpenAIService } from "../services/openAIService";
import { getNonStreamingChatMsg } from "../utils";
type BloggerTask = AIDevsAPI.BaseResponse & {
  blog: string[];
};

export const generateAnswer = async (task: BloggerTask): Promise<string> => {
  const system = `Jako bloger kulinarny i programista, twoim zadaniem będzie napisanie wpisu na bloga dotyczącego pizzy Margheritta.
    Otrzymasz tablicę  ciągów znaków, której każdy element stanowi tytuł rozdziału. Na podstawie treści każdego tytułu, napisz po jednym poście, opisującym szczegółowo daną kwestię. Wpis który stworzysz, powinien składać się z tylu rozdziałów, ile będzie tytułów.
    Odpowiedź zwróć w formacie tablicy JSON, składającej się z treści stworzonych rozdziałów. Obiekty w tablicy powinny zawierać tylko i wyłącznie pola "title" i "content".
    `;
  const user = `${task.blog}`;
  try {
    const res = await OpenAIService.chat.completions.create(
      getNonStreamingChatMsg(system, user)
    );
    const choices = res.choices || [];
    if (choices.length) {
      const latestResponse = choices[choices.length - 1]?.message;
      console.log(
        "SUCCESSFUL TEST INTEGRATION. HERE'S ASSISSTANT'S RESPONSE ### =>",
        latestResponse
      );
      return JSON.stringify(
        JSON.parse(latestResponse.content)?.map((post) => post.content)
      );
    }
  } catch (e) {
    console.error("ERROR in testIntegration =>", e);
  }
};

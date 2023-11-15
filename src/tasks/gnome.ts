import { MODELS } from "../consts";
import { OpenAIService } from "../services/openAIService";

type GnomeTask = AIDevsAPI.BaseResponse & {
  url: string;
};

export const generateAnswer = async (task: GnomeTask): Promise<string> => {
  const { url } = task;
  const response = await OpenAIService.chat.completions.create({
    model: MODELS.VISION,
    messages: [
      {
        role: "system",
        content:
          "The user will provide an url with a picture. You have to determine if what you see in the picture is a gnome wearing a colored cap. If not, respond with one word: 'ERROR'. If it is, respond with one word: the color of it's cap in Polish.",
      },
      {
        role: "user",
        //@ts-ignore
        content: [
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
  });

  return response?.choices?.[0]?.message?.content;
};

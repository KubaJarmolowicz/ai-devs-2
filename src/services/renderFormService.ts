import { HTTP_METHODS } from "../consts";

type RenderImageConfig = {
  templateId?: string;
  text: string;
  imageUrl: string;
};

type RenderFormResponseData = { requestId: string; href: string };

export class RenderFormService {
  static getRenderedImageHref = async ({
    templateId = "fat-yetis-sigh-rarely-1785",
    text,
    imageUrl,
  }: RenderImageConfig): Promise<string> => {
    const headers = new Headers({
      "X-API-KEY": process.env.RENDER_FORM_API_KEY,
      "Content-Type": "application/json",
    });

    const requestData = {
      template: templateId,
      data: {
        "monkey-title.color": "#ffffff",
        "monkey-title.text": text,
        "monkey-image.src": imageUrl,
        "monkey-bg.color": "#000000",
      },
    };

    const request = new Request("https://get.renderform.io/api/v2/render", {
      headers,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(requestData),
    });

    try {
      const res: Response = await fetch(request);
      const { href }: RenderFormResponseData = await res.json();

      return href;
    } catch (e) {
      console.error("ERROR in RenderFormService.speechToText", e);
    }
  };
}

import {
  ModerationCreateParams,
  ModerationCreateResponse,
} from "openai/resources";
import { OpenAIService } from "./openAIService";

export class ModerationService {
  static getFlaggedStatus = async (inputs: string[]) => {
    const body: ModerationCreateParams = {
      input: inputs,
    };
    try {
      const { results }: ModerationCreateResponse =
        await OpenAIService.moderations.create(body);
      return results.map((result) => (result.flagged ? 1 : 0));
    } catch (e) {
      console.error("ERROR in ModerationService.getFlaggedStatus", e);
    }
  };
}

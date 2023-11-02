import { OpenAIService } from "./openAIService";
import {
  Transcription,
  TranscriptionCreateParams,
} from "openai/resources/audio/transcriptions";
import { MODELS } from "../consts";

export class TranscriptionService {
  static speechToText = async (file: Response) => {
    const body: TranscriptionCreateParams = {
      file,
      model: MODELS.WHISPER,
    };
    try {
      const { text = "" }: Transcription =
        await OpenAIService.audio.transcriptions.create(body);

      return text;
    } catch (e) {
      console.error("ERROR in TranscriptionService.speechToText", e);
    }
  };
}

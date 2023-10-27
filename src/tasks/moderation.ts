import { ModerationService } from "../services/moderationService";

export const generateAnswer = async (task): Promise<string> => {
  const moderationRes = await ModerationService.getFlaggedStatus(task.input);
  return JSON.stringify(moderationRes);
};

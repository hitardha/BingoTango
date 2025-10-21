'use server';

import { recommendLobby, RecommendLobbyInput } from '@/ai/flows/lobby-recommendation';
import { z } from 'zod';

const formSchema = z.object({
  userPreferences: z.string().min(1, "Please describe your preferences."),
  gameplayHistory: z.string().min(1, "Please describe your gameplay history."),
  preferredStakes: z.string(),
  gameTypes: z.string(),
  communityParticipation: z.string(),
});

export async function getLobbyRecommendation(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = formSchema.parse(data);

    const input: RecommendLobbyInput = {
      userPreferences: parsedData.userPreferences,
      gameplayHistory: parsedData.gameplayHistory,
      preferredStakes: parsedData.preferredStakes,
      gameTypes: parsedData.gameTypes,
      communityParticipation: parsedData.communityParticipation,
    };

    const recommendation = await recommendLobby(input);
    return { success: true, data: recommendation };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid form data.' };
    }
    console.error(error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

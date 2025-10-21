'use server';

/**
 * @fileOverview Recommends optimal Bingo rooms based on user preferences and gameplay history.
 *
 * - recommendLobby - A function that recommends a Bingo lobby for a user.
 * - RecommendLobbyInput - The input type for the recommendLobby function.
 * - RecommendLobbyOutput - The return type for the recommendLobby function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLobbyInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user\u2019s preferences for Bingo games.'),
  gameplayHistory: z
    .string()
    .describe('The user\u2019s recent gameplay history.'),
  preferredStakes: z
    .string()
    .describe('The user\u2019s preferred stakes for Bingo games.'),
  gameTypes: z.string().describe('The user\u2019s preferred game types.'),
  communityParticipation: z
    .string()
    .describe('The user\u2019s preferred level of community participation.'),
});
export type RecommendLobbyInput = z.infer<typeof RecommendLobbyInputSchema>;

const RecommendLobbyOutputSchema = z.object({
  lobbyRecommendation: z.string().describe('The recommended Bingo lobby.'),
  reasoning: z.string().describe('The AI\u2019s reasoning for the recommendation.'),
});
export type RecommendLobbyOutput = z.infer<typeof RecommendLobbyOutputSchema>;

export async function recommendLobby(
  input: RecommendLobbyInput
): Promise<RecommendLobbyOutput> {
  return recommendLobbyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLobbyPrompt',
  input: {schema: RecommendLobbyInputSchema},
  output: {schema: RecommendLobbyOutputSchema},
  prompt: `Based on the user's preferences, gameplay history, preferred stakes, game types, and community participation, recommend an optimal Bingo lobby for the user.

User Preferences: {{{userPreferences}}}
Gameplay History: {{{gameplayHistory}}}
Preferred Stakes: {{{preferredStakes}}}
Game Types: {{{gameTypes}}}
Community Participation: {{{communityParticipation}}}

Lobby Recommendation:`,
});

const recommendLobbyFlow = ai.defineFlow(
  {
    name: 'recommendLobbyFlow',
    inputSchema: RecommendLobbyInputSchema,
    outputSchema: RecommendLobbyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

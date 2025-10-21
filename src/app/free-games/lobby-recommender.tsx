'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLobbyRecommendation } from './actions';
import type { RecommendLobbyOutput } from '@/ai/flows/lobby-recommendation';

const formSchema = z.object({
  userPreferences: z.string().min(10, "Please describe your preferences in a bit more detail."),
  gameplayHistory: z.string().min(10, "Please describe your gameplay history in a bit more detail."),
  preferredStakes: z.string(),
  gameTypes: z.string(),
  communityParticipation: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function LobbyRecommender() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendLobbyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: "",
      gameplayHistory: "",
      preferredStakes: "Low Stakes",
      gameTypes: "75-Ball Bingo",
      communityParticipation: "Active Chat",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setRecommendation(null);
    setError(null);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await getLobbyRecommendation(formData);

    if (result.success) {
      setRecommendation(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Bot className="size-6 text-primary" />
          AI Lobby Recommender
        </CardTitle>
        <CardDescription>
          Fill out your preferences and let our AI find the perfect bingo room for you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I like fast-paced games with friendly chat." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gameplayHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Gameplay</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I usually play in the evenings and have won a few small pots." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="preferredStakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stakes</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select stakes" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low Stakes">Low Stakes</SelectItem>
                        <SelectItem value="Medium Stakes">Medium Stakes</SelectItem>
                        <SelectItem value="High Stakes">High Stakes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gameTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select game type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="75-Ball Bingo">75-Ball Bingo</SelectItem>
                        <SelectItem value="90-Ball Bingo">90-Ball Bingo</SelectItem>
                        <SelectItem value="Speed Bingo">Speed Bingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="communityParticipation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select community style" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active Chat">Active Chat</SelectItem>
                        <SelectItem value="Quiet and Focused">Quiet and Focused</SelectItem>
                        <SelectItem value="Team Play">Team Play</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Find My Lobby'
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {recommendation && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center gap-2">
                    <Sparkles className="size-5 text-primary"/>
                    Your Recommended Lobby
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{recommendation.lobbyRecommendation}</h3>
                    <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

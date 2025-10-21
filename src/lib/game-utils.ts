import { adCampaigns, DEFAULT_AD, AdConfig } from './ads-config';

/**
 * Determines the active ad configuration based on the current date.
 * @returns The active AdConfig object or a default ad if no campaign is active.
 */
export function getActiveAdConfig(): AdConfig {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  const activeAd = adCampaigns.find(ad => {
    const startDate = new Date(ad.startDate);
    const endDate = new Date(ad.endDate);
    return today >= startDate && today <= endDate;
  });

  return activeAd || DEFAULT_AD;
}

// Helper function to parse numbers and ranges
export const parseNumbers = (input: string): Set<number> => {
    const numbers = new Set<number>();
    if (!input) return numbers;

    const parts = input.split(',').map(part => part.trim());
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    numbers.add(i);
                }
            }
        } else {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
                numbers.add(num);
            }
        }
    }
    return numbers;
};


/**
 * Shuffles an array in place.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

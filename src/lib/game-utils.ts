import { adConfig, AdCreative } from './ads-config';

type AdPlacement = keyof typeof adConfig;

/**
 * Determines the active ad creative for a given placement based on the current date.
 * @param placement The name of the ad placement (e.g., 'game', 'tickets').
 * @returns The active AdCreative object.
 */
export function getActiveAd(placement: AdPlacement): AdCreative {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const placementConfig = adConfig[placement];

  if (!placementConfig) {
    // Fallback to a generic default if the placement doesn't exist
    return {
      imagePath: 'https://placehold.co/800x100?text=Ad+Not+Found',
      linkUrl: '#',
      dataAiHint: 'error',
    };
  }

  const activeCampaign = placementConfig.campaigns.find(campaign => {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return today >= startDate && today <= endDate;
  });

  return activeCampaign || placementConfig.default;
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

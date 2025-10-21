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

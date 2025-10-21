export interface AdConfig {
    id: string;
    startDate: string;
    endDate: string;
    imagePath: string;
    linkUrl: string;
    dataAiHint: string;
}

// Default ad to show when no other ad is active
export const DEFAULT_AD: AdConfig = {
    id: 'default',
    startDate: '2000-01-01',
    endDate: '2999-12-31',
    imagePath: 'https://picsum.photos/seed/ad-default/800/100',
    linkUrl: '#',
    dataAiHint: 'default advertisement'
};

// Add new ad campaigns here
export const adCampaigns: AdConfig[] = [
    {
        id: 'summer-sale-2024',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer/800/100',
        linkUrl: '#',
        dataAiHint: 'summer sale'
    },
    {
        id: 'winter-special-2024',
        startDate: '2024-11-01',
        endDate: '2025-01-31',
        imagePath: 'https://picsum.photos/seed/ad-winter/800/100',
        linkUrl: '#',
        dataAiHint: 'winter special'
    }
];

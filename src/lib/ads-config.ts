export interface AdPlacement {
    imagePath: string;
    linkUrl: string;
    dataAiHint: string;
    youtubeUrl?: string;
}

export interface AdConfig {
    id: string;
    startDate: string;
    endDate: string;
    game: AdPlacement;
    tickets: AdPlacement;
    wheel: AdPlacement;
    winner: AdPlacement;
    scoreCalculator: AdPlacement;
}

// Default ad to show when no other ad is active
export const DEFAULT_AD: AdConfig = {
    id: 'default',
    startDate: '2000-01-01',
    endDate: '2999-12-31',
    game: {
        imagePath: 'https://picsum.photos/seed/ad-default-game/800/100',
        linkUrl: '#',
        dataAiHint: 'default advertisement'
    },
    tickets: {
        imagePath: 'https://picsum.photos/seed/ad-default-tickets/400/80',
        linkUrl: '#',
        dataAiHint: 'default advertisement'
    },
    wheel: {
        imagePath: 'https://picsum.photos/seed/ad-default-wheel/800/100',
        linkUrl: '#',
        dataAiHint: 'default advertisement'
    },
    winner: {
        imagePath: 'https://picsum.photos/seed/ad-default-winner/800/100',
        linkUrl: '#',
        dataAiHint: 'default advertisement'
    },
    scoreCalculator: {
        imagePath: 'https://picsum.photos/seed/ad-default-calc/800/100',
        linkUrl: '#',
        dataAiHint: 'default advertisement'
    }
};

// Add new ad campaigns here
export const adCampaigns: AdConfig[] = [
    {
        id: 'summer-sale-2024',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        game: {
            imagePath: 'https://picsum.photos/seed/ad-summer-game/800/100',
            linkUrl: '#',
            dataAiHint: 'summer sale'
        },
        tickets: {
            imagePath: 'https://picsum.photos/seed/ad-summer-tickets/400/80',
            linkUrl: '#',
            dataAiHint: 'summer sale'
        },
        wheel: {
            imagePath: 'https://picsum.photos/seed/ad-summer-wheel/800/100',
            linkUrl: '#',
            dataAiHint: 'summer sale'
        },
        winner: {
            imagePath: 'https://picsum.photos/seed/ad-summer-winner/800/100',
            linkUrl: '#',
            dataAiHint: 'summer sale'
        },
        scoreCalculator: {
            imagePath: 'https://picsum.photos/seed/ad-summer-calc/800/100',
            linkUrl: '#',
            dataAiHint: 'summer sale'
        }
    },
];

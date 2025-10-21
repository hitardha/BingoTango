export interface AdCreative {
  imagePath: string;
  linkUrl: string;
  dataAiHint: string;
  youtubeUrl?: string;
}

export interface AdCampaign extends AdCreative {
  startDate: string;
  endDate: string;
}

export interface AdPlacementConfig {
  default: AdCreative;
  campaigns: AdCampaign[];
}

export const adConfig = {
  game: {
    default: {
      imagePath: 'https://picsum.photos/seed/ad-default-game/800/100',
      linkUrl: '#',
      dataAiHint: 'default advertisement',
    },
    campaigns: [
      {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-game/800/100',
        linkUrl: '#',
        dataAiHint: 'summer sale',
      },
    ],
  },
  tickets: {
    default: {
      imagePath: 'https://picsum.photos/seed/ad-default-tickets/400/80',
      linkUrl: '#',
      dataAiHint: 'default advertisement',
    },
    campaigns: [
      {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-tickets/400/80',
        linkUrl: '#',
        dataAiHint: 'summer sale',
      },
    ],
  },
  ticketCard: {
     default: {
      imagePath: 'https://picsum.photos/seed/ad-default-ticketcard/400/80',
      linkUrl: '#',
      dataAiHint: 'default advertisement',
    },
    campaigns: [
       {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-ticketcard/400/80',
        linkUrl: '#',
        dataAiHint: 'summer sale',
      },
    ]
  },
  wheel: {
    default: {
      imagePath: 'https://picsum.photos/seed/ad-default-wheel/800/100',
      linkUrl: '#',
      dataAiHint: 'default advertisement',
    },
    campaigns: [
      {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-wheel/800/100',
        linkUrl: '#',
        dataAiHint: 'summer sale',
      },
    ],
  },
  winner: {
    default: {
      imagePath: 'https://picsum.photos/seed/ad-default-winner/800/100',
      linkUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      dataAiHint: 'default advertisement',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    campaigns: [
      {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-winner/800/100',
        linkUrl: '#',
        dataAiHint: 'summer sale',
        youtubeUrl: 'https://www.youtube.com/watch?v=yC8SPG2LwSA',
      },
    ],
  },
  scoreCalculator: {
    default: {
      imagePath: 'https://picsum.photos/seed/ad-default-calc/800/100',
      linkUrl: '#',
      dataAiHint: 'default advertisement',
    },
    campaigns: [
       {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        imagePath: 'https://picsum.photos/seed/ad-summer-calc/800/100',
        linkUrl: '#',
        dataAiHint: 'summer sale',
      },
    ]
  },
};

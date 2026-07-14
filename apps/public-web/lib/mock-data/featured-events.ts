import type { FeaturedEvent } from '@/components/landing/types';

const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: '1',
    name: 'Summer Jazz Night',
    slug: 'summer-jazz-night',
    description: 'An evening of live jazz on the rooftop with local artists and city views.',
    bannerUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
    startDatetime: '2026-08-15T19:30:00.000Z',
  },
  {
    id: '2',
    name: 'Tech Forward Summit',
    slug: 'tech-forward-summit',
    description:
      'Keynotes, workshops, and networking for builders shaping the next wave of products.',
    bannerUrl: 'https://picsum.photos/seed/tech-summit/640/360',
    startDatetime: '2026-09-20T09:00:00.000Z',
  },
  {
    id: '3',
    name: 'Harvest Food & Wine Festival',
    slug: 'harvest-food-wine-festival',
    description:
      'Seasonal tastings, chef demos, and pairings from regional vineyards and kitchens.',
    bannerUrl: null,
    startDatetime: '2026-10-05T17:00:00.000Z',
  },
  {
    id: '4',
    name: 'New Year Gala',
    slug: 'new-year-gala',
    description: 'Ring in the new year with dinner, dancing, and a midnight countdown celebration.',
    bannerUrl: 'https://picsum.photos/seed/new-year-gala/640/360',
    startDatetime: '2026-12-31T20:00:00.000Z',
  },
];

export function getFeaturedEvents(): FeaturedEvent[] {
  return FEATURED_EVENTS;
}

import type { VenueHighlight } from '@/components/landing/types';

const VENUE_HIGHLIGHTS: VenueHighlight[] = [
  {
    id: '1',
    name: 'Harborview Pavilion',
    slug: 'harborview-pavilion',
    description:
      'Waterfront venue with open-air terraces and skyline views for concerts and galas.',
    imageUrl: 'https://picsum.photos/seed/harborview/640/360',
    city: 'San Diego, CA',
  },
  {
    id: '2',
    name: 'The Loft at Market Street',
    slug: 'the-loft-at-market-street',
    description:
      'Industrial-chic loft space ideal for workshops, launches, and intimate gatherings.',
    imageUrl: 'https://picsum.photos/seed/market-loft/640/360',
    city: 'Austin, TX',
  },
  {
    id: '3',
    name: 'Cedar Hall',
    slug: 'cedar-hall',
    description:
      'Historic hall with vaulted ceilings, warm acoustics, and flexible seating layouts.',
    imageUrl: null,
    city: 'Portland, OR',
  },
  {
    id: '4',
    name: 'Skyline Terrace',
    slug: 'skyline-terrace',
    description: 'Rooftop terrace surrounded by city lights, perfect for seasonal showcases.',
    imageUrl: 'https://picsum.photos/seed/skyline-terrace/640/360',
    city: 'Chicago, IL',
  },
];

export function getVenueHighlights(): VenueHighlight[] {
  return VENUE_HIGHLIGHTS;
}

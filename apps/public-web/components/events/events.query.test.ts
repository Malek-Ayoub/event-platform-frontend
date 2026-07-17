import { describe, expect, it } from 'vitest';
import type { PublicComponents } from '@event-platform/api-client/core';
import { mapToEventCardViewModel } from './events.query';

type PublicEventListItem = PublicComponents['schemas']['PublicEventListItem'];

const SAMPLE_ITEM: PublicEventListItem = {
  id: 1,
  slug: 'summer-jazz-night',
  title: 'Summer Jazz Night',
  description: 'An evening of jazz.',
  venue: 'Harborview Pavilion',
  image_url: null,
  starts_at: '2026-08-15T19:30:00.000Z',
  starting_price: {
    amount: '45.00',
    currency: 'USD',
  },
};

describe('events.query', () => {
  it('maps a public event list item to an event card view model', () => {
    expect(mapToEventCardViewModel(SAMPLE_ITEM)).toEqual({
      id: '1',
      slug: 'summer-jazz-night',
      title: 'Summer Jazz Night',
      venue: 'Harborview Pavilion',
      imageUrl: null,
      startDatetime: '2026-08-15T19:30:00.000Z',
      dateLabel: expect.any(String),
      priceLabel: '$45.00',
    });
  });

  it('maps free events when starting_price is absent', () => {
    expect(
      mapToEventCardViewModel({
        ...SAMPLE_ITEM,
        starting_price: null,
      }).priceLabel,
    ).toBe('Free');
  });
});

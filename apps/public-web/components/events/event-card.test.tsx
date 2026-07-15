import { formatCurrency, formatDateTime } from '@event-platform/shared';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EventCard } from './event-card';
import { EventsGridPlaceholder } from './events-grid-placeholder';

const SAMPLE_EVENT = {
  id: '1',
  slug: 'summer-jazz-night',
  title: 'Summer Jazz Night',
  venue: 'Harborview Pavilion',
  imageUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
  startDatetime: '2026-08-15T19:30:00.000Z',
  price: { amount: 45, currency: 'USD' },
};

const FREE_EVENT = {
  id: '3',
  slug: 'harvest-food-wine-festival',
  title: 'Harvest Food & Wine Festival',
  venue: 'Cedar Hall',
  imageUrl: null,
  startDatetime: '2026-10-05T17:00:00.000Z',
  price: null,
};

const EXPECTED_EVENT_TITLES = [
  'Summer Jazz Night',
  'Tech Forward Summit',
  'Harvest Food & Wine Festival',
] as const;

describe('EventCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders formatted title, venue, date, and price', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByText('Harborview Pavilion')).toBeTruthy();
    expect(screen.getByText(formatDateTime(SAMPLE_EVENT.startDatetime))).toBeTruthy();
    expect(
      screen.getByText(formatCurrency(SAMPLE_EVENT.price.amount, SAMPLE_EVENT.price.currency)),
    ).toBeTruthy();
  });

  it('renders Free when price is null', () => {
    render(<EventCard {...FREE_EVENT} />);

    expect(screen.getByText('Free')).toBeTruthy();
  });

  it('exposes id and slug as data attributes for future detail linking', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    const card = screen.getByRole('article');
    expect(card.getAttribute('data-event-id')).toBe('1');
    expect(card.getAttribute('data-slug')).toBe('summer-jazz-night');
  });

  it('does not render links or buttons', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('EventsGridPlaceholder with EventCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a single list with three list items', () => {
    render(<EventsGridPlaceholder />);

    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders an event card inside each list item in order', () => {
    render(<EventsGridPlaceholder />);

    const listItems = screen.getAllByRole('listitem');

    listItems.forEach((listItem, index) => {
      expect(within(listItem).getByRole('article')).toBeTruthy();
      expect(
        within(listItem).getByRole('heading', { level: 3, name: EXPECTED_EVENT_TITLES[index] }),
      ).toBeTruthy();
    });
  });

  it('does not render links or buttons in the grid', () => {
    render(<EventsGridPlaceholder />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EventCard } from './event-card';
import type { EventCardViewModel } from './events.query';

const SAMPLE_EVENT: EventCardViewModel = {
  id: '1',
  slug: 'summer-jazz-night',
  title: 'Summer Jazz Night',
  venue: 'Harborview Pavilion',
  imageUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
  startDatetime: '2026-08-15T19:30:00.000Z',
  dateLabel: 'Aug 15, 2026, 7:30 PM',
  priceLabel: '$45.00',
};

const FREE_EVENT: EventCardViewModel = {
  id: '3',
  slug: 'harvest-food-wine-festival',
  title: 'Harvest Food & Wine Festival',
  venue: 'Cedar Hall',
  imageUrl: null,
  startDatetime: '2026-10-05T17:00:00.000Z',
  dateLabel: 'Oct 5, 2026, 5:00 PM',
  priceLabel: 'Free',
};

describe('EventCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders formatted title, venue, date, and price labels', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByText('Harborview Pavilion')).toBeTruthy();
    expect(screen.getByText('Aug 15, 2026, 7:30 PM')).toBeTruthy();
    expect(screen.getByText('$45.00')).toBeTruthy();
  });

  it('renders the free price label', () => {
    render(<EventCard {...FREE_EVENT} />);

    expect(screen.getByText('Free')).toBeTruthy();
  });

  it('exposes id and slug as data attributes for future detail linking', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    const card = screen.getByRole('article');
    expect(card.getAttribute('data-event-id')).toBe('1');
    expect(card.getAttribute('data-slug')).toBe('summer-jazz-night');
  });

  it('wraps the card with an event detail link', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    const link = screen.getByRole('link', { name: 'View event: Summer Jazz Night' });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/events/summer-jazz-night');

    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('EventCard list rendering', () => {
  afterEach(() => {
    cleanup();
  });

  const EVENTS: EventCardViewModel[] = [
    SAMPLE_EVENT,
    {
      id: '2',
      slug: 'tech-forward-summit',
      title: 'Tech Forward Summit',
      venue: 'The Loft at Market Street',
      imageUrl: 'https://picsum.photos/seed/tech-summit/640/360',
      startDatetime: '2026-09-20T09:00:00.000Z',
      dateLabel: 'Sep 20, 2026, 9:00 AM',
      priceLabel: '$120.00',
    },
    FREE_EVENT,
  ];

  it('renders a single list with three list items', () => {
    render(
      <ul>
        {EVENTS.map((event) => (
          <li key={event.id}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>,
    );

    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders an event card inside each list item in order', () => {
    render(
      <ul>
        {EVENTS.map((event) => (
          <li key={event.id}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>,
    );

    const listItems = screen.getAllByRole('listitem');

    listItems.forEach((listItem, index) => {
      expect(within(listItem).getByRole('article')).toBeTruthy();
      expect(
        within(listItem).getByRole('heading', { level: 3, name: EVENTS[index]?.title }),
      ).toBeTruthy();
    });
  });
});

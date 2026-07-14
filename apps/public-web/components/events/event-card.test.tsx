import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EventCard } from './event-card';
import { EventsGridPlaceholder } from './events-grid-placeholder';

const SAMPLE_EVENT = {
  title: 'Summer Jazz Night',
  venue: 'Harborview Pavilion',
  date: 'Aug 15, 2026, 7:30 PM',
  price: 'From $45',
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

  it('renders event title, venue, date, and price', () => {
    render(<EventCard {...SAMPLE_EVENT} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByText('Harborview Pavilion')).toBeTruthy();
    expect(screen.getByText('Aug 15, 2026, 7:30 PM')).toBeTruthy();
    expect(screen.getByText('From $45')).toBeTruthy();
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

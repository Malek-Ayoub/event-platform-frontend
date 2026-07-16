import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { UpcomingEventViewModel } from '@/components/events/events.query';
import { useUpcomingEventsQuery } from '@/components/events/events.query';
import { FeaturedEventsSection } from './featured-events-section';

vi.mock('@/components/events/events.query', () => ({
  useUpcomingEventsQuery: vi.fn(),
}));

const MOCK_EVENTS: UpcomingEventViewModel[] = [
  {
    id: '1',
    name: 'Summer Jazz Night',
    slug: 'summer-jazz-night',
    description: 'An evening of live jazz on the rooftop.',
    bannerUrl: null,
    startDatetime: '2026-08-15T19:30:00.000Z',
  },
  {
    id: '2',
    name: 'Tech Forward Summit',
    slug: 'tech-forward-summit',
    description: 'Keynotes and workshops for builders.',
    bannerUrl: null,
    startDatetime: '2026-09-20T09:00:00.000Z',
  },
];

describe('FeaturedEventsSection', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.mocked(useUpcomingEventsQuery).mockReset();
  });

  it('renders the Upcoming Events heading and intro copy', () => {
    vi.mocked(useUpcomingEventsQuery).mockReturnValue({
      data: MOCK_EVENTS,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUpcomingEventsQuery>);

    render(<FeaturedEventsSection />);

    expect(screen.getByRole('heading', { level: 2, name: 'Upcoming Events' })).toBeTruthy();
    expect(screen.getByText('Discover what is coming up next on the calendar.')).toBeTruthy();
  });

  it('renders upcoming event cards with accessible headings', () => {
    vi.mocked(useUpcomingEventsQuery).mockReturnValue({
      data: MOCK_EVENTS,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUpcomingEventsQuery>);

    render(<FeaturedEventsSection />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Tech Forward Summit' })).toBeTruthy();
  });

  it('renders an empty state when no upcoming events are available', () => {
    vi.mocked(useUpcomingEventsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUpcomingEventsQuery>);

    render(<FeaturedEventsSection />);

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('No upcoming events right now')).toBeTruthy();
    expect(screen.getByText('Check back soon for events you can discover and book.')).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeNull();
  });

  it('renders an error state with Retry that calls refetch', () => {
    const refetch = vi.fn();

    vi.mocked(useUpcomingEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useUpcomingEventsQuery>);

    render(<FeaturedEventsSection />);

    expect(screen.getByText('Unable to load events')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

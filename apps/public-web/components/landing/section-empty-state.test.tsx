import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SectionEmptyState } from './section-empty-state';

describe('SectionEmptyState', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and description with status semantics', () => {
    render(
      <SectionEmptyState
        sectionName="featured-events"
        title="No featured events right now"
        description="Check back soon for upcoming events you can discover and book."
      />,
    );

    const state = screen.getByRole('status');
    expect(state.getAttribute('data-slot')).toBe('featured-events-empty-state');
    expect(screen.getByText('No featured events right now')).toBeTruthy();
    expect(
      screen.getByText('Check back soon for upcoming events you can discover and book.'),
    ).toBeTruthy();
  });

  it('renders title only when description is omitted', () => {
    render(
      <SectionEmptyState sectionName="venue-highlights" title="No venue highlights right now" />,
    );

    expect(screen.getByRole('status').getAttribute('data-slot')).toBe(
      'venue-highlights-empty-state',
    );
    expect(screen.getByText('No venue highlights right now')).toBeTruthy();
  });
});

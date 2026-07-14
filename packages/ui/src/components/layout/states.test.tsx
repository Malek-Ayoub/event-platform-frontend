import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ErrorState } from './error-state.js';
import { InlineLoading, LoadingState } from './loading-state.js';
import { NotFoundState } from './not-found-state.js';

describe('global states', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders LoadingState with accessible status semantics', () => {
    render(<LoadingState title="Fetching page" />);

    const state = screen.getByRole('status');
    expect(state.getAttribute('aria-busy')).toBe('true');
    expect(state.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText('Fetching page')).toBeTruthy();
  });

  it('renders InlineLoading spinner label', () => {
    render(<InlineLoading label="Saving" />);

    expect(screen.getByText('Saving').closest('[data-slot="inline-loading"]')).not.toBeNull();
    expect(screen.getByText('Saving')).toBeTruthy();
  });

  it('renders ErrorState with alert semantics and action slot', () => {
    render(
      <ErrorState
        title="Request failed"
        description="Network error"
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('renders NotFoundState with default 404 copy and action slot', () => {
    render(<NotFoundState action={<a href="/">Home</a>} />);

    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppShell, DEFAULT_MAIN_CONTENT_ID } from './app-shell.js';
import { SkipLink } from './skip-link.js';

describe('responsive shell primitives', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders SkipLink targeting the configured main content id', () => {
    render(<SkipLink targetId="custom-main" />);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink.getAttribute('href')).toBe('#custom-main');
  });

  it('wires AppShell skip link to the main landmark by default', () => {
    render(
      <AppShell>
        <p>Body</p>
      </AppShell>,
    );

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const main = screen.getByRole('main');

    expect(skipLink.getAttribute('href')).toBe(`#${DEFAULT_MAIN_CONTENT_ID}`);
    expect(main.id).toBe(DEFAULT_MAIN_CONTENT_ID);
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('moves focus to the main landmark when the skip link is activated', () => {
    render(
      <AppShell>
        <p>Body</p>
      </AppShell>,
    );

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const main = screen.getByRole('main');

    fireEvent.click(skipLink);

    expect(document.activeElement).toBe(main);
  });

  it('exposes a single header landmark when provided', () => {
    render(
      <AppShell header={<div>Top bar</div>}>
        <p>Body</p>
      </AppShell>,
    );

    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByText('Top bar').closest('[data-slot="app-shell-header"]')).not.toBeNull();
  });
});

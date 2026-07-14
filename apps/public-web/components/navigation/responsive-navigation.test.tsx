import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

describe('public-web responsive navigation', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps desktop navigation separate from the mobile menu trigger', () => {
    render(
      <>
        <DesktopNavigation>
          <nav aria-label="Primary desktop">Desktop links</nav>
        </DesktopNavigation>
        <MobileNavigationDrawer>
          <nav aria-label="Primary mobile">Mobile links</nav>
        </MobileNavigationDrawer>
      </>,
    );

    expect(
      screen.getByLabelText('Primary desktop').closest('[data-slot="desktop-navigation"]'),
    ).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeTruthy();
    expect(screen.queryByLabelText('Primary mobile')).toBeNull();
  });

  it('opens the drawer and restores focus to the menu button on close', async () => {
    render(
      <MobileNavigationDrawer contentId="mobile-navigation">
        <nav aria-label="Primary mobile">Mobile links</nav>
      </MobileNavigationDrawer>,
    );

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton.getAttribute('aria-controls')).toBe('mobile-navigation');
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(menuButton);

    expect(await screen.findByRole('dialog', { name: 'Mobile navigation' })).toBeTruthy();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByLabelText('Primary mobile')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(menuButton);
    });
  });

  it('does not shift a layout sentinel when the drawer opens', async () => {
    render(
      <div>
        <div data-testid="sentinel">Sentinel</div>
        <MobileNavigationDrawer contentId="mobile-navigation">
          <nav aria-label="Primary mobile">Mobile links</nav>
        </MobileNavigationDrawer>
      </div>,
    );

    const sentinel = screen.getByTestId('sentinel');
    const before = sentinel.getBoundingClientRect();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await screen.findByRole('dialog', { name: 'Mobile navigation' });

    const after = sentinel.getBoundingClientRect();
    expect(after.left).toBe(before.left);
    expect(after.top).toBe(before.top);
  });
});

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from './footer.js';
import { Header } from './header.js';
import {
  Navigation,
  NavigationGroup,
  NavigationItem,
  NavigationLink,
  NavigationList,
} from './navigation.js';

describe('navigation shell', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Header with brand, navigation, and actions slots', () => {
    render(
      <Header
        brand={<span>Brand</span>}
        navigation={<span>Nav</span>}
        actions={<button type="button">Action</button>}
      />,
    );

    expect(screen.getByText('Brand').closest('[data-slot="header-brand"]')).not.toBeNull();
    expect(screen.getByText('Nav').closest('[data-slot="header-navigation"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Action' })).toBeTruthy();
  });

  it('renders Footer with brand, navigation, and meta slots', () => {
    render(
      <Footer
        brand={<span>Footer brand</span>}
        navigation={<span>Links</span>}
        meta={<span>Meta</span>}
      />,
    );

    expect(screen.getByText('Footer brand').closest('[data-slot="footer-brand"]')).not.toBeNull();
    expect(screen.getByText('Links').closest('[data-slot="footer-navigation"]')).not.toBeNull();
    expect(screen.getByText('Meta').closest('[data-slot="footer-meta"]')).not.toBeNull();
  });

  it('renders NavigationGroup with optional label and child items', () => {
    render(
      <Navigation aria-label="Grouped">
        <NavigationList>
          <NavigationGroup label="Main">
            <NavigationItem>
              <NavigationLink href="/">Home</NavigationLink>
            </NavigationItem>
          </NavigationGroup>
        </NavigationList>
      </Navigation>,
    );

    expect(screen.getByText('Main')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Home' }).closest('[data-slot="navigation-group"]'),
    ).not.toBeNull();
  });

  it('marks the active navigation link as the current page', () => {
    render(
      <Navigation aria-label="Test">
        <NavigationList>
          <NavigationItem>
            <NavigationLink href="/" active>
              Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="/events">Events</NavigationLink>
          </NavigationItem>
        </NavigationList>
      </Navigation>,
    );

    expect(screen.getByRole('navigation', { name: 'Test' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Home', current: 'page' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Events' }).getAttribute('aria-current')).toBeNull();
  });
});

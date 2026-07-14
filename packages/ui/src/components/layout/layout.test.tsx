import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppShell } from './app-shell.js';
import { Container } from './container.js';
import { PublicLayout } from './public-layout.js';
import { Section } from './section.js';

describe('layout foundation', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Container with width and horizontal padding only', () => {
    render(<Container data-testid="container">Content</Container>);

    const container = screen.getByTestId('container');
    expect(container.className).toContain('max-w-screen-xl');
    expect(container.className).toContain('px-6');
    expect(container.className).not.toMatch(/py-/);
  });

  it('renders Section with vertical spacing and variant classes', () => {
    render(
      <Section data-testid="section" spacing="lg" variant="muted">
        Block
      </Section>,
    );

    const section = screen.getByTestId('section');
    expect(section.tagName).toBe('SECTION');
    expect(section.className).toContain('py-16');
    expect(section.className).toContain('bg-surface');
  });

  it('renders AppShell with header, main, and footer slots', () => {
    render(
      <AppShell header={<div>Header</div>} footer={<div>Footer</div>}>
        <div>Main</div>
      </AppShell>,
    );

    expect(screen.getByText('Header').closest('[data-slot="app-shell-header"]')).not.toBeNull();
    expect(screen.getByText('Main').closest('[data-slot="app-shell-main"]')).not.toBeNull();
    expect(screen.getByText('Footer').closest('[data-slot="app-shell-footer"]')).not.toBeNull();
  });

  it('composes PublicLayout through AppShell without forcing a Container', () => {
    render(
      <PublicLayout>
        <p>Page content</p>
      </PublicLayout>,
    );

    const content = screen.getByText('Page content');
    const main = content.closest('[data-slot="app-shell-main"]');

    expect(main).not.toBeNull();
    expect(content.parentElement?.className ?? '').not.toContain('max-w-screen-xl');
  });

  it('supports Section → Container → Content composition', () => {
    render(
      <Section data-testid="section" spacing="md">
        <Container data-testid="container">
          <p>Nested content</p>
        </Container>
      </Section>,
    );

    const section = screen.getByTestId('section');
    const container = screen.getByTestId('container');
    const content = screen.getByText('Nested content');

    expect(section.className).toContain('py-12');
    expect(container.className).toContain('max-w-screen-xl');
    expect(content.closest('[data-testid="container"]')).not.toBeNull();
  });
});

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Drawer, DrawerBody, DrawerContent } from './drawer.js';

function ControlledDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="left" id="test-drawer">
          <DrawerBody>Drawer panel</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

describe('Drawer overlay', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('opens and closes from controlled state', async () => {
    render(<ControlledDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Drawer panel')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('does not keep the drawer mounted after close', async () => {
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent side="left">
          <DrawerBody>Panel</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();

    rerender(
      <Drawer open={false} onOpenChange={onOpenChange}>
        <DrawerContent side="left">
          <DrawerBody>Panel</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});

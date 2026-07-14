'use client';

import { useCallback, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '@event-platform/ui';
import { Drawer, DrawerBody, DrawerContent } from '@event-platform/ui/overlay';

export type MobileNavigationDrawerProps = {
  children: ReactNode;
  contentId?: string;
};

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function MobileNavigationDrawer({ children, contentId }: MobileNavigationDrawerProps) {
  const generatedId = useId();
  const panelId = contentId ?? generatedId.replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  const handleCloseAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        data-slot="mobile-menu-button"
        data-breakpoint="below-md"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </Button>
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent
          side="left"
          id={panelId}
          aria-label="Mobile navigation"
          onCloseAutoFocus={handleCloseAutoFocus}
        >
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

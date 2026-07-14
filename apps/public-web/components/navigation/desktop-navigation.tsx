import type { ReactNode } from 'react';

export type DesktopNavigationProps = {
  children: ReactNode;
  className?: string;
};

/** Reveals children from the shared Tailwind `md` breakpoint upward. */
export function DesktopNavigation({ children, className }: DesktopNavigationProps) {
  return (
    <div
      className={className ?? 'hidden md:block'}
      data-slot="desktop-navigation"
      data-breakpoint="md"
    >
      {children}
    </div>
  );
}

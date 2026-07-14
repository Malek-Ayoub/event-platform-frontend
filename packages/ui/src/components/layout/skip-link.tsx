import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export type SkipLinkProps = {
  targetId?: string;
  children?: ReactNode;
  className?: string;
};

export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to main content',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary',
        className,
      )}
      data-slot="skip-link"
    >
      {children}
    </a>
  );
}

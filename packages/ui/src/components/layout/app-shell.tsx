import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import { SkipLink } from './skip-link.js';

export const DEFAULT_MAIN_CONTENT_ID = 'main-content';

export type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
  mainId?: string;
  showSkipLink?: boolean;
  skipLink?: ReactNode;
};

export function AppShell({
  children,
  header,
  footer,
  className,
  headerClassName,
  mainClassName,
  footerClassName,
  mainId = DEFAULT_MAIN_CONTENT_ID,
  showSkipLink = true,
  skipLink,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-background text-foreground', className)}>
      {showSkipLink ? (skipLink ?? <SkipLink targetId={mainId} />) : null}
      {header ? (
        <header
          className={cn('shrink-0 border-b border-border bg-surface', headerClassName)}
          data-slot="app-shell-header"
        >
          {header}
        </header>
      ) : null}
      <main
        id={mainId}
        tabIndex={-1}
        className={cn('flex flex-1 flex-col outline-none', mainClassName)}
        data-slot="app-shell-main"
      >
        {children}
      </main>
      {footer ? (
        <footer
          className={cn('shrink-0 border-t border-border bg-surface', footerClassName)}
          data-slot="app-shell-footer"
        >
          {footer}
        </footer>
      ) : null}
    </div>
  );
}

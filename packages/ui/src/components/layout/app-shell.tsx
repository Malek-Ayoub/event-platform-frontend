import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
};

export function AppShell({
  children,
  header,
  footer,
  className,
  headerClassName,
  mainClassName,
  footerClassName,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-background text-foreground', className)}>
      {header ? (
        <header
          className={cn('shrink-0 border-b border-border bg-surface', headerClassName)}
          data-slot="app-shell-header"
        >
          {header}
        </header>
      ) : null}
      <main className={cn('flex flex-1 flex-col', mainClassName)} data-slot="app-shell-main">
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

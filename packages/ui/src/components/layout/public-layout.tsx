import type { ReactNode } from 'react';
import { AppShell, DEFAULT_MAIN_CONTENT_ID } from './app-shell.js';

export type PublicLayoutProps = {
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

export function PublicLayout({
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
}: PublicLayoutProps) {
  return (
    <AppShell
      className={className}
      header={header}
      footer={footer}
      headerClassName={headerClassName}
      mainClassName={mainClassName}
      footerClassName={footerClassName}
      mainId={mainId}
      showSkipLink={showSkipLink}
      skipLink={skipLink}
    >
      {children}
    </AppShell>
  );
}

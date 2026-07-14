import type { ReactNode } from 'react';
import { AppShell } from './app-shell.js';

export type PublicLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
};

export function PublicLayout({
  children,
  header,
  footer,
  className,
  headerClassName,
  mainClassName,
  footerClassName,
}: PublicLayoutProps) {
  return (
    <AppShell
      className={className}
      header={header}
      footer={footer}
      headerClassName={headerClassName}
      mainClassName={mainClassName}
      footerClassName={footerClassName}
    >
      {children}
    </AppShell>
  );
}

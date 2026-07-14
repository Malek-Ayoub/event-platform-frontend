import type { ReactNode } from 'react';
import { PublicLayout } from '@event-platform/ui/layout';

export type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}

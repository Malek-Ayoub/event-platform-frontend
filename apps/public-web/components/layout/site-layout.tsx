import type { ReactNode } from 'react';
import { PublicLayout } from '@event-platform/ui/layout';
import { SiteFooter } from '@/components/navigation/site-footer';
import { SiteHeader } from '@/components/navigation/site-header';

export type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <PublicLayout header={<SiteHeader />} footer={<SiteFooter />}>
      {children}
    </PublicLayout>
  );
}

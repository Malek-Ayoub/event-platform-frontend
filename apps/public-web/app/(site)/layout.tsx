import type { ReactNode } from 'react';
import { AppProviders } from '@/components/providers/app-providers';
import { SiteLayout } from '@/components/layout/site-layout';

export default function SiteRouteLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <SiteLayout>{children}</SiteLayout>
    </AppProviders>
  );
}

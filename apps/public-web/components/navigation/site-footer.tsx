'use client';

import { useTenant } from '@event-platform/tenant';
import { Footer } from '@event-platform/ui/layout';
import { SiteFooterNavigation } from '@/components/navigation/site-navigation';

export function SiteFooter() {
  const { branding } = useTenant();
  const year = new Date().getFullYear();

  return (
    <Footer
      brand={
        <div className="space-y-2">
          <p className="text-sm font-semibold">{branding.name}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Discover and book events from your favorite venues.
          </p>
        </div>
      }
      navigation={<SiteFooterNavigation />}
      meta={
        <p>
          © {year} {branding.name}. All rights reserved.
        </p>
      }
    />
  );
}

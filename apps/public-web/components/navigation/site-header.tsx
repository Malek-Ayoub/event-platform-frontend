'use client';

import Link from 'next/link';
import { useTenant } from '@event-platform/tenant';
import { Header } from '@event-platform/ui/layout';
import { DesktopNavigation } from '@/components/navigation/desktop-navigation';
import { MobileNavigationDrawer } from '@/components/navigation/mobile-navigation-drawer';
import { SiteNavigation } from '@/components/navigation/site-navigation';

const MOBILE_NAVIGATION_ID = 'mobile-navigation';

export function SiteHeader() {
  const { branding } = useTenant();

  return (
    <>
      <Header
        brand={
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {branding.logo ? (
              <img src={branding.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
              >
                {branding.name.charAt(0)}
              </span>
            )}
            <span className="truncate text-sm font-semibold tracking-tight">{branding.name}</span>
          </Link>
        }
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
        navigation={
          <DesktopNavigation>
            <SiteNavigation />
          </DesktopNavigation>
        }
        actions={
          <MobileNavigationDrawer contentId={MOBILE_NAVIGATION_ID}>
            <SiteNavigation />
          </MobileNavigationDrawer>
        }
      />
    </>
  );
}

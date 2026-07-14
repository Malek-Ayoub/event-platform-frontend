'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
  NavigationList,
} from '@event-platform/ui/layout';
import { getVisibleNavItems, siteFooterNavItems, siteNavItems } from '@/lib/navigation';

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const items = getVisibleNavItems(siteNavItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <Navigation aria-label="Primary">
      <NavigationList>
        {items.map((item) => (
          <NavigationItem key={item.href}>
            <NavigationLink asChild active={isActivePath(pathname, item.href)}>
              <Link href={item.href}>{item.label}</Link>
            </NavigationLink>
          </NavigationItem>
        ))}
      </NavigationList>
    </Navigation>
  );
}

export function SiteFooterNavigation() {
  const items = getVisibleNavItems(siteFooterNavItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <Navigation aria-label="Footer">
      <NavigationList>
        {items.map((item) => (
          <NavigationItem key={item.href}>
            <NavigationLink href={item.href}>{item.label}</NavigationLink>
          </NavigationItem>
        ))}
      </NavigationList>
    </Navigation>
  );
}

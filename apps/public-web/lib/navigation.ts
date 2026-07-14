export type SiteNavItem = {
  label: string;
  href: string;
  visible?: boolean;
};

export const siteNavItems: SiteNavItem[] = [
  { label: 'Home', href: '/', visible: true },
  { label: 'Events', href: '/events', visible: false },
  { label: 'About', href: '/about', visible: false },
];

export const siteFooterNavItems: SiteNavItem[] = [
  { label: 'Privacy', href: '/privacy', visible: false },
  { label: 'Terms', href: '/terms', visible: false },
  { label: 'Contact', href: '/contact', visible: false },
];

export function getVisibleNavItems(items: SiteNavItem[]): SiteNavItem[] {
  return items.filter((item) => item.visible !== false);
}

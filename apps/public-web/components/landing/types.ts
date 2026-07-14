import type { TenantBranding } from '@event-platform/tenant';

export type LandingSectionProps = {
  tenant?: TenantBranding;
  className?: string;
};

export type FeaturedEvent = {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string | null;
  startDatetime: string;
};

export type VenueHighlight = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  city: string;
};

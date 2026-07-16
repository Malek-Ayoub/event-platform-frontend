'use client';

import type { ApiClient, PublicComponents, PublicPaths } from '@event-platform/api-client/core';
import { usePublicApiClient } from '@event-platform/api-client/react';
import { formatCurrency, formatDateTime } from '@event-platform/shared';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useQuery حاليًا. الحل الأنظف: تصدير useQuery من packages/query
// وإزالة هذا الاعتماد المباشر من public-web، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useQuery } from '@tanstack/react-query';

const PUBLIC_EVENTS_INDEX_PATH = '/api/public/events' satisfies keyof PublicPaths;

type PublicEventListItem = PublicComponents['schemas']['PublicEventListItem'];

type PublicEventsIndexResponse =
  PublicPaths[typeof PUBLIC_EVENTS_INDEX_PATH]['get']['responses'][200]['content']['application/json'];

export type EventCardViewModel = {
  id: string;
  slug: string;
  title: string;
  venue: string;
  imageUrl: string | null;
  startDatetime: string;
  dateLabel: string;
  priceLabel: string;
};

/** Landing "Upcoming Events" shape — mirrors FeaturedEvent without importing landing types. */
export type UpcomingEventViewModel = {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string | null;
  startDatetime: string;
};

export type EventDetailTicketTypeViewModel = {
  id: string;
  name: string;
  priceLabel: string;
  remaining: number;
  isAvailable: boolean;
  benefits: string[] | null;
  color: string | null;
};

export type EventDetailViewModel = {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  imageUrl: string | null;
  startDatetime: string;
  endDatetime: string | null;
  dateLabel: string;
  priceLabel: string;
  ticketTypes: EventDetailTicketTypeViewModel[];
};

export type PublicEventsQueryParams = {
  perPage?: number;
  sort?: string;
};

export const publicEventsQueryKey = ['public', 'events', 'index'] as const;

export function mapToEventCardViewModel(item: PublicEventListItem): EventCardViewModel {
  const startDatetime = item.starts_at;

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    venue: item.venue,
    imageUrl: item.image_url ?? null,
    startDatetime,
    dateLabel: formatDateTime(startDatetime),
    priceLabel:
      item.starting_price?.amount != null && item.starting_price.currency
        ? formatCurrency(Number(item.starting_price.amount), item.starting_price.currency)
        : 'Free',
  };
}

export function mapToUpcomingEventViewModel(item: PublicEventListItem): UpcomingEventViewModel {
  return {
    id: String(item.id),
    name: item.title,
    slug: item.slug,
    description: item.description ?? '',
    bannerUrl: item.image_url ?? null,
    startDatetime: item.starts_at,
  };
}

function isUpcoming(startDatetime: string, nowMs: number): boolean {
  return new Date(startDatetime).getTime() > nowMs;
}

async function fetchPublicEventItems(
  client: ApiClient,
  params: PublicEventsQueryParams = {},
): Promise<PublicEventListItem[]> {
  const response = await client.get<PublicEventsIndexResponse>(PUBLIC_EVENTS_INDEX_PATH, {
    params: {
      ...(params.perPage !== undefined ? { per_page: params.perPage } : {}),
      ...(params.sort !== undefined ? { sort: params.sort } : {}),
    },
  });

  return response.data ?? [];
}

async function fetchPublicEvents(
  client: ApiClient,
  params: PublicEventsQueryParams = {},
): Promise<EventCardViewModel[]> {
  const items = await fetchPublicEventItems(client, params);
  return items.map(mapToEventCardViewModel);
}

async function fetchUpcomingEvents(
  client: ApiClient,
  params: PublicEventsQueryParams,
): Promise<UpcomingEventViewModel[]> {
  const items = await fetchPublicEventItems(client, params);
  const nowMs = Date.now();

  // Client-side future-only filter: API has no "starts_at > now" query yet.
  // With per_page=4 this may return fewer than 4 cards after filtering past events.
  return items
    .map(mapToUpcomingEventViewModel)
    .filter((event) => isUpcoming(event.startDatetime, nowMs));
}

export function usePublicEventsQuery(params: PublicEventsQueryParams = {}) {
  const client = usePublicApiClient();

  return useQuery({
    queryKey: [...publicEventsQueryKey, params] as const,
    queryFn: () => fetchPublicEvents(client, params),
  });
}

export function useUpcomingEventsQuery(
  params: PublicEventsQueryParams = { perPage: 4, sort: 'starts_at' },
) {
  const client = usePublicApiClient();
  const resolved = {
    perPage: params.perPage ?? 4,
    sort: params.sort ?? 'starts_at',
  };

  return useQuery({
    queryKey: [...publicEventsQueryKey, 'upcoming', resolved] as const,
    queryFn: () => fetchUpcomingEvents(client, resolved),
  });
}

const _PUBLIC_EVENT_DETAIL_PATH = '/api/public/events/{slug}' satisfies keyof PublicPaths;
type PublicEventDetailItem = PublicComponents['schemas']['PublicEventDetailItem'];
type PublicEventsShowResponse =
  PublicPaths[typeof _PUBLIC_EVENT_DETAIL_PATH]['get']['responses'][200]['content']['application/json'];

export function mapToEventDetailViewModel(item: PublicEventDetailItem): EventDetailViewModel {
  const startDatetime = item.starts_at;
  const endDatetime = item.ends_at ?? null;

  const priceLabel =
    item.starting_price?.amount != null && item.starting_price.currency
      ? formatCurrency(Number(item.starting_price.amount), item.starting_price.currency)
      : 'Free';

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    description: item.description ?? '',
    venue: item.venue,
    imageUrl: item.image_url ?? null,
    startDatetime,
    endDatetime,
    dateLabel: formatDateTime(startDatetime),
    priceLabel,
    ticketTypes: item.ticket_types.map((ticketType) => ({
      id: String(ticketType.id),
      name: ticketType.name,
      priceLabel: formatCurrency(Number(ticketType.price.amount), ticketType.price.currency),
      remaining: ticketType.remaining,
      isAvailable: ticketType.is_available,
      benefits: ticketType.benefits ?? null,
      color: ticketType.color ?? null,
    })),
  };
}

async function fetchPublicEventDetail(
  client: ApiClient,
  slug: string,
): Promise<EventDetailViewModel> {
  const response = await client.get<PublicEventsShowResponse>(`/api/public/events/${slug}`);

  if (!response.data) {
    throw new Error('Missing published event detail payload.');
  }

  return mapToEventDetailViewModel(response.data);
}

export function useEventDetailQuery(slug: string) {
  const client = usePublicApiClient();

  return useQuery({
    queryKey: ['public', 'events', 'detail', slug] as const,
    queryFn: () => fetchPublicEventDetail(client, slug),
    enabled: slug.length > 0,
  });
}

'use client';

import type { ApiClient, PublicComponents, PublicPaths } from '@event-platform/api-client/core';
import { usePublicApiClient } from '@event-platform/api-client/react';
import { formatCurrency, formatDateTime } from '@event-platform/shared';
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

async function fetchPublicEvents(client: ApiClient): Promise<EventCardViewModel[]> {
  const response = await client.get<PublicEventsIndexResponse>(PUBLIC_EVENTS_INDEX_PATH);

  return (response.data ?? []).map(mapToEventCardViewModel);
}

export function usePublicEventsQuery() {
  const client = usePublicApiClient();

  return useQuery({
    queryKey: publicEventsQueryKey,
    queryFn: () => fetchPublicEvents(client),
  });
}

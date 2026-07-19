'use client';

import type { AdminComponents, AdminPaths, ApiClient } from '@event-platform/api-client/core';
import { useAdminApiClient } from '@event-platform/api-client/react';
import type { PaginationMeta } from '@event-platform/shared';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useMutation/useQuery حاليًا. الحل الأنظف: تصديرهما من packages/query
// وإزالة هذا الاعتماد المباشر من admin، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ADMIN_VENUES_PATH = '/api/admin/venues' satisfies keyof AdminPaths;
const _ADMIN_VENUE_PATH = '/api/admin/venues/{venue}' satisfies keyof AdminPaths;
const _ADMIN_VENUE_SUSPEND_PATH = '/api/admin/venues/{venue}/suspend' satisfies keyof AdminPaths;
const _ADMIN_VENUE_ACTIVATE_PATH = '/api/admin/venues/{venue}/activate' satisfies keyof AdminPaths;

export type CreateVenueRequest = AdminComponents['schemas']['CreateVenueRequest'];
export type UpdateVenueRequest = AdminComponents['schemas']['UpdateVenueRequest'];
export type VenueResource = AdminComponents['schemas']['VenueResource'];
export type VenueStatus = NonNullable<VenueResource['status']>;

type CreateVenueResponse =
  AdminPaths[typeof ADMIN_VENUES_PATH]['post']['responses'][201]['content']['application/json'];

type ListVenuesResponse =
  AdminPaths[typeof ADMIN_VENUES_PATH]['get']['responses'][200]['content']['application/json'];

type ShowVenueResponse =
  AdminPaths[typeof _ADMIN_VENUE_PATH]['get']['responses'][200]['content']['application/json'];

type UpdateVenueResponse =
  AdminPaths[typeof _ADMIN_VENUE_PATH]['put']['responses'][200]['content']['application/json'];

type SuspendVenueResponse =
  AdminPaths[typeof _ADMIN_VENUE_SUSPEND_PATH]['post']['responses'][200]['content']['application/json'];

type ActivateVenueResponse =
  AdminPaths[typeof _ADMIN_VENUE_ACTIVATE_PATH]['post']['responses'][200]['content']['application/json'];

type PaginationMetaSchema = AdminComponents['schemas']['PaginationMeta'];

export type VenuesListResult = {
  data: VenueResource[];
  meta: PaginationMeta;
};

export const adminVenuesQueryKey = ['admin', 'venues'] as const;

export function adminVenueQueryKey(id: number) {
  return ['admin', 'venues', id] as const;
}

function normalizePaginationMeta(
  meta: PaginationMetaSchema | undefined,
  page: number,
): PaginationMeta {
  return {
    current_page: meta?.current_page ?? page,
    last_page: meta?.last_page ?? 1,
    per_page: meta?.per_page ?? 15,
    total: meta?.total ?? 0,
    from: meta?.from ?? null,
    to: meta?.to ?? null,
  };
}

function venuePath(id: number): string {
  return `/api/admin/venues/${id}`;
}

async function createVenue(client: ApiClient, body: CreateVenueRequest): Promise<VenueResource> {
  const response = await client.post<CreateVenueResponse>(ADMIN_VENUES_PATH, body);

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

async function fetchVenues(client: ApiClient, page: number): Promise<VenuesListResult> {
  const response = await client.get<ListVenuesResponse>(ADMIN_VENUES_PATH, {
    params: { page },
  });

  return {
    data: response.data ?? [],
    meta: normalizePaginationMeta(response.meta, page),
  };
}

async function fetchVenue(client: ApiClient, id: number): Promise<VenueResource> {
  const response = await client.get<ShowVenueResponse>(venuePath(id));

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

async function updateVenue(
  client: ApiClient,
  id: number,
  body: UpdateVenueRequest,
): Promise<VenueResource> {
  const response = await client.put<UpdateVenueResponse>(venuePath(id), body);

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

async function suspendVenue(client: ApiClient, id: number): Promise<VenueResource> {
  const response = await client.post<SuspendVenueResponse>(`${venuePath(id)}/suspend`);

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

async function activateVenue(client: ApiClient, id: number): Promise<VenueResource> {
  const response = await client.post<ActivateVenueResponse>(`${venuePath(id)}/activate`);

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

function syncVenueCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  venue: VenueResource,
): void {
  if (venue.id != null) {
    queryClient.setQueryData(adminVenueQueryKey(venue.id), venue);
  }

  void queryClient.invalidateQueries({ queryKey: adminVenuesQueryKey });
}

export function useCreateVenueMutation() {
  const client = useAdminApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVenueRequest) => createVenue(client, body),
    onSuccess: (venue) => {
      syncVenueCaches(queryClient, venue);
    },
  });
}

export function useVenuesQuery(page: number) {
  const client = useAdminApiClient();

  return useQuery({
    queryKey: [...adminVenuesQueryKey, page] as const,
    queryFn: () => fetchVenues(client, page),
  });
}

export function useVenueQuery(id: number) {
  const client = useAdminApiClient();

  return useQuery({
    queryKey: adminVenueQueryKey(id),
    queryFn: () => fetchVenue(client, id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useUpdateVenueMutation(id: number) {
  const client = useAdminApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateVenueRequest) => updateVenue(client, id, body),
    onSuccess: (venue) => {
      syncVenueCaches(queryClient, venue);
    },
  });
}

export function useSuspendVenueMutation(id: number) {
  const client = useAdminApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => suspendVenue(client, id),
    onSuccess: (venue) => {
      syncVenueCaches(queryClient, venue);
    },
  });
}

export function useActivateVenueMutation(id: number) {
  const client = useAdminApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activateVenue(client, id),
    onSuccess: (venue) => {
      syncVenueCaches(queryClient, venue);
    },
  });
}

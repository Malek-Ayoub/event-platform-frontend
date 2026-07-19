'use client';

import type { AdminComponents, AdminPaths, ApiClient } from '@event-platform/api-client/core';
import { useAdminApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useMutation حاليًا. الحل الأنظف: تصدير useMutation من packages/query
// وإزالة هذا الاعتماد المباشر من admin، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useMutation } from '@tanstack/react-query';

const ADMIN_VENUES_STORE_PATH = '/api/admin/venues' satisfies keyof AdminPaths;

export type CreateVenueRequest = AdminComponents['schemas']['CreateVenueRequest'];
export type VenueResource = AdminComponents['schemas']['VenueResource'];

type CreateVenueResponse =
  AdminPaths[typeof ADMIN_VENUES_STORE_PATH]['post']['responses'][201]['content']['application/json'];

async function createVenue(client: ApiClient, body: CreateVenueRequest): Promise<VenueResource> {
  const response = await client.post<CreateVenueResponse>(ADMIN_VENUES_STORE_PATH, body);

  if (!response.data) {
    throw new Error('Missing venue payload.');
  }

  return response.data;
}

export function useCreateVenueMutation() {
  const client = useAdminApiClient();

  return useMutation({
    mutationFn: (body: CreateVenueRequest) => createVenue(client, body),
  });
}

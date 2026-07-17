'use client';

import type { PublicComponents, PublicPaths } from '@event-platform/api-client/core';
import { usePublicApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useMutation حاليًا. الحل الأنظف: تصدير useMutation من packages/query
// وإزالة هذا الاعتماد المباشر من public-web، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useMutation } from '@tanstack/react-query';

const PUBLIC_ORDERS_STORE_PATH = '/api/public/orders' satisfies keyof PublicPaths;

export type CreatePublicOrderRequest = PublicComponents['schemas']['CreatePublicOrderRequest'];
export type PublicOrderResource = PublicComponents['schemas']['PublicOrderResource'];

type CreatePublicOrderResponse =
  PublicPaths[typeof PUBLIC_ORDERS_STORE_PATH]['post']['responses'][201]['content']['application/json'];

export function useCreatePublicOrderMutation() {
  const client = usePublicApiClient();

  return useMutation({
    mutationFn: async (body: CreatePublicOrderRequest): Promise<PublicOrderResource> => {
      const response = await client.post<CreatePublicOrderResponse>(PUBLIC_ORDERS_STORE_PATH, body);

      if (!response.data) {
        throw new Error('Missing public order payload.');
      }

      return response.data;
    },
  });
}

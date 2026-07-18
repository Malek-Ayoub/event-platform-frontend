import type { TenantComponents, TenantPaths } from '@event-platform/api-client/core';
import { useTenantApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useMutation حاليًا. الحل الأنظف: تصدير useMutation من packages/query
// وإزالة هذا الاعتماد المباشر من scanner، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useMutation } from '@tanstack/react-query';

const CHECK_IN_PATH = '/api/tenant/tickets/check-in' satisfies keyof TenantPaths;

export type CheckInTicketRequest =
  TenantPaths[typeof CHECK_IN_PATH]['post']['requestBody']['content']['application/json'];

export type TicketCheckInResult = TenantComponents['schemas']['TicketCheckInResult'];

type CheckInTicketResponse =
  TenantPaths[typeof CHECK_IN_PATH]['post']['responses'][200]['content']['application/json'];

export type CheckInMutationInput = {
  qr_token: string;
  gate_id?: number;
  device_id?: string;
};

export function useCheckInMutation() {
  const client = useTenantApiClient();

  return useMutation({
    mutationFn: async (body: CheckInMutationInput): Promise<TicketCheckInResult> => {
      const payload: CheckInTicketRequest = {
        qr_token: body.qr_token,
        ...(body.gate_id !== undefined ? { gate_id: body.gate_id } : {}),
        ...(body.device_id !== undefined ? { device_id: body.device_id } : {}),
      };

      const response = await client.post<CheckInTicketResponse>(CHECK_IN_PATH, payload);

      if (!response.data) {
        throw new Error('Missing ticket check-in payload.');
      }

      return response.data;
    },
  });
}

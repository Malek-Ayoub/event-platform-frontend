'use client';

import type { PublicComponents, PublicPaths } from '@event-platform/api-client/core';
import { usePublicApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useMutation حاليًا. الحل الأنظف: تصدير useMutation من packages/query
// وإزالة هذا الاعتماد المباشر من public-web، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useMutation } from '@tanstack/react-query';

const _PUBLIC_PAYMENT_INSTRUCTIONS_PATH =
  '/api/public/orders/{orderNumber}/payment-instructions' satisfies keyof PublicPaths;
const _PUBLIC_PAYMENT_VERIFICATION_PATH =
  '/api/public/orders/{orderNumber}/payment-verification' satisfies keyof PublicPaths;

export type PublicPaymentInstructionResource =
  PublicComponents['schemas']['PublicPaymentInstructionResource'];
export type PublicPaymentVerificationResource =
  PublicComponents['schemas']['PublicPaymentVerificationResource'];
export type SubmitPublicPaymentVerificationRequest =
  PublicComponents['schemas']['SubmitPublicPaymentVerificationRequest'];

type PaymentInstructionsResponse =
  PublicPaths[typeof _PUBLIC_PAYMENT_INSTRUCTIONS_PATH]['post']['responses'][201]['content']['application/json'];

type PaymentVerificationResponse =
  PublicPaths[typeof _PUBLIC_PAYMENT_VERIFICATION_PATH]['post']['responses'][200]['content']['application/json'];

export function useRequestPaymentInstructionsMutation(orderNumber: string) {
  const client = usePublicApiClient();

  return useMutation({
    mutationFn: async (): Promise<PublicPaymentInstructionResource> => {
      const response = await client.post<PaymentInstructionsResponse>(
        `/api/public/orders/${encodeURIComponent(orderNumber)}/payment-instructions`,
      );

      if (!response.data) {
        throw new Error('Missing payment instructions payload.');
      }

      return response.data;
    },
  });
}

export function useSubmitPaymentVerificationMutation(orderNumber: string) {
  const client = usePublicApiClient();

  return useMutation({
    mutationFn: async (
      body: SubmitPublicPaymentVerificationRequest,
    ): Promise<PublicPaymentVerificationResource> => {
      const response = await client.post<PaymentVerificationResponse>(
        `/api/public/orders/${encodeURIComponent(orderNumber)}/payment-verification`,
        body,
      );

      if (!response.data) {
        throw new Error('Missing payment verification payload.');
      }

      return response.data;
    },
  });
}

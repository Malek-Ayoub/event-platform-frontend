'use client';

import type { ApiClient, TenantComponents, TenantPaths } from '@event-platform/api-client/core';
import { useTenantApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useQuery حاليًا. الحل الأنظف: تصدير useQuery من packages/query
// وإزالة هذا الاعتماد المباشر من organizer، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useQuery } from '@tanstack/react-query';

const ORGANIZER_DASHBOARD_PATH = '/api/tenant/organizer/dashboard' satisfies keyof TenantPaths;

type OrganizerDashboardResponse =
  TenantPaths[typeof ORGANIZER_DASHBOARD_PATH]['get']['responses'][200]['content']['application/json'];

export type OrganizerDashboardKpis = TenantComponents['schemas']['OrganizerDashboardKpis'];
export type OrganizerDashboardToday = TenantComponents['schemas']['OrganizerDashboardToday'];
export type OrganizerDashboardEvent = TenantComponents['schemas']['OrganizerDashboardEvent'];
export type OrganizerDashboardOrder = TenantComponents['schemas']['OrganizerDashboardOrder'];
export type OrganizerDashboardCheckIn = TenantComponents['schemas']['OrganizerDashboardCheckIn'];
export type OrganizerDashboardCommission =
  TenantComponents['schemas']['OrganizerDashboardCommission'];
export type OrganizerDashboardMeta = TenantComponents['schemas']['OrganizerDashboardMeta'];

export type OrganizerDashboardData = {
  kpis: OrganizerDashboardKpis;
  today: OrganizerDashboardToday;
  events: OrganizerDashboardEvent[];
  latest_orders: OrganizerDashboardOrder[];
  latest_check_ins: OrganizerDashboardCheckIn[];
  commission: OrganizerDashboardCommission;
  meta: OrganizerDashboardMeta;
};

export const organizerDashboardQueryKey = ['tenant', 'organizer', 'dashboard'] as const;

async function fetchOrganizerDashboard(client: ApiClient): Promise<OrganizerDashboardData> {
  const response = await client.get<OrganizerDashboardResponse>(ORGANIZER_DASHBOARD_PATH);

  if (!response.data) {
    throw new Error('Missing organizer dashboard payload.');
  }

  return {
    kpis: response.data.kpis ?? {},
    today: response.data.today ?? {},
    events: response.data.events ?? [],
    latest_orders: response.data.latest_orders ?? [],
    latest_check_ins: response.data.latest_check_ins ?? [],
    commission: response.data.commission ?? {},
    meta: response.data.meta ?? {},
  };
}

export function useOrganizerDashboardQuery() {
  const client = useTenantApiClient();

  return useQuery({
    queryKey: organizerDashboardQueryKey,
    queryFn: () => fetchOrganizerDashboard(client),
  });
}

'use client';

import type { AdminComponents, AdminPaths, ApiClient } from '@event-platform/api-client/core';
import { useAdminApiClient } from '@event-platform/api-client/react';
// TODO(tech-debt): @tanstack/react-query مستورد مباشرة هنا لأن @event-platform/query
// لا يُصدّر useQuery حاليًا. الحل الأنظف: تصدير useQuery من packages/query
// وإزالة هذا الاعتماد المباشر من admin، للحفاظ على عزل React Query
// داخل packages/query حصريًا (راجع القاعدة المعمارية #7 في توثيق المشروع).
import { useQuery } from '@tanstack/react-query';

const ADMIN_DASHBOARD_PATH = '/api/admin/dashboard' satisfies keyof AdminPaths;

type AdminDashboardResponse =
  AdminPaths[typeof ADMIN_DASHBOARD_PATH]['get']['responses'][200]['content']['application/json'];

export type AdminDashboardKpis = AdminComponents['schemas']['AdminDashboardKpis'];
export type AdminDashboardToday = AdminComponents['schemas']['AdminDashboardToday'];
export type AdminDashboardTopVenue = AdminComponents['schemas']['AdminReportTopVenue'];
export type AdminDashboardTopEvent = AdminComponents['schemas']['AdminReportTopEvent'];
export type AdminDashboardOrder = AdminComponents['schemas']['AdminDashboardOrder'];
export type AdminDashboardPayment = AdminComponents['schemas']['AdminDashboardPayment'];
export type AdminDashboardCheckIn = AdminComponents['schemas']['AdminDashboardCheckIn'];
export type AdminDashboardAlert = AdminComponents['schemas']['AdminDashboardAlert'];
export type AdminDashboardMeta = AdminComponents['schemas']['AdminDashboardMeta'];

export type AdminDashboardData = {
  kpis: AdminDashboardKpis;
  today: AdminDashboardToday;
  top_venues: AdminDashboardTopVenue[];
  top_events: AdminDashboardTopEvent[];
  latest_orders: AdminDashboardOrder[];
  latest_payments: AdminDashboardPayment[];
  latest_check_ins: AdminDashboardCheckIn[];
  alerts: AdminDashboardAlert[];
  meta: AdminDashboardMeta;
};

export const adminDashboardQueryKey = ['admin', 'dashboard'] as const;

async function fetchAdminDashboard(client: ApiClient): Promise<AdminDashboardData> {
  const response = await client.get<AdminDashboardResponse>(ADMIN_DASHBOARD_PATH);

  if (!response.data) {
    throw new Error('Missing admin dashboard payload.');
  }

  return {
    kpis: response.data.kpis ?? {},
    today: response.data.today ?? {},
    top_venues: response.data.top_venues ?? [],
    top_events: response.data.top_events ?? [],
    latest_orders: response.data.latest_orders ?? [],
    latest_payments: response.data.latest_payments ?? [],
    latest_check_ins: response.data.latest_check_ins ?? [],
    alerts: response.data.alerts ?? [],
    meta: response.data.meta ?? {},
  };
}

export function useAdminDashboardQuery() {
  const client = useAdminApiClient();

  return useQuery({
    queryKey: adminDashboardQueryKey,
    queryFn: () => fetchAdminDashboard(client),
  });
}

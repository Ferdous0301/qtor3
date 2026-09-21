import { apiRequest, newIdempotencyKey } from '@/lib/api/client'

export type AdminList<T> = { items: T[]; pagination?: { page?: number; page_size?: number; total_items?: number; total_pages?: number } }
export type AdminUser = { id: string; email: string; full_name?: string | null; is_active: boolean; roles: string[]; created_at: string }
export type AdminRow = Record<string, unknown> & { id: string }

const list = <T>(path: string) => apiRequest<AdminList<T>>(path)
const mutate = <T>(path: string, init: RequestInit = {}) => apiRequest<T>(path, { ...init, headers: { 'Idempotency-Key': newIdempotencyKey(), ...(init.headers || {}) } })

export const adminApi = {
  users: (params = '') => list<AdminUser>(`/api/v1/admin/users${params}`),
  user: (id: string) => apiRequest<AdminUser>(`/api/v1/admin/users/${id}`),
  userRoles: (id: string) => list<AdminRow>(`/api/v1/admin/users/${id}/roles`),
  assignRole: (id: string, role_code: string, reason: string) => mutate(`/api/v1/admin/users/${id}/roles`, { method: 'POST', body: JSON.stringify({ role_code, reason }) }),
  removeRole: (id: string, role: string, reason: string) => mutate(`/api/v1/admin/users/${id}/roles/${role}`, { method: 'DELETE', body: JSON.stringify({ reason }) }),
  setStatus: (id: string, is_active: boolean, reason: string) => mutate(`/api/v1/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ is_active, reason }) }),
  entitlements: (kind: 'features' | 'paper-export', params = '') => list<AdminRow>(`/api/v1/admin/entitlements/${kind}${params}`),
  purchases: (params = '') => list<AdminRow>(`/api/v1/admin/purchases${params}`),
  exports: (params = '') => list<AdminRow>(`/api/v1/admin/export-records${params}`),
  jobs: (params = '') => list<AdminRow>(`/api/v1/admin/jobs${params}`),
  usage: (params = '') => list<AdminRow>(`/api/v1/admin/provider-usage${params}`),
  templates: (params = '') => list<AdminRow>(`/api/v1/admin/templates${params}`),
  audit: (params = '') => list<AdminRow>(`/api/v1/admin/audit-log${params}`),
  usageSummary: () => apiRequest<Record<string, unknown>>('/api/v1/admin/provider-usage/summary'),
  counts: async () => { const [users, pending, failedJobs, failedExports, summary] = await Promise.all([adminApi.users('?page=1&page_size=1'), adminApi.purchases('?status=pending&page=1&page_size=1'), adminApi.jobs('?status=failed&page=1&page_size=1'), adminApi.exports('?status=failed&page=1&page_size=1'), adminApi.usageSummary()]); return { users: users.pagination?.total_items ?? 0, pending: pending.pagination?.total_items ?? 0, failedJobs: failedJobs.pagination?.total_items ?? 0, failedExports: failedExports.pagination?.total_items ?? 0, summary } },
}

export function adminQuery(filters: Record<string, string | undefined>) { const params = new URLSearchParams({ page: filters.page || '1', page_size: filters.page_size || '25' }); Object.entries(filters).forEach(([key, value]) => { if (value && key !== 'page' && key !== 'page_size') params.set(key, value) }); return `?${params.toString()}` }
export function adminErrorMessage(error: unknown) { const message = error instanceof Error ? error.message : 'The admin request failed.'; if (message.includes('SELF_LOCKOUT_BLOCKED')) return 'You cannot deactivate yourself or remove your own admin role.'; if (message.includes('ENTITLEMENT_NOT_AVAILABLE')) return 'This entitlement is already consumed or revoked.'; return message }

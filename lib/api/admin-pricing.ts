import { apiRequest, newIdempotencyKey } from '@/lib/api/client'
import type { AdminList, AdminRow } from '@/lib/api/admin'

const root = '/api/v1/admin/pricing'
const list = (path: string) => apiRequest<AdminList<AdminRow>>(`${root}${path}`)
const mutate = (path: string, method: string, body: unknown) => apiRequest<AdminRow>(`${root}${path}`, { method, headers: { 'Idempotency-Key': newIdempotencyKey() }, body: JSON.stringify(body) })

export const pricingApi = {
  tiers: () => list('/paper-size-tiers'), tier: (id: string, body: unknown) => mutate(`/paper-size-tiers/${id}`, 'PATCH', body), createTier: (body: unknown) => mutate('/paper-size-tiers', 'POST', body),
  packages: () => list('/packages'), package: (id: string, body: unknown) => mutate(`/packages/${id}`, 'PATCH', body), createPackage: (body: unknown) => mutate('/packages', 'POST', body),
  weights: () => list('/question-type-weights'), weight: (code: string, body: unknown) => mutate(`/question-type-weights/${code}`, 'PUT', body),
  rules: () => list('/rules'), rule: (id: string, body: unknown) => mutate(`/rules/${id}`, 'PATCH', body), createRule: (body: unknown) => mutate('/rules', 'POST', body),
  features: () => list('/features'), feature: (id: string, body: unknown) => mutate(`/features/${id}`, 'PATCH', body), createFeature: (body: unknown) => mutate('/features', 'POST', body),
}

export const taxonomyApi = {
  list: (kind: string, params = '') => apiRequest<AdminList<AdminRow>>(`/api/v1/admin/taxonomy/${kind}${params}`),
  create: (kind: string, body: unknown) => apiRequest<AdminRow>(`/api/v1/admin/taxonomy/${kind}`, { method: 'POST', headers: { 'Idempotency-Key': newIdempotencyKey() }, body: JSON.stringify(body) }),
  update: (kind: string, id: string, body: unknown) => apiRequest<AdminRow>(`/api/v1/admin/taxonomy/${kind}/${id}`, { method: 'PATCH', headers: { 'Idempotency-Key': newIdempotencyKey() }, body: JSON.stringify(body) }),
}

export function adminMutationBody(values: Record<string, unknown>, reason: string) { return { ...values, reason } }
export function validateTierOrder(rows: AdminRow[]) { const sorted = [...rows].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)); return sorted.every((row, index) => index === 0 || Number(row.max_weight_units ?? 0) > Number(sorted[index - 1].max_weight_units ?? 0)) }
export function effectivePrice(row: AdminRow) { const quantity = Number(row.quantity ?? row.paper_count ?? 1); return quantity ? Number(row.price ?? 0) / quantity : 0 }
export const taxonomyKinds = ['classes', 'groups', 'subjects', 'chapters', 'topics', 'question-types', 'levels'] as const
export type TaxonomyKind = typeof taxonomyKinds[number]
export function displayTaxonomyLabel(row: AdminRow) { return String(row.name ?? row.label ?? row.code ?? row.id) }
export function formatAdminPrice(value: unknown) { return `৳${Number(value ?? 0).toLocaleString('en-BD')}` }
export function auditHref(section: string, id: string) { return `/admin/audit-log?entity_type=${encodeURIComponent(section)}&entity_id=${encodeURIComponent(id)}` }
export function serverErrorMessage(error: unknown) { const message = error instanceof Error ? error.message : 'The configuration change failed.'; if (message.includes('ENTITY_CONFLICT')) return 'A record with this code or name already exists.'; if (message.includes('TAXONOMY_PARENT_NOT_FOUND')) return 'Choose an existing parent before creating this child.'; return message }

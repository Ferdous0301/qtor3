export type ApiErrorPayload = { error?: { code?: string; details?: Record<string, unknown>; request_id?: string }; detail?: string; message?: string }

export class ApiError extends Error {
  readonly code: string
  readonly details: Record<string, unknown>
  readonly requestId?: string
  readonly status: number
  constructor(message: string, code = "UNKNOWN", status = 0, details: Record<string, unknown> = {}, requestId?: string) { super(message); this.name = "ApiError"; this.code = code; this.status = status; this.details = details; this.requestId = requestId }
}

export function newIdempotencyKey() { return crypto.randomUUID() }
export async function fetchBlob(path: string) { const token = (await import("@/lib/api/auth")).authTokenStore.accessToken; const response = await fetch(`${(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")}${path}`, { headers: { Authorization: `Bearer ${token ?? ""}` }, credentials: "include" }); if (!response.ok) throw await toApiError(response); return response.blob() }
export function errorMessage(error: unknown) { if (error instanceof ApiError) { if (error.code === "RATE_LIMITED") return `Please try again in ${Number(error.details.retry_after_seconds) || 1} seconds.`; if (error.code === "PAPER_QUESTION_LIMIT_REACHED") return `This paper is full. The maximum is ${Number(error.details.max_questions) || 300} questions.`; if (error.code === "PAPER_NOT_EDITABLE") return "This paper was exported and is locked."; if (error.code === "TAXONOMY_NOT_FOUND") return "That selection is no longer available — please choose again."; if (error.code === "SEARCH_WINDOW_TOO_DEEP") return "Showing only the first 10,000 results. Refine your search to see more."; return error.message } return error instanceof Error ? error.message : "Something went wrong. Please try again." }
export function referenceMessage(error: unknown) { return error instanceof ApiError && error.requestId ? `Reference: ${error.requestId}` : "" }
export async function toApiError(response: Response) { const payload = await response.json().catch(() => null) as ApiErrorPayload | null; const error = payload?.error; const code = error?.code ?? (response.status === 429 ? "RATE_LIMITED" : "UNKNOWN"); const details = error?.details ?? {}; const message = code === "SEARCH_WINDOW_TOO_DEEP" ? "Showing only the first 10,000 results. Refine your search to see more." : payload?.detail ?? payload?.message ?? "Something went wrong. Please try again."; return new ApiError(message, code, response.status, details, error?.request_id) }
const baseUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")
export async function apiRequest<T>(path: string, init: RequestInit = {}) { const response = await fetch(`${baseUrl()}${path}`, { ...init, credentials: "include", headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers } }); if (!response.ok) throw await toApiError(response); return response.json() as Promise<T> }

export type FeatureEntitlement = { feature_code: string; feature_name: string; trial_available: boolean; trial_consumed: boolean; purchased_available_count: number; granted_available_count: number }
export type ExportEntitlement = { size_tier_code: "mini" | "medium" | "large"; available_count: number }
export const featureLabels: Record<string, string> = { question_card_edit: "Edit questions", ocr_image_to_question: "Photo to question", ai_question_modification: "AI rewrite", template_extraction: "Copy a paper's design", premium_answer_sheet: "Answer sheets" }
export const dashboardApi = { entitlements: () => apiRequest<{ features: FeatureEntitlement[]; paper_export: ExportEntitlement[] }>("/api/v1/billing/entitlements"), templates: () => apiRequest<{ items: Array<{ id: string; name: string; status: string; version?: number; created_at: string }>; pagination?: unknown }>("/api/v1/templates?page=1&page_size=5") }
export function isSearchWindowError(error: unknown) { return error instanceof ApiError && error.code === "SEARCH_WINDOW_TOO_DEEP" }
export function maxSearchPage(pageSize: number) { return Math.max(1, Math.floor(10000 / pageSize)) }
export function formatCount(value: number | undefined) { return new Intl.NumberFormat("en-US").format(value ?? 0) }

import { apiRequest, fetchBlob, newIdempotencyKey, type FeatureEntitlement } from "@/lib/api/client"
import type { PaperQuestion } from "@/lib/api/papers"
import type { QuestionSummary } from "@/lib/api/questions"

export type RewriteItem = { item_index: number; status: "queued" | "processing" | "succeeded" | "failed" | "cancelled"; result?: { custom_content_id: string; needs_review: boolean }; error_message?: string | null; attempts: number; max_attempts: number }
export type RewriteJob = { id: string; status: "queued" | "running" | "succeeded" | "partially_succeeded" | "failed" | "cancelled"; item_count: number; succeeded_item_count: number; failed_item_count: number; progress_percent: number | null; error_message?: string | null; items?: RewriteItem[] }
export type Entitlements = { features: FeatureEntitlement[] }
export type CustomQuestion = { id: string; question_text: string; mark?: number; options?: { order_index: number; option_text: string; is_correct?: boolean }[]; needs_review?: boolean }

export const customContentApi = {
  entitlements: () => apiRequest<Entitlements>("/api/v1/billing/entitlements"),
  job: (id: string) => apiRequest<RewriteJob>(`/api/v1/jobs/${id}`),
  cancel: (id: string) => apiRequest<RewriteJob>(`/api/v1/jobs/${id}/cancel`, { method: "POST" }),
  submitRewrite: (items: { instruction: string; source_question_id?: string; custom_content_id?: string }[]) => apiRequest<RewriteJob>("/api/v1/jobs", { method: "POST", body: JSON.stringify({ job_type: "ai_question_modification", idempotency_key: newIdempotencyKey(), items }) }),
  content: (id: string) => fetchBlob(`/api/v1/custom-content/${id}`),
  createFromBankQuestion: (sourceQuestionId: string) => apiRequest<CustomQuestion>("/api/v1/custom-content", { method: "POST", body: JSON.stringify({ source_question_id: sourceQuestionId }) }),
  replaceInPaper: (paperId: string, paperQuestionId: string, customContentId: string) => apiRequest<PaperQuestion>(`/api/v1/papers/${paperId}/questions/${paperQuestionId}`, { method: "PATCH", body: JSON.stringify({ custom_content_id: customContentId }) }),
}

export function availableRewriteUses(data?: Entitlements) { const feature = data?.features.find((item) => item.feature_code === "ai_question_modification"); return feature ? (feature.trial_available && !feature.trial_consumed ? 1 : 0) + feature.purchased_available_count + feature.granted_available_count : 0 }
export function isRewriteAvailable() { return (process.env.NEXT_PUBLIC_CUSTOM_CONTENT_MODE ?? "unavailable") === "mock" }
export function rewriteFeature(data?: Entitlements) { return data?.features.find((item) => item.feature_code === "ai_question_modification") }
export function questionSource(item: QuestionSummary | PaperQuestion) { return "question_text" in item ? item : item.snapshot }
export const rewritePresets = ["Rephrase", "Make easier", "Make harder", "Change the numbers", "Translate to English", "Translate to Bangla", "Add another option"]

import { authTokenStore } from "@/lib/api/auth"

export type TaxonomyItem = { id: string; name: string; label?: string }
export type QuestionTaxonomy = {
  class_id: string; class_name: string; group_id?: string; group_name?: string
  subject_id: string; subject_name: string; chapter_id?: string; chapter_name?: string
  topic_id?: string; topic_name?: string; question_type_id: string; question_type_name: string
  level_id?: string; level_name?: string
}
export type QuestionSummary = { id: string; source: string; question_text: string; mark: number; taxonomy: QuestionTaxonomy }
export type QuestionDetail = QuestionSummary & {
  answer_text?: string; explanation?: string
  options?: { order_index: number; option_text: string; is_correct: boolean }[]
  sources?: { board: string; board_full: string; source_type: string; year: number }[]
}
export type PagedQuestions = { items: QuestionSummary[]; total?: number; page?: number; page_size?: number; total_pages?: number }

const baseUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = baseUrl()
  if (!url) throw new Error("The Qtor backend URL is not configured yet.")
  const headers = new Headers({ Accept: "application/json" })
  if (authTokenStore.accessToken) headers.set("Authorization", `Bearer ${authTokenStore.accessToken}`)
  const response = await fetch(`${url}${path}`, { headers, credentials: "include", signal })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail ?? payload?.message ?? "Unable to load question bank.")
  return payload
}

export const questionApi = {
  taxonomy: (kind: string, params: Record<string, string | undefined>, signal?: AbortSignal) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value) as [string, string][])
    return request<TaxonomyItem[]>(`/api/v1/taxonomy/${kind}?${search}`, signal)
  },
  questions: (params: Record<string, string | number | undefined>, signal?: AbortSignal) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== "").map(([key, value]) => [key, String(value)]))
    return request<PagedQuestions>(`/api/v1/questions?${search}`, signal)
  },
  detail: (id: string, signal?: AbortSignal) => request<QuestionDetail>(`/api/v1/questions/${id}`, signal),
}

export function taxonomyKey(kind: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value) as [string, string[]])
  return `/taxonomy/${kind}?${search}`
}

export { request }
export const questionsApiConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

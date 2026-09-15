import { authTokenStore } from "@/lib/api/auth"

export type PaperStatus = "draft" | "ready" | "exported" | string

export type PaperSnapshot = {
  question_text: string
  answer_text?: string
  explanation?: string
  mark: number
  options?: { order_index: number; option_text: string; is_correct: boolean }[]
  question_type_name?: string
  level_name?: string
  subject_name?: string
  chapter_name?: string
  topic_name?: string
}

export type PaperQuestion = {
  id: string
  order_index: number
  section_label?: string | null
  marks_override?: number | null
  effective_mark: number
  source: "question_bank" | "custom_content" | string
  source_question_id?: string | null
  custom_content_id?: string | null
  snapshot: PaperSnapshot
}

export type Paper = {
  id: string
  title: string
  status: PaperStatus
  class_id?: string | null
  group_id?: string | null
  subject_id?: string | null
  is_archived: boolean
  question_count: number
  total_marks: number
  questions?: PaperQuestion[]
  created_at: string
  updated_at: string
}

export type PagedPapers = { items: Paper[]; total?: number; page?: number; page_size?: number; total_pages?: number }

async function paperRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")
  if (!base) throw new Error("The Qtor backend URL is not configured yet.")
  const headers = new Headers(init?.headers)
  headers.set("Accept", "application/json")
  headers.set("Content-Type", "application/json")
  if (authTokenStore.accessToken) headers.set("Authorization", `Bearer ${authTokenStore.accessToken}`)
  const response = await fetch(`${base}${path}`, { ...init, headers, credentials: "include" })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const code = payload?.error?.code
    if (code === "PAPER_NOT_EDITABLE" || code === "PAPER_ARCHIVED") throw new Error("PAPER_LOCKED")
    throw new Error(payload?.detail ?? payload?.message ?? "Unable to update this paper.")
  }
  return payload
}

export const papersApi = {
  list: (params: { status?: string; include_archived?: boolean; page?: number; page_size?: number } = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))
    return paperRequest<PagedPapers>(`/api/v1/papers?${search}`)
  },
  get: (id: string) => paperRequest<Paper>(`/api/v1/papers/${id}`),
  create: (payload: { title: string; class_id?: string; group_id?: string; subject_id?: string }) => paperRequest<Paper>("/api/v1/papers", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: { title?: string; class_id?: string; group_id?: string; subject_id?: string }) => paperRequest<Paper>(`/api/v1/papers/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  archive: (id: string) => paperRequest<Paper>(`/api/v1/papers/${id}/archive`, { method: "POST" }),
  restore: (id: string) => paperRequest<Paper>(`/api/v1/papers/${id}/restore`, { method: "POST" }),
  duplicate: (id: string, title?: string) => paperRequest<Paper>(`/api/v1/papers/${id}/duplicate`, { method: "POST", body: JSON.stringify(title ? { title } : {}) }),
  addQuestion: (id: string, payload: { source_question_id: string; marks_override?: number; section_label?: string; position?: number }) => paperRequest<PaperQuestion>(`/api/v1/papers/${id}/questions`, { method: "POST", body: JSON.stringify(payload) }),
  removeQuestion: (id: string, paperQuestionId: string) => paperRequest<void>(`/api/v1/papers/${id}/questions/${paperQuestionId}`, { method: "DELETE" }),
  updateQuestion: (id: string, paperQuestionId: string, payload: { marks_override?: number; section_label?: string; clear_marks_override?: boolean; clear_section_label?: boolean }) => paperRequest<PaperQuestion>(`/api/v1/papers/${id}/questions/${paperQuestionId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  reorder: (id: string, paperQuestionIds: string[]) => paperRequest<void>(`/api/v1/papers/${id}/questions/reorder`, { method: "POST", body: JSON.stringify({ paper_question_ids: paperQuestionIds }) }),
}

export const papersApiConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

export function paperLockedMessage(error: unknown) {
  return error instanceof Error && error.message === "PAPER_LOCKED" ? "This paper is locked because it is archived or no longer a draft." : error instanceof Error ? error.message : "Something went wrong."
}

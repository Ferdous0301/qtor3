import { apiRequest, fetchBlob, newIdempotencyKey } from "@/lib/api/client"

export type RenderOptions = { institution_name?: string; exam_title?: string; metadata_lines?: string[]; instructions?: string; reproduce_template_preamble?: boolean; mcq_option_layout?: "one_per_line" | "inline" | "grid_two" | "grid_four"; option_label_style?: "auto" | "bengali" | "latin_lower" | "latin_upper" | "roman_lower"; numeral_style?: "auto" | "latin" | "bengali"; include_section_headings?: boolean; show_marks?: boolean; include_answer_key?: boolean; section_page_break?: boolean; page_numbers?: boolean }
export type ExportRecord = { id: string; paper_id: string; format: "pdf" | "docx"; status: "pending" | "processing" | "completed" | "failed"; is_preview: boolean; template_id?: string | null; template_version?: number | null; paper_usage_id?: string | null; fidelity_notes?: string[]; error_message?: string | null; download_url?: string | null; requested_at: string; completed_at?: string | null }
export const exportsApi = {
  readiness: (id: string) => apiRequest(`/api/v1/papers/${id}/export-readiness`),
  templates: () => apiRequest<{ items: Array<{ id: string; name: string; version: number; status: string; logo_url?: string | null }> }>("/api/v1/templates?page_size=50"),
  create: (id: string, format: "pdf" | "docx", template_id: string | null, options: RenderOptions) => { const key = newIdempotencyKey(); return apiRequest<ExportRecord>(`/api/v1/papers/${id}/exports`, { method: "POST", headers: { "Idempotency-Key": key }, body: JSON.stringify({ format, template_id, idempotency_key: key, options }) }) },
  preview: (id: string, format: "pdf" | "docx", options: RenderOptions) => apiRequest<ExportRecord>(`/api/v1/papers/${id}/preview`, { method: "POST", body: JSON.stringify({ format, template_id: null, options }) }),
  get: (id: string) => apiRequest<ExportRecord>(`/api/v1/exports/${id}`),
  history: (id: string, include_previews = false) => apiRequest<{ items: ExportRecord[] }>(`/api/v1/papers/${id}/exports?include_previews=${include_previews}`),
  download: (record: ExportRecord) => fetchBlob(record.download_url || `/api/v1/exports/${record.id}/download`),
}
export function saveExport(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url) }

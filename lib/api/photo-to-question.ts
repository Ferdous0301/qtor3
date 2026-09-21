import { apiRequest, fetchBlob, newIdempotencyKey, type FeatureEntitlement } from "@/lib/api/client"

export type JobStatus = "queued" | "running" | "succeeded" | "partially_succeeded" | "failed" | "cancelled"
export type JobItem = { item_index: number; status: "queued" | "processing" | "succeeded" | "failed" | "cancelled"; result?: { custom_content_id: string; needs_review: boolean }; error_message?: string | null; attempts: number; max_attempts: number }
export type PhotoJob = { id: string; job_type: string; status: JobStatus; item_count: number; succeeded_item_count: number; failed_item_count: number; progress_percent: number | null; error_message?: string | null; created_at: string; started_at?: string | null; finished_at?: string | null; items?: JobItem[] }
export type UploadedAsset = { id: string; original_filename: string; content_type: string; size_bytes: number; blob?: Blob }
export type Entitlements = { features: FeatureEntitlement[] }

const base = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")
export const photoApi = {
  entitlements: () => apiRequest<Entitlements>("/api/v1/billing/entitlements"),
  jobs: () => apiRequest<{ items: PhotoJob[] }>("/api/v1/jobs?page=1&page_size=10"),
  job: (id: string) => apiRequest<PhotoJob>(`/api/v1/jobs/${id}`),
  cancel: (id: string) => apiRequest<PhotoJob>(`/api/v1/jobs/${id}/cancel`, { method: "POST" }),
  submit: (job_type: string, items: string[]) => apiRequest<PhotoJob>("/api/v1/jobs", { method: "POST", body: JSON.stringify({ job_type, idempotency_key: newIdempotencyKey(), items: items.map((file_asset_id) => ({ file_asset_id })) }) }),
  content: (id: string) => fetchBlob(`/api/v1/files/${id}/content`),
}

export function availablePhotoUses(data?: Entitlements) { const feature = data?.features.find((item) => item.feature_code === "ocr_image_to_question"); return feature ? (feature.trial_available && !feature.trial_consumed ? 1 : 0) + feature.purchased_available_count + feature.granted_available_count : 0 }
export function isPhotoModeAvailable() { return (process.env.NEXT_PUBLIC_CUSTOM_CONTENT_MODE ?? "unavailable") === "mock" }
export async function uploadImage(file: File, onProgress: (value: number) => void) { return new Promise<UploadedAsset>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open("POST", `${base()}/api/v1/files/images`); xhr.withCredentials = true; xhr.setRequestHeader("Accept", "application/json"); xhr.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100)) }; xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again.")); xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) resolve({ ...JSON.parse(xhr.responseText), blob: file }); else reject(new Error(xhr.responseText || "Upload failed.")) }; const form = new FormData(); form.append("file", file); xhr.send(form) }) }
export function prepareImage(file: File) { return new Promise<File>((resolve, reject) => { if (file.size <= 6 * 1024 * 1024) return resolve(file); const image = new Image(); image.onload = () => { const scale = Math.min(1, 4000 / Math.max(image.width, image.height)); const canvas = document.createElement("canvas"); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => blob ? resolve(new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" })) : reject(new Error("We could not prepare this photo.")), "image/jpeg", 0.85) }; image.onerror = () => reject(new Error("This photo could not be read.")); image.src = URL.createObjectURL(file) }) }

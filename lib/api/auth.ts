export type AuthUser = {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  email_verified: boolean
  roles: string[]
  created_at: string
}

export type AuthSession = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  csrf_token: string
  user: AuthUser
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_INACTIVE'
  | 'EMAIL_ALREADY_REGISTERED'
  | 'INVALID_AUTH_TOKEN'
  | 'INVALID_OR_EXPIRED_TOKEN'
  | 'REFRESH_TOKEN_INVALID'
  | 'REFRESH_TOKEN_REUSE_DETECTED'
  | 'NO_REFRESH_TOKEN'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'CSRF_FAILED'
  | 'UNKNOWN'

export class AuthApiError extends Error {
  readonly code: AuthErrorCode
  readonly status: number
  readonly details: Record<string, unknown>
  readonly requestId?: string

  constructor(message: string, code: AuthErrorCode = 'UNKNOWN', status = 0, details: Record<string, unknown> = {}, requestId?: string) {
    super(message)
    this.name = 'AuthApiError'
    this.code = code
    this.status = status
    this.details = details
    this.requestId = requestId
  }
}

const baseUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '')

let accessToken: string | null = null
let csrfToken: string | null = null
let refreshInFlight: Promise<AuthSession> | null = null
function csrfCookie() { return typeof document === "undefined" ? csrfToken : document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("csrf_token="))?.split("=").slice(1).join("=") || csrfToken }
async function refreshOnce() { if (refreshInFlight) return refreshInFlight; const run = async () => { const headers = new Headers({ "Content-Type": "application/json" }); const token = csrfCookie(); if (token) headers.set("X-CSRF-Token", token); const call = () => fetch(`${baseUrl()}/api/v1/auth/refresh`, { method: "POST", body: "{}", headers, credentials: "include" }); const response = typeof navigator !== "undefined" && "locks" in navigator ? await navigator.locks.request("qtor-refresh", call) : await call(); const payload = await response.json().catch(() => null); if (!response.ok) throw new AuthApiError(payload?.detail ?? "Your session has expired.", payload?.error?.code ?? "UNKNOWN", response.status); authTokenStore.setSession(payload); return payload as AuthSession }; refreshInFlight = run().finally(() => { refreshInFlight = null }); return refreshInFlight }

export const authTokenStore = {
  get accessToken() {
    return accessToken
  },
  get csrfToken() {
    return csrfToken
  },
  setSession(session: Pick<AuthSession, 'access_token' | 'csrf_token'>) {
    accessToken = session.access_token
    csrfToken = session.csrf_token
  },
  clear() {
    accessToken = null
    csrfToken = null
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('qtor:session-ended'))
  },
}

function errorCode(value: unknown): AuthErrorCode {
  if (typeof value !== 'string') return 'UNKNOWN'
  return value as AuthErrorCode
}

async function request<T>(path: string, init: RequestInit = {}, retryRefresh = true): Promise<T> {
  if (!baseUrl()) {
    throw new AuthApiError('The Qtor backend URL is not configured yet.', 'UNKNOWN', 0)
  }

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  const currentCsrf = csrfCookie()
  if (currentCsrf && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(init.method ?? 'GET')) {
    headers.set('X-CSRF-Token', currentCsrf)
  }

  const response = await fetch(`${baseUrl()}${path}`, { ...init, headers, credentials: 'include' })
  const payload = await response.json().catch(() => null)

  if (response.status === 401 && retryRefresh && path !== '/api/v1/auth/refresh') {
    try {
      await refreshOnce()
      return request<T>(path, init, false)
    } catch {
      authTokenStore.clear()
    }
  }

  if (!response.ok) {
    const details = payload?.error?.details ?? {}
    const code = errorCode(payload?.error?.code ?? details.code ?? payload?.code ?? (response.status === 401 ? 'UNAUTHORIZED' : response.status >= 500 ? 'UNKNOWN' : 'UNKNOWN'))
    const requestId = payload?.error?.request_id ?? payload?.request_id
    const safeMessage = code === 'INVALID_CREDENTIALS' ? 'Invalid email or password.' : code === 'ACCOUNT_INACTIVE' ? 'This account is disabled. Contact support.' : code === 'INVALID_OR_EXPIRED_TOKEN' ? 'This link has expired. Request a new one.' : code === 'REFRESH_TOKEN_REUSE_DETECTED' ? 'You were signed out for security. Please sign in again.' : response.status >= 500 ? 'Something went wrong. Please try again.' : response.status === 429 ? 'Too many attempts. Please try again in a bit.' : 'Something went wrong. Please try again.'
    throw new AuthApiError(safeMessage, code, response.status, details, requestId)
  }

  if (payload?.access_token && payload?.csrf_token) authTokenStore.setSession(payload)
  return payload as T
}

export const authApi = {
  register: (body: { email: string; password: string; full_name?: string }) =>
    request<AuthSession>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthSession>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  refresh: () => request<AuthSession>('/api/v1/auth/refresh', { method: 'POST', body: '{}' }, false),
  logout: () => request<void>('/api/v1/auth/logout', { method: 'POST', body: '{}' }),
  me: () => request<AuthUser>('/api/v1/auth/me'),
  requestPasswordReset: (email: string) =>
    request<void>('/api/v1/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email }) }),
  confirmPasswordReset: (token: string, new_password: string) =>
    request<void>('/api/v1/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, new_password }) }),
  requestEmailVerification: () =>
    request<void>('/api/v1/auth/email-verification/request', { method: 'POST', body: '{}' }),
  confirmEmailVerification: (token: string) =>
    request<void>('/api/v1/auth/email-verification/confirm', { method: 'POST', body: JSON.stringify({ token }) }),
}

export const PASSWORD_MIN_LENGTH = 10
export const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

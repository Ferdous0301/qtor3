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
  | 'RATE_LIMITED'
  | 'CSRF_FAILED'
  | 'UNKNOWN'

export class AuthApiError extends Error {
  readonly code: AuthErrorCode
  readonly status: number

  constructor(message: string, code: AuthErrorCode = 'UNKNOWN', status = 0) {
    super(message)
    this.name = 'AuthApiError'
    this.code = code
    this.status = status
  }
}

const baseUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '')

let accessToken: string | null = null
let csrfToken: string | null = null

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
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(init.method ?? 'GET')) {
    headers.set('X-CSRF-Token', csrfToken)
  }

  const response = await fetch(`${baseUrl()}${path}`, { ...init, headers, credentials: 'include' })
  const payload = await response.json().catch(() => null)

  if (response.status === 401 && retryRefresh && path !== '/api/v1/auth/refresh') {
    try {
      await request<AuthSession>('/api/v1/auth/refresh', { method: 'POST', body: '{}' }, false)
      return request<T>(path, init, false)
    } catch {
      authTokenStore.clear()
    }
  }

  if (!response.ok) {
    const detail = payload?.detail ?? payload?.message ?? 'Something went wrong. Please try again.'
    throw new AuthApiError(
      response.status === 429 ? 'Too many attempts. Please try again in a bit.' : detail,
      errorCode(payload?.error?.code ?? payload?.code),
      response.status,
    )
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

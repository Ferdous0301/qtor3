'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, authTokenStore, type AuthSession, type AuthUser } from '@/lib/api/auth'

type AuthContextValue = {
  user: AuthUser | null
  ready: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<AuthSession>
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthSession>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)
  const configured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

  useEffect(() => {
    if (!configured) {
      setReady(true)
      return
    }
    authApi.refresh().then((session) => setUser(session.user)).catch(() => undefined).finally(() => setReady(true))
  }, [configured])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    ready,
    configured,
    async signIn(email, password) {
      const session = await authApi.login({ email, password })
      authTokenStore.setSession(session)
      setUser(session.user)
      return session
    },
    async signUp(email, password, fullName) {
      const session = await authApi.register({ email, password, full_name: fullName || undefined })
      authTokenStore.setSession(session)
      setUser(session.user)
      return session
    },
    async signOut() {
      try { await authApi.logout() } finally { authTokenStore.clear(); setUser(null) }
    },
  }), [configured, ready, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

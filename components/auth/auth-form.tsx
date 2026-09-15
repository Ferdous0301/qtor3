'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthApiError, PASSWORD_MIN_LENGTH, authApi } from '@/lib/api/auth'
import { useAuth } from './auth-provider'

type Mode = 'login' | 'signup'

function errorMessage(error: unknown) {
  if (!(error instanceof AuthApiError)) return 'We could not connect to Qtor. Please try again.'
  if (error.code === 'INVALID_CREDENTIALS') return 'The email or password is incorrect.'
  if (error.code === 'ACCOUNT_INACTIVE') return 'This account is inactive. Contact your administrator for help.'
  if (error.code === 'EMAIL_ALREADY_REGISTERED') return 'An account with this email already exists. Try signing in instead.'
  if (error.code === 'RATE_LIMITED') return 'Too many attempts. Please try again in a bit.'
  if (error.code === 'CSRF_FAILED') return 'Your session expired. Refresh the page and try again.'
  return error.message
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const { signIn, signUp, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const isSignup = mode === 'signup'

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Use at least ${PASSWORD_MIN_LENGTH} characters for your password.`)
      return
    }
    setPending(true)
    try {
      if (isSignup) await signUp(email, password, fullName)
      else await signIn(email, password)
      toast.success(isSignup ? 'Your Qtor account is ready.' : 'Welcome back.')
      router.push('/dashboard')
    } catch (submitError) {
      setError(errorMessage(submitError))
    } finally { setPending(false) }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {!configured && (
        <Alert className="border-brand/30 bg-brand/10 text-foreground">
          <AlertDescription>Authentication is ready for your backend. Add <code>NEXT_PUBLIC_API_BASE_URL</code> when the API URL is available.</AlertDescription>
        </Alert>
      )}
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {isSignup && <div className="flex flex-col gap-2"><Label htmlFor="full-name">Full name <span className="text-muted-foreground">(optional)</span></Label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Alex Morgan" className="pl-10" /></div></div>}
      <div className="flex flex-col gap-2"><Label htmlFor="email">Email address</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="pl-10" /></div></div>
      <div className="flex flex-col gap-2"><div className="flex items-center justify-between gap-3"><Label htmlFor="password">Password</Label>{!isSignup && <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>}</div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="password" type={showPassword ? 'text' : 'password'} required minLength={PASSWORD_MIN_LENGTH} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="10+ characters" className="pl-10 pr-10" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff /> : <Eye />}</button></div>{isSignup && <p className="text-xs text-muted-foreground">At least {PASSWORD_MIN_LENGTH} characters.</p>}</div>
      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-end" />}{isSignup ? 'Create account' : 'Sign in'}</Button>
      <p className="text-center text-sm text-muted-foreground">{isSignup ? 'Already have an account?' : 'New to Qtor?'} <Link href={isSignup ? '/login' : '/sign-up'} className="font-semibold text-primary hover:underline">{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
      {isSignup && <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><CheckCircle2 className="text-brand" /> Email and password only. No social sign-in.</p>}
    </form>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { AuthPage } from '@/components/auth/auth-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthApiError, authApi, PASSWORD_MIN_LENGTH } from '@/lib/api/auth'

export default function ResetPasswordPage() { const router = useRouter(); const [token, setToken] = useState(''); const [password, setPassword] = useState(''); useEffect(() => { setToken(new URLSearchParams(window.location.search).get('token') ?? '') }, []); const [confirm, setConfirm] = useState(''); const [pending, setPending] = useState(false); const [error, setError] = useState(''); async function submit(event: React.FormEvent) { event.preventDefault(); setError(''); if (password.length < PASSWORD_MIN_LENGTH) return setError(`Use at least ${PASSWORD_MIN_LENGTH} characters.`); if (password !== confirm) return setError('Passwords do not match.'); setPending(true); try { await authApi.confirmPasswordReset(token, password); router.push('/login?reset=complete') } catch (value) { setError(value instanceof AuthApiError ? value.message : 'This reset link is no longer valid.') } finally { setPending(false) } } return <AuthPage eyebrow="New password" title="Choose a new password." description="Use at least 10 characters, then sign in with your updated password."><form onSubmit={submit} className="flex flex-col gap-5">{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<div className="flex flex-col gap-2"><Label htmlFor="password">New password</Label><Input id="password" type="password" minLength={PASSWORD_MIN_LENGTH} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="10+ characters" /></div><div className="flex flex-col gap-2"><Label htmlFor="confirm">Confirm password</Label><Input id="confirm" type="password" minLength={PASSWORD_MIN_LENGTH} required value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Repeat your password" /></div><Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-end" />}Update password</Button></form></AuthPage> }

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { AuthPage } from '@/components/auth/auth-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthApiError, authApi } from '@/lib/api/auth'

export default function VerifyEmailPage() { const router = useRouter(); const [token, setToken] = useState(''); useEffect(() => { setToken(new URLSearchParams(window.location.search).get('token') ?? '') }, []); const [pending, setPending] = useState(false); const [error, setError] = useState(''); const [done, setDone] = useState(false); async function submit(event: React.FormEvent) { event.preventDefault(); setPending(true); setError(''); try { await authApi.confirmEmailVerification(token); setDone(true); setTimeout(() => router.push('/dashboard'), 800) } catch (value) { setError(value instanceof AuthApiError ? value.message : 'This verification link is no longer valid.') } finally { setPending(false) } } return <AuthPage eyebrow="Email verification" title={done ? 'Email verified.' : 'Confirm your email.'} description={done ? 'Your Qtor account is ready to use.' : 'Paste the verification token from your email to finish setting up your account.'}>{done ? <div className="flex flex-col items-center gap-4 py-6 text-center"><CheckCircle2 className="text-brand" size={40} /><Button asChild><Link href="/dashboard">Continue to Qtor</Link></Button></div> : <form onSubmit={submit} className="flex flex-col gap-5">{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<div className="flex flex-col gap-2"><Label htmlFor="token">Verification token</Label><Input id="token" required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste your token" /></div><Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-end" />}Verify email</Button></form>}</AuthPage> }

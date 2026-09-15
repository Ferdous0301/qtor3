'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import { AuthPage } from '@/components/auth/auth-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authApi, AuthApiError } from '@/lib/api/auth'

export default function ForgotPasswordPage() { const [email, setEmail] = useState(''); const [pending, setPending] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState(''); async function submit(event: React.FormEvent) { event.preventDefault(); setPending(true); setError(''); try { await authApi.requestPasswordReset(email); setSent(true) } catch (value) { setError(value instanceof AuthApiError ? value.message : 'We could not send that request.') } finally { setPending(false) } } return <AuthPage eyebrow="Account recovery" title={sent ? 'Check your inbox.' : 'Reset your password.'} description={sent ? 'If an account matches that email, you will receive a password reset link shortly.' : 'Enter your email and we will send a secure reset link if an account matches it.'}>{sent ? <div className="flex flex-col gap-5"><Alert><MailCheck /><AlertDescription>For your security, this message is the same whether or not an account exists.</AlertDescription></Alert><Button asChild size="lg" className="w-full"><Link href="/login">Return to sign in</Link></Button></div> : <form onSubmit={submit} className="flex flex-col gap-5">{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<div className="flex flex-col gap-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div><Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ArrowRight data-icon="inline-end" />}Send reset link</Button><Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft /> Back to sign in</Link></form>}</AuthPage> }

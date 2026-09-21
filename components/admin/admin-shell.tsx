'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, ShieldCheck, ReceiptText, Activity, FileArchive, ScrollText, ArrowLeft, Settings2, Network } from 'lucide-react'

const items = [['/admin', 'Overview', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/entitlements', 'Entitlements', ShieldCheck], ['/admin/purchases', 'Purchases & payments', ReceiptText], ['/admin/operations', 'Exports & jobs', Activity], ['/admin/usage', 'OCR/AI usage', Activity], ['/admin/templates', 'Templates', FileArchive], ['/admin/pricing', 'Pricing & config', Settings2], ['/admin/taxonomy', 'Taxonomy', Network], ['/admin/audit-log', 'Audit log', ScrollText]] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth(); const router = useRouter(); const pathname = usePathname(); const allowed = user?.roles?.includes('admin')
  if (!ready) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking admin access…</div>
  if (!allowed) return <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6"><div className="flex max-w-md flex-col gap-4 rounded-lg border bg-background p-8 shadow-sm"><Badge variant="destructive" className="w-fit">Admin</Badge><h1 className="text-2xl font-semibold">You don&apos;t have access</h1><p className="text-sm text-muted-foreground">This area is restricted to administrator accounts. Server permissions remain the final gate.</p><Button variant="outline" onClick={() => router.push('/dashboard')}><ArrowLeft data-icon="inline-start" />Return to app</Button></div></div>
  return <div className="min-h-screen bg-muted/20"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-slate-950 p-4 text-slate-100 lg:flex lg:flex-col"><div className="flex items-center justify-between border-b border-slate-800 pb-4"><span className="font-semibold">Qtor operations</span><Badge variant="secondary">Admin</Badge></div><nav className="flex flex-1 flex-col gap-1 py-5">{items.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${pathname === href ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon data-icon="inline-start" />{label}</Link>)}</nav><Link href="/dashboard" className="flex items-center gap-2 border-t border-slate-800 pt-4 text-sm text-slate-400 hover:text-white"><ArrowLeft data-icon="inline-start" />Teacher app</Link></aside><main className="min-h-screen lg:pl-64"><div className="border-b bg-amber-50 px-6 py-2 text-xs text-amber-900">Development environment — admin actions use real endpoints and are audit logged.</div><div className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</div></main></div>
}

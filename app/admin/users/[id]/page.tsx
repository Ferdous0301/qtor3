'use client'

import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminTable } from '@/components/admin/admin-table'
import { adminApi } from '@/lib/api/admin'

export default function AdminUserDetail() { const { id } = useParams<{ id: string }>(); const { data, error, mutate } = useSWR(`admin-user-${id}`, () => adminApi.user(id)); if (error) return <Card><CardContent className="p-6 text-sm text-destructive">{error.message.includes('403') ? "You don't have access" : error.message}</CardContent></Card>; return <div className="flex flex-col gap-6"><header><Badge variant="outline">User history</Badge><h1 className="mt-3 text-3xl font-semibold">{data?.full_name || data?.email || 'Loading user…'}</h1><p className="mt-2 font-mono text-xs text-muted-foreground">{id}</p></header><Card><CardHeader><CardTitle>Profile & roles</CardTitle></CardHeader><CardContent className="flex flex-wrap items-center gap-2">{data?.roles?.map((role) => <Badge key={role}>{role}</Badge>)}<Badge variant={data?.is_active ? 'outline' : 'destructive'}>{data?.is_active ? 'Active' : 'Inactive'}</Badge><span className="text-sm text-muted-foreground">{data?.email}</span></CardContent></Card><div className="grid gap-6 xl:grid-cols-2"><AdminTable kind="entitlements" /><AdminTable kind="purchases" /><AdminTable kind="operations" /><AdminTable kind="jobs" /><AdminTable kind="templates" /><AdminTable kind="audit-log" /></div></div> }

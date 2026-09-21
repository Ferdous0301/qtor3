'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { adminApi, adminQuery } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function UsersAdmin() { const search = useSearchParams(); const [q, setQ] = useState(search.get('q') || ''); const query = adminQuery({ q, page: search.get('page') || '1' }); const { data, error, isLoading } = useSWR(`admin-users${query}`, () => adminApi.users(query)); return <div className="flex flex-col gap-6"><header><Badge variant="outline">Access operations</Badge><h1 className="mt-3 text-3xl font-semibold">Users</h1><p className="mt-2 text-sm text-muted-foreground">Search identities, inspect roles, and open the user history.</p></header><Card><CardHeader><CardTitle className="text-base">Directory</CardTitle><Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search email or name" className="max-w-md" /></CardHeader><CardContent className="p-0">{error ? <p className="p-6 text-sm text-destructive">{error.message}</p> : isLoading ? <p className="p-6 text-sm text-muted-foreground">Loading users…</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="sticky top-0 border-b bg-background"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Roles</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr></thead><tbody>{data?.items.map((user) => <tr key={user.id} className="border-b last:border-0"><td className="px-4 py-3"><Link className="font-medium hover:underline" href={`/admin/users/${user.id}`}>{user.full_name || user.email}</Link><p className="font-mono text-xs text-muted-foreground">{user.id}</p></td><td className="px-4 py-3">{user.roles?.map((role) => <Badge key={role} variant="secondary" className="mr-1">{role}</Badge>)}</td><td className="px-4 py-3"><Badge variant={user.is_active ? 'outline' : 'destructive'}>{user.is_active ? 'Active' : 'Inactive'}</Badge></td><td className="px-4 py-3 text-muted-foreground">{user.created_at}</td></tr>)}</tbody></table></div>}</CardContent></Card></div> }

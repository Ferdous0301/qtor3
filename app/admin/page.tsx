'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminApi } from '@/lib/api/admin'

const cards = [['users', 'Users'], ['pending', 'Pending purchases'], ['failedJobs', 'Failed jobs'], ['failedExports', 'Failed exports']] as const
export default function AdminOverview() { const { data, error, isLoading } = useSWR('admin-overview', adminApi.counts); return <div className="flex flex-col gap-6"><header><Badge variant="outline">Operations overview</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin control room</h1><p className="mt-2 text-sm text-muted-foreground">Cheap live counts from real admin endpoints. No invented aggregates.</p></header>{error ? <Card><CardContent className="p-6 text-sm text-destructive">Unable to load overview: {error.message}</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key, label]) => <Card key={key}><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{isLoading ? '—' : data?.[key]}</p></CardContent></Card>)}</div>}<Card><CardHeader><CardTitle>Provider usage summary</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm sm:grid-cols-3">{data?.summary ? Object.entries(data.summary).slice(0, 6).map(([key, value]) => <div key={key} className="rounded-md border p-3"><p className="text-muted-foreground">{key.replaceAll('_', ' ')}</p><p className="mt-1 font-medium">{String(value)}</p></div>) : <p className="text-muted-foreground">Summary unavailable.</p>}</CardContent></Card></div> }

"use client"
import useSWR from "swr"
import Link from "next/link"
import { billingApi, billingError, money } from "@/lib/api/billing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
export function PaperPricePanel({ paperId, questionCount }: { paperId:string; questionCount:number }){const {data,error,mutate}=useSWR(["readiness",paperId,questionCount],()=>billingApi.readiness(paperId),{dedupingInterval:500});if(error)return <Card><CardContent className="p-4 text-sm text-destructive">{billingError(error)}</CardContent></Card>;if(!data)return <Card><CardContent className="p-4 text-sm text-muted-foreground">Checking export readiness…</CardContent></Card>;return <Card><CardHeader><CardTitle>Export readiness</CardTitle><CardDescription>{data.question_count} questions · {data.mcq_count} MCQ · {data.cq_count} CQ</CardDescription></CardHeader><CardContent className="flex items-center justify-between gap-3">{!data.question_count?<p className="text-sm">Add at least one question first.</p>:!data.requires_entitlement?<p className="text-sm font-medium">Free to export</p>:<><p className="text-sm">Paper size: {data.tier_display_name} — {money(data.price_amount,data.currency)} to export</p><Link href="/pricing"><Button>Get an export</Button></Link></>}</CardContent></Card>}

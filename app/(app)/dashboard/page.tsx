'use client'

import Link from "next/link"
import useSWR from "swr"
import { ArrowRight, BookOpenText, CirclePlus, FileUp, Loader2, Plus, Sparkles } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { StatusBadge } from "@/components/patterns/status-badge"
import { useAuth } from "@/components/auth/auth-provider"
import { papersApi, type Paper } from "@/lib/api/papers"
import { dashboardApi, featureLabels } from "@/lib/api/client"

function formatUpdatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Recently updated"
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function paperMeta(paper: Paper) {
  const details = [paper.question_count ? `${paper.question_count} questions` : "No questions yet"]
  if (paper.total_marks) details.push(`${paper.total_marks} marks`)
  return details.join(" · ")
}

export default function DashboardPage() {
  const { user, configured, ready } = useAuth()
  const { data, error, isLoading, mutate } = useSWR(
    ready && configured ? "dashboard-recent-papers" : null,
    () => papersApi.list({ page: 1, page_size: 5 }),
    { revalidateOnFocus: false },
  )
  const { data: entitlements } = useSWR(ready && configured ? "dashboard-entitlements" : null, dashboardApi.entitlements, { revalidateOnFocus: false })
  const { data: templates } = useSWR(ready && configured ? "dashboard-templates" : null, dashboardApi.templates, { revalidateOnFocus: false })
  const papers = data?.items ?? []
  const readyTemplates = templates?.items?.filter((template) => template.status === "ready") ?? []
  const firstName = user?.full_name?.split(" ")[0] ?? "there"

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Pick up where you left off or start your next paper."
        actions={<Button nativeButton={false} render={<Link href="/papers/new" />}><Plus data-icon="inline-start" />Create a paper</Button>}
      />

      {!configured ? (
        <Alert variant="destructive">
          <AlertTitle>Connect your Qtor backend to load recent papers.</AlertTitle>
          <AlertDescription>Set NEXT_PUBLIC_API_BASE_URL to enable the dashboard&apos;s live paper list.</AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="quick-actions-heading" className="font-serif text-lg font-semibold">Quick actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="flex min-h-28 flex-col gap-3">
              <CirclePlus className="size-5 text-primary" />
              <div className="flex flex-1 flex-col gap-1"><h3 className="text-sm font-medium">Create a paper</h3><p className="text-sm text-muted-foreground">Start with a blank paper and add questions.</p></div>
              <Button size="sm" className="w-full" nativeButton={false} render={<Link href="/papers/new" />}>Start building<ArrowRight data-icon="inline-end" /></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex min-h-28 flex-col gap-3"><BookOpenText className="size-5 text-muted-foreground" /><div className="flex flex-1 flex-col gap-1"><h3 className="text-sm font-medium">Browse question bank</h3><p className="text-sm text-muted-foreground">Find questions to add to a paper.</p></div><Button size="sm" variant="outline" className="w-full" nativeButton={false} render={<Link href="/question-bank" />}>Browse questions<ArrowRight data-icon="inline-end" /></Button></CardContent>
          </Card>
          <Card>
            <CardContent className="flex min-h-28 flex-col gap-3"><FileUp className="size-5 text-muted-foreground" /><div className="flex flex-1 flex-col gap-1"><h3 className="text-sm font-medium">Upload questions</h3><p className="text-sm text-muted-foreground">Import a scanned paper when OCR is ready.</p></div><Button size="sm" variant="outline" className="w-full" disabled>Upload questions</Button></CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Recent papers</CardTitle><CardDescription>Your five most recently updated papers</CardDescription><CardAction><Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/papers" />}>View all</Button></CardAction></CardHeader>
            <CardContent className="p-0">
              {isLoading ? <div className="flex items-center gap-2 px-6 py-8 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading recent papers...</div> : error ? <div className="flex flex-col gap-3 px-6 py-8"><p className="text-sm text-destructive">{error.message}</p><Button size="sm" variant="outline" className="w-fit" onClick={() => mutate()}>Try again</Button></div> : papers.length === 0 ? <Empty className="border-0 py-10"><EmptyHeader><EmptyMedia variant="icon"><Sparkles /></EmptyMedia><EmptyTitle>Your paper shelf is ready</EmptyTitle><EmptyDescription>Create your first paper to see drafts and recent work here.</EmptyDescription></EmptyHeader><Button nativeButton={false} render={<Link href="/papers/new" />}>Create your first paper</Button></Empty> : <ul className="flex flex-col">{papers.map((paper, index) => <li key={paper.id}>{index > 0 ? <Separator /> : null}<Link href={`/papers/${paper.id}`} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"><div className="flex min-w-0 flex-col gap-1"><span className="truncate text-sm font-medium">{paper.title}</span><span className="text-xs text-muted-foreground">{paperMeta(paper)} · Updated {formatUpdatedAt(paper.updated_at)}</span></div><StatusBadge status={paper.status as "draft" | "ready" | "exported"} /></Link></li>)}</ul>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Saved templates</CardTitle><CardDescription>Reusable layouts for your next paper</CardDescription><CardAction><Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/templates" />}>View all</Button></CardAction></CardHeader>
            <CardContent>{readyTemplates.length ? <ul className="flex flex-col gap-3">{readyTemplates.map((template) => <li key={template.id} className="flex items-center justify-between gap-3 rounded-md border p-3"><div><p className="text-sm font-medium">{template.name}</p><p className="text-xs text-muted-foreground">Version {template.version ?? 1}</p></div><Badge variant="secondary">Ready</Badge></li>)}</ul> : <Empty className="border-0 py-6"><EmptyHeader><EmptyTitle>No saved templates yet</EmptyTitle><EmptyDescription>Copy your school&apos;s paper design from a Word file.</EmptyDescription></EmptyHeader><Button variant="outline" nativeButton={false} render={<Link href="/templates" />}>Explore templates</Button></Empty>}</CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-primary" />Premium features</CardTitle><CardDescription>Each trial is one use.</CardDescription><CardAction><Badge variant="secondary">Live</Badge></CardAction></CardHeader><CardContent className="flex flex-col gap-3">{(entitlements?.features ?? []).map((feature) => { const extra = feature.purchased_available_count + feature.granted_available_count; const label = featureLabels[feature.feature_code] ?? feature.feature_name; return <div key={feature.feature_code} className="flex items-start justify-between gap-3"><span className="text-sm">{label}</span><span className="text-right text-xs text-muted-foreground">{feature.trial_available && !feature.trial_consumed ? "Free trial available" : feature.trial_consumed ? "Trial used" : extra ? `+${extra} extra uses` : "Included"}</span></div> })}</CardContent><CardFooter><Button className="w-full" variant="outline">Upgrade to Premium</Button></CardFooter></Card>

          <Card><CardHeader><CardTitle>Paper exports</CardTitle><CardDescription>Available entitlements by paper size</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{(entitlements?.paper_export ?? []).map((entitlement) => <div key={entitlement.size_tier_code} className="flex items-center justify-between gap-3"><span className="text-sm font-medium capitalize">{entitlement.available_count} {entitlement.size_tier_code} exports</span><Badge variant="secondary">{entitlement.available_count} available</Badge></div>)}{entitlements?.paper_export?.every((item) => item.available_count === 0) ? <p className="text-sm text-muted-foreground">Papers made only from the question bank export free.</p> : null}</CardContent><CardFooter><Button variant="ghost" size="sm" className="w-full" nativeButton={false} render={<Link href="/usage" />}>View full usage details</Button></CardFooter></Card>
        </div>
      </div>
    </PageContainer>
  )
}

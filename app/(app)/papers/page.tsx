"use client"

import { useEffect, useState } from "react"
import { Archive, Copy, FilePlus2, Loader2, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/patterns/status-badge"
import { papersApi, paperLockedMessage, type Paper } from "@/lib/api/papers"
import Link from "next/link"

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadPapers() {
    setLoading(true)
    setError("")
    try {
      const result = await papersApi.list({ include_archived: filter === "archived", status: filter === "all" || filter === "archived" ? undefined : filter, page_size: 50 })
      setPapers(result.items ?? [])
    } catch (cause) {
      setError(paperLockedMessage(cause))
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadPapers() }, [filter])

  async function mutate(id: string, action: "archive" | "restore" | "duplicate") {
    setBusyId(id)
    try {
      if (action === "archive") { await papersApi.archive(id); toast.success("Paper archived") }
      if (action === "restore") { await papersApi.restore(id); toast.success("Paper restored") }
      if (action === "duplicate") { await papersApi.duplicate(id); toast.success("Paper duplicated") }
      await loadPapers()
    } catch (cause) { toast.error(paperLockedMessage(cause)) } finally { setBusyId(null) }
  }

  return (
    <PageContainer>
      <PageHeader title="My Papers" description="Build, review, and manage your assessment papers." actions={<Link href="/papers/new"><Button><FilePlus2 data-icon="inline-start" />New paper</Button></Link>} />
      <Card>
        <CardHeader className="border-b gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle>Your papers</CardTitle><CardDescription>Drafts stay editable until you finalize them.</CardDescription></div>
          <Select value={filter} onValueChange={(value) => setFilter(value ?? "all")}><SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Filter papers" /></SelectTrigger><SelectContent><SelectItem value="all">All papers</SelectItem><SelectItem value="draft">Drafts</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center p-12 text-sm text-muted-foreground"><Loader2 className="mr-2 animate-spin" />Loading papers...</div> : error ? <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><FilePlus2 /></EmptyMedia><EmptyTitle>Unable to load papers</EmptyTitle><EmptyDescription>{error}</EmptyDescription></EmptyHeader><Button variant="outline" onClick={() => void loadPapers()}>Try again</Button></Empty> : papers.length === 0 ? <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><FilePlus2 /></EmptyMedia><EmptyTitle>No papers here yet</EmptyTitle><EmptyDescription>Create your first paper and add questions from the bank.</EmptyDescription></EmptyHeader><Link href="/papers/new"><Button>Create a paper</Button></Link></Empty> : <ul className="flex flex-col">{papers.map((paper) => <li key={paper.id} className="flex flex-col gap-4 border-b px-4 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"><Link href={`/papers/${paper.id}`} className="min-w-0"><p className="truncate text-sm font-medium hover:underline">{paper.title}</p><p className="mt-1 text-xs text-muted-foreground">{paper.question_count} questions · {paper.total_marks} marks · Updated {new Date(paper.updated_at).toLocaleDateString()}</p></Link><div className="flex items-center gap-2"><StatusBadge status={paper.is_archived ? "draft" : paper.status as "draft" | "ready" | "exported"} /><Button variant="ghost" size="icon-sm" aria-label={`Duplicate ${paper.title}`} disabled={busyId === paper.id} onClick={() => void mutate(paper.id, "duplicate")}><Copy /></Button>{paper.is_archived ? <Button variant="ghost" size="icon-sm" aria-label={`Restore ${paper.title}`} disabled={busyId === paper.id} onClick={() => void mutate(paper.id, "restore")}><RotateCcw /></Button> : <Button variant="ghost" size="icon-sm" aria-label={`Archive ${paper.title}`} disabled={busyId === paper.id} onClick={() => void mutate(paper.id, "archive")}><Archive /></Button>}</div></li>)}</ul>}
        </CardContent>
      </Card>
    </PageContainer>
  )
}

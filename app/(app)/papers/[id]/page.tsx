"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Archive, ArrowDown, ArrowLeft, ArrowUp, Check, Copy, GripVertical, LockKeyhole, Plus, Save, Trash2, Undo2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { papersApi, paperLockedMessage, type Paper, type PaperQuestion } from "@/lib/api/papers"

type SaveState = "saved" | "saving" | "error"

function QuestionCard({ item, index, count, locked, onMove, onRemove, onSection, onDrop }: { item: PaperQuestion; index: number; count: number; locked: boolean; onMove: (direction: -1 | 1) => void; onRemove: () => void; onSection: (value: string) => void; onDrop: (draggedId: string) => void }) {
  const snapshot = item.snapshot
  return <article draggable={!locked} onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onDrop(event.dataTransfer.getData("text/plain")) }} className="group flex gap-3 border-b px-4 py-5 transition-colors last:border-0 hover:bg-muted/20 sm:px-6">
    <button type="button" className="mt-1 hidden cursor-grab touch-none text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:block" aria-label={`Drag question ${index + 1} to reorder`} tabIndex={locked ? -1 : 0}><GripVertical /></button>
    <div className="min-w-0 flex-1">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="font-mono">Q{index + 1}</span>{snapshot.question_type_name ? <span>{snapshot.question_type_name}</span> : null}{snapshot.level_name ? <span>· {snapshot.level_name}</span> : null}<span className="ml-auto font-medium text-foreground">{item.effective_mark} {item.effective_mark === 1 ? "mark" : "marks"}</span></div>
      {item.section_label ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{item.section_label}</p> : null}
      <p className="text-sm leading-6 text-foreground">{snapshot.question_text}</p>
      {snapshot.options?.length ? <ol className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">{snapshot.options.map((option) => <li key={option.order_index} className="rounded-md border bg-muted/30 px-3 py-2"><span className="mr-2 font-medium text-foreground">{String.fromCharCode(65 + option.order_index)}.</span>{option.option_text}</li>)}</ol> : null}
      <div className="mt-4 flex flex-wrap items-center gap-2"><Input aria-label={`Section for question ${index + 1}`} disabled={locked} value={item.section_label ?? ""} onChange={(event) => onSection(event.target.value)} placeholder="Section label, e.g. Part A" className="h-7 max-w-48 text-xs" /><span className="text-xs text-muted-foreground">Frozen question snapshot</span></div>
    </div>
    <div className="flex shrink-0 flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><Button variant="ghost" size="icon-xs" disabled={locked || index === 0} onClick={() => onMove(-1)} aria-label={`Move question ${index + 1} up`}><ArrowUp /></Button><Button variant="ghost" size="icon-xs" disabled={locked || index === count - 1} onClick={() => onMove(1)} aria-label={`Move question ${index + 1} down`}><ArrowDown /></Button><Button variant="ghost" size="icon-xs" disabled={locked} onClick={onRemove} aria-label={`Remove question ${index + 1}`}><Trash2 /></Button></div>
  </article>
}

export default function PaperEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const addKey = searchParams.get("add")
  const addedFromBank = useRef<string | null>(null)
  const id = params.id
  const [paper, setPaper] = useState<Paper | null>(null)
  const [questions, setQuestions] = useState<PaperQuestion[]>([])
  const [title, setTitle] = useState("")
  const [savedTitle, setSavedTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>("saved")
  const [error, setError] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const locked = Boolean(paper && (paper.is_archived || paper.status !== "draft"))
  const sections = useMemo(() => Array.from(new Set(questions.map((question) => question.section_label || "Unsectioned"))), [questions])

  async function loadPaper() {
    setLoading(true); setError("")
    try { const result = await papersApi.get(id); setPaper(result); setQuestions(result.questions ?? []); setTitle(result.title); setSavedTitle(result.title) } catch (cause) { setError(paperLockedMessage(cause)) } finally { setLoading(false) }
  }
  useEffect(() => { void loadPaper() }, [id])
  useEffect(() => {
    if (!paper || locked || !addKey || addedFromBank.current === addKey) return
    const questionIds = addKey.split(",").filter(Boolean)
    if (!questionIds.length) return
    addedFromBank.current = addKey
    void (async () => {
      setSaveState("saving")
      try {
        const added = await Promise.all(questionIds.map((questionId) => papersApi.addQuestion(id, { source_question_id: questionId })))
        setQuestions((current) => [...current, ...added])
        setSaveState("saved")
        router.replace(`/papers/${id}`)
        toast.success(`${added.length} question${added.length === 1 ? "" : "s"} added`)
      } catch (cause) {
        setSaveState("error")
        toast.error(paperLockedMessage(cause))
      }
    })()
  }, [addKey, id, locked, paper, router])

  async function saveTitle() {
    if (!title.trim() || title === savedTitle || locked) return
    setSaveState("saving")
    try { const result = await papersApi.update(id, { title: title.trim() }); setPaper((current) => current ? { ...current, ...result } : result); setSavedTitle(title.trim()); setSaveState("saved"); toast.success("Paper details saved") } catch (cause) { setSaveState("error"); toast.error(paperLockedMessage(cause)) }
  }

  async function reorder(next: PaperQuestion[]) {
    const previous = questions; setQuestions(next); setSaveState("saving")
    try { await papersApi.reorder(id, next.map((item) => item.id)); setSaveState("saved") } catch (cause) { setQuestions(previous); setSaveState("error"); toast.error(paperLockedMessage(cause)) }
  }
  async function move(index: number, direction: -1 | 1) { const next = [...questions]; const target = index + direction; [next[index], next[target]] = [next[target], next[index]]; await reorder(next) }
  async function dropQuestion(draggedId: string, targetId: string) { const from = questions.findIndex((question) => question.id === draggedId); const to = questions.findIndex((question) => question.id === targetId); if (from < 0 || to < 0 || from === to) return; const next = [...questions]; const [dragged] = next.splice(from, 1); next.splice(to, 0, dragged); await reorder(next) }
  async function remove(item: PaperQuestion) { const previous = questions; setQuestions(previous.filter((question) => question.id !== item.id)); setSaveState("saving"); try { await papersApi.removeQuestion(id, item.id); setSaveState("saved"); toast.success("Question removed") } catch (cause) { setQuestions(previous); setSaveState("error"); toast.error(paperLockedMessage(cause)) } }
  async function updateSection(item: PaperQuestion, value: string) { const nextValue = value.trim() || undefined; setQuestions((current) => current.map((question) => question.id === item.id ? { ...question, section_label: nextValue } : question)); setSaveState("saving"); try { await papersApi.updateQuestion(id, item.id, nextValue ? { section_label: nextValue, clear_section_label: false } : { clear_section_label: true }); setSaveState("saved") } catch (cause) { setSaveState("error"); toast.error(paperLockedMessage(cause)) } }

  async function duplicate() { try { const copy = await papersApi.duplicate(id, `${title} copy`); toast.success("Paper duplicated"); router.push(`/papers/${copy.id}`) } catch (cause) { toast.error(paperLockedMessage(cause)) } }
  async function archive() { try { await papersApi.archive(id); toast.success("Paper archived"); await loadPaper() } catch (cause) { toast.error(paperLockedMessage(cause)) } }

  if (loading) return <PageContainer><div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Loading paper...</div></PageContainer>
  if (error || !paper) return <PageContainer><Empty className="min-h-96"><EmptyHeader><EmptyMedia variant="icon"><LockKeyhole /></EmptyMedia><EmptyTitle>Paper unavailable</EmptyTitle><EmptyDescription>{error || "This paper could not be found."}</EmptyDescription></EmptyHeader><Link href="/papers"><Button variant="outline">Back to papers</Button></Link></Empty></PageContainer>

  return <PageContainer>
    <div className="flex items-center gap-2"><Link href="/papers"><Button variant="ghost" size="sm"><ArrowLeft data-icon="inline-start" />All papers</Button></Link><span className="text-xs text-muted-foreground">/ {paper.title}</span></div>
    <PageHeader title={locked ? "Paper preview" : "Create question paper"} description={locked ? "This paper is read-only. Its questions and marks are safely preserved." : "A working draft. Organize the document now, then preview or export later."} actions={<div className="flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground" aria-live="polite">{saveState === "saving" ? "Saving..." : saveState === "error" ? "Save failed" : <><Check className="mr-1 inline size-3" />Saved</>}</span><Button variant="outline" size="sm" onClick={() => void duplicate()}><Copy data-icon="inline-start" />Duplicate</Button>{locked ? null : <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogTrigger render={<Button variant="outline" size="sm" />}><Archive data-icon="inline-start" />Archive</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Archive this paper?</DialogTitle><DialogDescription>Archived papers are locked and can be restored from your paper list.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { setConfirmOpen(false); void archive() }}>Archive paper</Button></DialogFooter></DialogContent></Dialog>}</div>} />
    {locked ? <div className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/30 p-4 text-sm"><LockKeyhole className="mt-0.5 shrink-0 text-muted-foreground" /><p><strong>This paper is locked.</strong> {paper.is_archived ? "Restore it from My Papers to make changes." : "Only draft papers can be edited."}</p></div> : null}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="flex flex-col gap-6"><Card><CardHeader className="pb-4"><CardTitle>Paper details</CardTitle><CardDescription>Edit the identity of this working draft. Metadata saves explicitly.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div className="flex flex-col gap-2"><Label htmlFor="paper-title">Paper title</Label><Input id="paper-title" value={title} disabled={locked} onChange={(event) => setTitle(event.target.value)} onBlur={() => void saveTitle()} placeholder="Physics — Chapter Test" /></div><Button variant="outline" disabled={locked || title === savedTitle || !title.trim()} onClick={() => void saveTitle()}><Save data-icon="inline-start" />Save details</Button></CardContent></Card>
      <Card><CardHeader className="border-b pb-4"><div className="flex items-start justify-between gap-3"><div><CardTitle>Question paper <span className="text-muted-foreground">({questions.length})</span></CardTitle><CardDescription className="mt-1">Arrange sections and questions. Each item keeps the snapshot selected for this draft.</CardDescription></div>{locked ? null : <Link href={`/question-bank?paper=${id}`}><Button variant="outline" size="sm"><Plus data-icon="inline-start" />Add questions</Button></Link>}</div></CardHeader><CardContent className="p-0">{questions.length === 0 ? <Empty className="min-h-56"><EmptyHeader><EmptyMedia variant="icon"><Plus /></EmptyMedia><EmptyTitle>No questions yet</EmptyTitle><EmptyDescription>Choose questions from Question Bank to start building this paper.</EmptyDescription></EmptyHeader><Link href={`/question-bank?paper=${id}`}><Button variant="outline">Browse question bank</Button></Link></Empty> : <div>{sections.map((section) => <div key={section}>{section !== "Unsectioned" ? <div className="border-b bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-6">{section}</div> : null}{questions.filter((question) => (question.section_label || "Unsectioned") === section).map((item) => { const index = questions.findIndex((question) => question.id === item.id); return <QuestionCard key={item.id} item={item} index={index} count={questions.length} locked={locked} onMove={(direction) => void move(index, direction)} onRemove={() => void remove(item)} onSection={(value) => void updateSection(item, value)} onDrop={(draggedId) => void dropQuestion(draggedId, item.id)} /> })}</div>)}</div>}</CardContent></Card></div>
      <aside className="flex flex-col gap-4"><Card><CardHeader><CardTitle>Paper summary</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Questions</span><strong>{questions.length}</strong></div><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Total marks</span><strong>{questions.reduce((total, question) => total + question.effective_mark, 0)}</strong></div><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Sections</span><strong>{sections.length}</strong></div></CardContent></Card><Card className="bg-muted/30"><CardContent className="flex gap-3 p-4 text-xs leading-5 text-muted-foreground"><Undo2 className="mt-0.5 size-4 shrink-0" />Questions use a frozen snapshot, so your paper will not change if the question bank is updated later.</CardContent></Card></aside>
    </div>
  </PageContainer>
}

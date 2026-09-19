"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { BookOpenText, Check, ChevronDown, ChevronLeft, ChevronRight, Filter, Loader2, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-provider"
import { questionApi, type QuestionSummary, type TaxonomyItem } from "@/lib/api/questions"

const emptyValue = "all"
const pageSize = 20

const mockQuestions: QuestionSummary[] = [
  {
    id: "mock-photosynthesis",
    question_text: "Explain how photosynthesis converts light energy into chemical energy in a green plant. Mention the role of chlorophyll and write the balanced word equation.",
    mark: 5,
    source: "sample",
    taxonomy: { class_id: "mock-class", class_name: "Class 10", subject_id: "mock-biology", subject_name: "Biology", question_type_id: "mock-creative", question_type_name: "Creative", level_name: "Application", chapter_name: "Life Processes", topic_name: "Photosynthesis" },
  },
  {
    id: "mock-quadratic",
    question_text: "If the roots of the equation x² − 7x + k = 0 differ by 3, find the value of k and verify both roots.",
    mark: 4,
    source: "sample",
    taxonomy: { class_id: "mock-class", class_name: "Class 10", subject_id: "mock-mathematics", subject_name: "Mathematics", question_type_id: "mock-short-answer", question_type_name: "Short answer", level_name: "Analysis", chapter_name: "Algebra", topic_name: "Quadratic equations" },
  },
]

type Filters = { classId: string; groupId: string; subjectId: string; chapterId: string; topicId: string; questionTypeId: string; levelId: string; sort: string }

function useTaxonomy(kind: string, params: Record<string, string | undefined>, enabled = true) {
  const key = enabled ? ["taxonomy", kind, ...Object.values(params)] : null
  return useSWR<TaxonomyItem[]>(key, ([, taxonomyKind]) => questionApi.taxonomy(taxonomyKind as string, params), { keepPreviousData: true })
}

function SelectFilter({ label, value, placeholder, options, disabled, onChange }: { label: string; value: string; placeholder: string; options?: TaxonomyItem[]; disabled?: boolean; onChange: (value: string | null) => void }) {
  return <div className="flex min-w-44 flex-1 flex-col gap-2"><Label className="text-xs font-medium text-muted-foreground">{label}</Label><Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent><SelectItem value={emptyValue}>All {label.toLowerCase()}</SelectItem>{options?.map((option) => <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>)}</SelectContent></Select></div>
}

function QuestionCard({ question, selected, expanded, onToggle, onExpand }: { question: QuestionSummary; selected: boolean; expanded: boolean; onToggle: () => void; onExpand: () => void }) {
  const { taxonomy } = question
  const path = [taxonomy.subject_name, taxonomy.chapter_name, taxonomy.topic_name].filter(Boolean).join(" / ")
  return <Card className={`group relative overflow-hidden border bg-card/85 backdrop-blur-sm transition-all duration-300 ${selected ? "border-primary/60 bg-primary/[0.05] shadow-xl shadow-primary/15 ring-1 ring-primary/20" : "hover:-translate-y-1 hover:border-brand/60 hover:bg-card hover:shadow-xl hover:shadow-primary/12"}`}><div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-brand to-primary transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} /><div className="pointer-events-none absolute right-0 top-0 size-24 rounded-full bg-brand/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" /><CardHeader className="gap-4 pb-3 pl-5"><div className="flex items-start justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><Badge variant="secondary" className="bg-primary/8 text-primary">{taxonomy.question_type_name}</Badge><Badge variant="outline">{question.mark} {question.mark === 1 ? "mark" : "marks"}</Badge>{taxonomy.level_name && <Badge variant="outline">{taxonomy.level_name}</Badge>}</div><Button variant={selected ? "secondary" : "outline"} size="sm" className="shrink-0 transition-transform hover:scale-105" onClick={onToggle}>{selected ? <Check data-icon="inline-start" /> : null}{selected ? "Added" : "Add"}</Button></div><button type="button" className="-mx-1 rounded-md p-1 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring" onClick={onExpand} aria-expanded={expanded} aria-label={`${expanded ? "Collapse" : "Preview"} question`}><CardTitle className="text-[15px] font-medium leading-7 text-foreground">{question.question_text}</CardTitle></button></CardHeader><CardContent className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 py-3 pl-5"><div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className="max-w-full truncate">{path || "Uncategorized"}</span><span aria-hidden="true">·</span><span className="whitespace-nowrap">No answer key</span></div><Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={onExpand}>{expanded ? "Hide details" : "Preview"}<ChevronDown className={`transition-transform ${expanded ? "rotate-180" : ""}`} data-icon="inline-end" /></Button></CardContent>{expanded && <div className="border-t bg-background px-5 py-4 text-sm leading-6 text-muted-foreground"><div className="mb-2 flex items-center gap-2 font-medium text-foreground"><Sparkles className="text-brand" data-icon="inline-start" />Question preview</div><p>{question.question_text}</p></div>}</Card>
}

function FilterContent({ filters, setFilter, classes, groups, subjects, chapters, topics, questionTypes, levels }: { filters: Filters; setFilter: (key: keyof Filters, value: string | null) => void; classes?: TaxonomyItem[]; groups?: TaxonomyItem[]; subjects?: TaxonomyItem[]; chapters?: TaxonomyItem[]; topics?: TaxonomyItem[]; questionTypes?: TaxonomyItem[]; levels?: TaxonomyItem[] }) {
  return <div className="flex flex-col gap-4"><div className="flex flex-wrap gap-3"><SelectFilter label="Class" value={filters.classId} placeholder="Choose class" options={classes} onChange={(value) => setFilter("classId", value)} /><SelectFilter label="Group / stream" value={filters.groupId} placeholder="Choose group" options={groups} disabled={filters.classId === emptyValue} onChange={(value) => setFilter("groupId", value)} /><SelectFilter label="Subject" value={filters.subjectId} placeholder="Choose subject" options={subjects} disabled={filters.classId === emptyValue} onChange={(value) => setFilter("subjectId", value)} /></div><div className="flex flex-wrap gap-3"><SelectFilter label="Chapter" value={filters.chapterId} placeholder="Choose chapter" options={chapters} disabled={filters.subjectId === emptyValue} onChange={(value) => setFilter("chapterId", value)} /><SelectFilter label="Topic" value={filters.topicId} placeholder="Choose topic" options={topics} disabled={filters.chapterId === emptyValue} onChange={(value) => setFilter("topicId", value)} /><SelectFilter label="Question type" value={filters.questionTypeId} placeholder="Any type" options={questionTypes} onChange={(value) => setFilter("questionTypeId", value)} /><SelectFilter label="Level" value={filters.levelId} placeholder="Any level" options={levels} onChange={(value) => setFilter("levelId", value)} /></div></div>
}

export default function QuestionBankPage() {
  const { configured } = useAuth()
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [filters, setFilters] = useState<Filters>({ classId: emptyValue, groupId: emptyValue, subjectId: emptyValue, chapterId: emptyValue, topicId: emptyValue, questionTypeId: emptyValue, levelId: emptyValue, sort: "newest" })
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<QuestionSummary[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setLanguage(window.localStorage.getItem("qtor-language") === "bn" ? "bn" : "en")
    sync()
    window.addEventListener("qtor-language-change", sync)
    return () => window.removeEventListener("qtor-language-change", sync)
  }, [])

  const params = { class_id: filters.classId === emptyValue ? undefined : filters.classId }
  const classes = useTaxonomy("classes", {})
  const groups = useTaxonomy("groups", { class_id: params.class_id }, Boolean(params.class_id))
  const subjects = useTaxonomy("subjects", { class_id: params.class_id, group_id: filters.groupId === emptyValue ? undefined : filters.groupId }, Boolean(params.class_id))
  const chapters = useTaxonomy("chapters", { subject_id: filters.subjectId === emptyValue ? undefined : filters.subjectId }, filters.subjectId !== emptyValue)
  const topics = useTaxonomy("topics", { chapter_id: filters.chapterId === emptyValue ? undefined : filters.chapterId }, filters.chapterId !== emptyValue)
  const questionTypes = useTaxonomy("question-types", {})
  const levels = useTaxonomy("levels", {})
  const questionParams = useMemo(() => ({ class_id: params.class_id, group_id: filters.groupId === emptyValue ? undefined : filters.groupId, subject_id: filters.subjectId === emptyValue ? undefined : filters.subjectId, chapter_id: filters.chapterId === emptyValue ? undefined : filters.chapterId, topic_id: filters.topicId === emptyValue ? undefined : filters.topicId, question_type_id: filters.questionTypeId === emptyValue ? undefined : filters.questionTypeId, level_id: filters.levelId === emptyValue ? undefined : filters.levelId, q: query || undefined, sort: filters.sort, page, page_size: pageSize }), [filters, query, page, params.class_id])
  const questions = useSWR(["questions", questionParams], ([, values]) => questionApi.questions(values), { keepPreviousData: true })
  const setFilter = (key: keyof Filters, value: string | null) => { setPage(1); setFilters((current) => { const next = { ...current, [key]: value ?? emptyValue }; if (key === "classId") Object.assign(next, { groupId: emptyValue, subjectId: emptyValue, chapterId: emptyValue, topicId: emptyValue }); if (key === "groupId" || key === "subjectId") Object.assign(next, { chapterId: emptyValue, topicId: emptyValue }); if (key === "chapterId") next.topicId = emptyValue; return next }) }
  const toggle = (question: QuestionSummary) => setSelected((current) => current.some((item) => item.id === question.id) ? current.filter((item) => item.id !== question.id) : [...current, question])
  const reset = () => { setFilters({ classId: emptyValue, groupId: emptyValue, subjectId: emptyValue, chapterId: emptyValue, topicId: emptyValue, questionTypeId: emptyValue, levelId: emptyValue, sort: "newest" }); setQuery(""); setPage(1); setExpandedId(null) }
  const data = questions.data
  const isPreviewMode = !configured || !data
  const items = data?.items?.length ? data.items : isPreviewMode ? mockQuestions : []
  const total = data?.total ?? (isPreviewMode ? mockQuestions.length : 0)
  const totalPages = data?.total_pages ?? (total ? Math.ceil(total / pageSize) : undefined)
  const selectVisible = () => setSelected((current) => [...current, ...items.filter((item) => !current.some((selectedItem) => selectedItem.id === item.id))])

  return <PageContainer><PageHeader title={language === "bn" ? "প্রশ্ন ব্যাংক" : "Question Bank"} description={language === "bn" ? "আপনার লাইব্রেরি থেকে দ্রুত সঠিক প্রশ্নটি খুঁজুন।" : "Find the right question quickly from your shared library."} actions={<><Button variant="outline" onClick={reset}><RotateCcw data-icon="inline-start" />{language === "bn" ? "রিসেট" : "Reset"}</Button><Button disabled={!selected.length}><BookOpenText data-icon="inline-start" />Add {selected.length ? `${selected.length} to paper` : "to paper"}</Button></>} /><div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-brand/[0.12] p-5 shadow-sm sm:p-6"><div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-brand/20 blur-3xl" /><div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-lg shadow-primary/20"><Sparkles data-icon="inline-start" /></div><div><p className="text-sm font-semibold">{isPreviewMode ? "Preview the Qtor question experience" : `${total.toLocaleString()} questions ready to explore`}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{isPreviewMode ? "The backend is not connected yet, so we are showing two realistic sample questions." : "Search, filter, preview, and select without losing your place."}</p></div></div><Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/15">{isPreviewMode ? "Sample data" : "Live library"}</Badge></div></div><div className="flex flex-col gap-4"><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder={language === "bn" ? "বাংলা বা ইংরেজিতে প্রশ্ন খুঁজুন..." : "Search questions in Bangla or English..."} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} /></div><Select value={filters.sort} onValueChange={(value) => setFilter("sort", value)}><SelectTrigger className="w-full sm:w-44"><SlidersHorizontal data-icon="inline-start" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="mark_asc">Marks: low to high</SelectItem><SelectItem value="mark_desc">Marks: high to low</SelectItem><SelectItem value="relevance">Most relevant</SelectItem></SelectContent></Select><Sheet><SheetTrigger render={<Button variant="outline" className="sm:hidden"><Filter data-icon="inline-start" />Filters</Button>} /><SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto"><SheetHeader><SheetTitle>Filter questions</SheetTitle></SheetHeader><div className="p-4"><FilterContent filters={filters} setFilter={setFilter} classes={classes.data} groups={groups.data} subjects={subjects.data} chapters={chapters.data} topics={topics.data} questionTypes={questionTypes.data} levels={levels.data} /></div></SheetContent></Sheet></div><Card className="hidden sm:block"><CardContent className="p-4"><FilterContent filters={filters} setFilter={setFilter} classes={classes.data} groups={groups.data} subjects={subjects.data} chapters={chapters.data} topics={topics.data} questionTypes={questionTypes.data} levels={levels.data} /></CardContent></Card><div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/10 bg-gradient-to-r from-primary/[0.06] to-brand/[0.1] px-4 py-3"><div className="flex items-center gap-2 text-sm"><Sparkles className="text-primary" data-icon="inline-start" /><span className="font-medium">{data?.total ? `${data.total.toLocaleString()} questions` : "Your question library"}</span><span className="hidden text-muted-foreground sm:inline">· 20 shown per page for fast browsing</span></div><Button variant="ghost" size="sm" onClick={selectVisible} disabled={!items.length}>Select visible</Button></div>{questions.isLoading ? <div className="flex items-center justify-center p-12 text-sm text-muted-foreground"><Loader2 className="mr-2 animate-spin" />Loading questions...</div> : configured ? questions.error : undefined ? <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><BookOpenText /></EmptyMedia><EmptyTitle>Questions are unavailable</EmptyTitle><EmptyDescription>{configured ? questions.error : undefined instanceof Error ? configured ? questions.error : undefined.message : "We couldn't load the question bank."}</EmptyDescription></EmptyHeader><Button variant="outline" onClick={() => void questions.mutate()}>Try again</Button></Empty> : items.length === 0 ? <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><BookOpenText /></EmptyMedia><EmptyTitle>{query ? "No matching questions" : "No questions found"}</EmptyTitle><EmptyDescription>{query ? "Try a broader search or reset your filters." : "Adjust the filters to explore your question bank."}</EmptyDescription></EmptyHeader></Empty> : <div className="flex flex-col gap-3">{items.map((question) => <QuestionCard key={question.id} question={question} selected={selected.some((item) => item.id === question.id)} expanded={expandedId === question.id} onToggle={() => toggle(question)} onExpand={() => setExpandedId((current) => current === question.id ? null : question.id)} />)}</div>}<div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">{data?.total ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, data.total)} of ${data.total.toLocaleString()}` : "Pagination stays server-backed for a large library."}</p>{totalPages && totalPages > 1 ? <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft data-icon="inline-start" />Previous</Button><span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight data-icon="inline-end" /></Button></div> : null}</div></div>{selected.length > 0 && <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-background/95 px-4 py-3 shadow-xl backdrop-blur sm:inset-x-auto sm:right-6 sm:w-auto"><div className="flex items-center gap-2 text-sm font-medium"><span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-xs text-primary-foreground">{selected.length}</span>selected</div><div className="flex items-center gap-1"><Button variant="ghost" size="sm" onClick={() => setSelected([])}><X data-icon="inline-start" />Clear</Button><Button size="sm"><BookOpenText data-icon="inline-start" />Add to paper</Button></div></div>}</PageContainer>
}

"use client"

import { FormEvent, useState } from "react"
import { ArrowLeft, FilePlus2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { papersApi, paperLockedMessage } from "@/lib/api/papers"

export default function NewPaperPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (event.nativeEvent instanceof SubmitEvent && event.nativeEvent.submitter === null) return
    if (!title.trim()) { setError("Give your paper a title to continue."); return }
    setCreating(true); setError("")
    try { const paper = await papersApi.create({ title: title.trim() }); toast.success("Paper created"); router.push(`/papers/${paper.id}`) } catch (cause) { setError(paperLockedMessage(cause)); setCreating(false) }
  }

  return <PageContainer>
    <Link href="/papers"><Button variant="ghost" size="sm"><ArrowLeft data-icon="inline-start" />Back to papers</Button></Link>
    <div className="mx-auto w-full max-w-xl"><PageHeader title="Create a paper" description="Start with a title. You can add questions and organize sections in the builder." /><Card className="mt-6"><CardHeader><CardTitle>Paper details</CardTitle><CardDescription>Metadata can be refined later from the workspace.</CardDescription></CardHeader><CardContent><form className="flex flex-col gap-5" onSubmit={submit}><div className="flex flex-col gap-2"><Label htmlFor="new-paper-title">Paper title</Label><Input id="new-paper-title" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Mid-term Physics Assessment" aria-invalid={Boolean(error)} />{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}</div><div className="flex items-center justify-end gap-2"><Link href="/papers"><Button type="button" variant="outline">Cancel</Button></Link><Button type="submit" disabled={creating}>{creating ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <FilePlus2 data-icon="inline-start" />}Create paper</Button></div></form></CardContent></Card></div>
  </PageContainer>
}

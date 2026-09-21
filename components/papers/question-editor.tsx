"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, LockKeyhole, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PaperSnapshot } from "@/lib/api/papers"

type EditableOption = { order_index: number; option_text: string }

type QuestionEditorProps = {
  open: boolean
  snapshot: PaperSnapshot
  editable?: boolean
  saving?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSave?: (value: { question_text: string; options?: EditableOption[] }) => void
}

export function QuestionEditor({ open, snapshot, editable = false, saving = false, error, onOpenChange, onSave }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(snapshot.question_text)
  const [options, setOptions] = useState<EditableOption[]>(snapshot.options?.map(({ order_index, option_text }) => ({ order_index, option_text })) ?? [])

  useEffect(() => {
    if (!open) return
    setQuestionText(snapshot.question_text)
    setOptions(snapshot.options?.map(({ order_index, option_text }) => ({ order_index, option_text })) ?? [])
  }, [open, snapshot])

  const dirty = questionText !== snapshot.question_text || options.some((option, index) => option.option_text !== snapshot.options?.[index]?.option_text)
  const previewOptions = useMemo(() => options.filter((option) => option.option_text.trim()), [options])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92svh,48rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>Structured editing keeps question text and answer choices together.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="question-editor-text">Question</Label>
              <Textarea id="question-editor-text" value={questionText} onChange={(event) => setQuestionText(event.target.value)} disabled={!editable || saving} className="min-h-32 resize-y leading-6" />
            </div>
            {options.length ? <fieldset className="flex flex-col gap-3"><legend className="text-sm font-medium">Options</legend>{options.map((option) => <div key={option.order_index} className="flex items-center gap-2"><span className="w-6 text-sm font-semibold text-muted-foreground">{String.fromCharCode(65 + option.order_index)}</span><Input aria-label={`Option ${String.fromCharCode(65 + option.order_index)}`} value={option.option_text} disabled={!editable || saving} onChange={(event) => setOptions((current) => current.map((item) => item.order_index === option.order_index ? { ...item, option_text: event.target.value } : item))} /></div>)}</fieldset> : null}
            {!editable ? <div className="flex items-start gap-2 rounded-md border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground"><LockKeyhole className="mt-0.5 shrink-0" />Bank questions are protected here. Premium editing will become available when the backend exposes permission and content-save support.</div> : null}
            {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          </div>
          <div className="flex flex-col gap-3 rounded-md border bg-muted/20 p-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p><p className="mt-1 text-xs text-muted-foreground">This is the paper-facing structure.</p></div>
            <div className="flex flex-col gap-3 text-sm leading-6"><p>{questionText}</p>{previewOptions.length ? <ol className="flex flex-col gap-2">{previewOptions.map((option) => <li key={option.order_index}><span className="mr-2 font-medium">{String.fromCharCode(65 + option.order_index)}.</span>{option.option_text}</li>)}</ol> : null}</div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}><X data-icon="inline-start" />Cancel</Button>{editable ? <Button disabled={!dirty || saving} onClick={() => onSave?.({ question_text: questionText, options: options.length ? options : undefined })}>{saving ? "Saving..." : <><Save data-icon="inline-start" />Save changes</>}</Button> : <Button variant="outline" onClick={() => onOpenChange(false)}><Check data-icon="inline-start" />Done</Button>}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Trash2, CirclePlus } from "lucide-react"
import { toast } from "sonner"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/patterns/status-badge"
import { ConfirmDialog } from "@/components/patterns/confirm-dialog"
import { mockRecentPapers } from "@/lib/mock-data"

export default function PapersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="My Papers"
        description="Every paper you've created, drafted, or exported."
        actions={
          <Button>
            <CirclePlus data-icon="inline-start" />
            New paper
          </Button>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>All papers</CardTitle>
          <CardDescription>{mockRecentPapers.length} total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="flex flex-col">
            {mockRecentPapers.map((paper, index) => (
              <li key={paper.id}>
                {index > 0 ? <Separator /> : null}
                <div className="flex items-center justify-between gap-4 px-6 py-3">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {paper.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {paper.subject} · {paper.grade} · {paper.questionCount}{" "}
                      questions · Updated {paper.updatedAt}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={paper.status} />
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${paper.title}`}
                        >
                          <Trash2 />
                        </Button>
                      }
                      title="Delete this paper?"
                      description={`"${paper.title}" will be permanently removed. This action can't be undone.`}
                      confirmLabel="Delete paper"
                      destructive
                      onConfirm={() =>
                        toast.success("Paper deleted", {
                          description: paper.title,
                        })
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

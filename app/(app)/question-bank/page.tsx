import { BookOpenText, Upload } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function QuestionBankPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Question Bank"
        description="Your school's shared library of reusable exam questions."
        actions={
          <>
            <Button variant="outline">
              <Upload data-icon="inline-start" />
              Import questions
            </Button>
            <Button>Add question</Button>
          </>
        }
      />

      <Empty className="min-h-96 flex-1 border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenText />
          </EmptyMedia>
          <EmptyTitle>No questions yet</EmptyTitle>
          <EmptyDescription>
            Import questions from a scanned paper or add them one by one to
            start building your shared bank.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload data-icon="inline-start" />
              Import questions
            </Button>
            <Button>Add question</Button>
          </div>
        </EmptyContent>
      </Empty>
    </PageContainer>
  )
}

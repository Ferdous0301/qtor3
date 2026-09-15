import { LayoutTemplate, CirclePlus } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTemplates } from "@/lib/mock-data"

export default function TemplatesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Templates"
        description="Reusable cover pages and layouts for new papers."
        actions={
          <Button>
            <CirclePlus data-icon="inline-start" />
            New template
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex aspect-4/3 items-center justify-center rounded-md bg-muted">
                <LayoutTemplate className="size-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.layout}</CardDescription>
              <Badge variant="secondary" className="w-fit">
                Used {template.usedCount} times
              </Badge>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Preview
              </Button>
              <Button size="sm" className="flex-1">
                Use template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}

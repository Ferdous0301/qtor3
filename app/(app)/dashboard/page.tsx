import Link from "next/link"
import { CirclePlus, BookOpenText, ArrowRight, CheckCircle2 } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/patterns/status-badge"
import {
  mockRecentPapers,
  mockTemplates,
  mockUser,
  trialStatus,
  exportEntitlements,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const firstName = mockUser.name.split(" ")[0]

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening across your papers, templates, and question bank."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardContent className="flex items-center gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CirclePlus className="size-5" />
            </span>
            <div className="flex flex-1 flex-col">
              <h3 className="text-sm font-medium">Create a paper</h3>
              <p className="text-sm text-muted-foreground">
                Start from a blank paper or a saved template
              </p>
            </div>
            <Button size="sm">
              New paper
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <BookOpenText className="size-5" />
            </span>
            <div className="flex flex-1 flex-col">
              <h3 className="text-sm font-medium">Browse question bank</h3>
              <p className="text-sm text-muted-foreground">
                Search and reuse questions from your shared library
              </p>
            </div>
            <Button size="sm" variant="outline">
              Browse
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent papers</CardTitle>
              <CardDescription>
                Papers you've recently created or edited
              </CardDescription>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/papers" />}
                >
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="flex flex-col">
                {mockRecentPapers.map((paper, index) => (
                  <li key={paper.id}>
                    {index > 0 ? <Separator /> : null}
                    <Link
                      href="/papers"
                      className="flex items-center justify-between gap-4 px-6 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="truncate text-sm font-medium">
                          {paper.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {paper.subject} · {paper.grade} · {paper.questionCount}{" "}
                          questions · {paper.updatedAt}
                        </span>
                      </div>
                      <StatusBadge status={paper.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved templates</CardTitle>
              <CardDescription>
                Reusable layouts for your next paper
              </CardDescription>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/templates" />}
                >
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {mockTemplates.map((template) => (
                <Link
                  key={template.id}
                  href="/templates"
                  className="flex flex-col gap-1 rounded-lg border border-border p-3 transition-colors hover:border-foreground/20 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="text-sm font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.layout}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Used {template.usedCount} times
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {trialStatus.planName}
              </CardTitle>
              <CardDescription>
                {trialStatus.daysRemaining} days remaining in your trial
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">Active</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {trialStatus.features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      {feature.name}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {feature.description}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Upgrade to Premium
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage summary</CardTitle>
              <CardDescription>Export entitlements by paper size</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {exportEntitlements.map((entitlement) => (
                <div key={entitlement.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{entitlement.size}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {entitlement.used} / {entitlement.limit} exports
                    </span>
                  </div>
                  <Progress
                    value={(entitlement.used / entitlement.limit) * 100}
                    className="w-full"
                    aria-label={`${entitlement.size} export usage`}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                nativeButton={false}
                render={<Link href="/usage" />}
              >
                View full usage details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

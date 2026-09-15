"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Info, TriangleAlert, CircleCheck, Trash2, Plus } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/shell/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/patterns/confirm-dialog"
import { ErrorState } from "@/components/patterns/error-state"
import { Separator } from "@/components/ui/separator"

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        title="Design system"
        description="Shared components and patterns used across Qtor. Reference only — nothing here is wired to real data."
      />

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Heading 1 — Source Serif 4
          </h1>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Heading 2 — Source Serif 4
          </h2>
          <h3 className="font-serif text-lg font-semibold">
            Heading 3 — Source Serif 4
          </h3>
          <p className="text-base leading-relaxed">
            Body text uses Inter at a comfortable line height for long-form
            reading, such as question stems and instructions.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Muted small text for secondary information, timestamps, and
            helper copy.
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
        </div>
      </Section>

      <Section title="Inputs, selects & dropdowns">
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ds-input">Paper title</FieldLabel>
              <Input id="ds-input" placeholder="Mid-term assessment" />
              <FieldDescription>Shown on the cover page.</FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field data-invalid>
              <FieldLabel htmlFor="ds-input-error">Total marks</FieldLabel>
              <Input id="ds-input-error" aria-invalid defaultValue="abc" />
              <FieldDescription>Enter a valid number.</FieldDescription>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="ds-select">Paper size</FieldLabel>
            <Select defaultValue="a4">
              <SelectTrigger id="ds-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Row actions</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "outline" })}
              >
                Actions
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Paper</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Section>

      <Section title="Cards & tabs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Supporting description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content area for details, lists, or actions.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">Tab one</TabsTrigger>
              <TabsTrigger value="two">Tab two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <p className="text-sm text-muted-foreground">
                Content for the first tab.
              </p>
            </TabsContent>
            <TabsContent value="two">
              <p className="text-sm text-muted-foreground">
                Content for the second tab.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      <Section title="Dialogs, sheets & confirmation">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger className={buttonVariants({ variant: "outline" })}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export paper</DialogTitle>
                <DialogDescription>
                  Choose a format to export this paper as.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Export</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "outline" })}>
              Open sheet
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Paper details</SheetTitle>
                <SheetDescription>
                  Review paper metadata before exporting.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button className="w-full">Close</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <ConfirmDialog
            trigger={<Button variant="destructive">Delete item</Button>}
            title="Delete this item?"
            description="This action can't be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => toast.success("Deleted")}
          />
        </div>
      </Section>

      <Section title="Tooltips & toasts">
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger className={buttonVariants({ variant: "outline" })}>
              Hover me
            </TooltipTrigger>
            <TooltipContent>Helpful context on hover</TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            onClick={() =>
              toast("Paper saved", { description: "Draft saved automatically" })
            }
          >
            Show toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Export failed", { description: "Try again shortly" })
            }
          >
            Show error toast
          </Button>
        </div>
      </Section>

      <Section title="Alerts">
        <div className="flex flex-col gap-3">
          <Alert>
            <Info />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              This is a neutral informational alert.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Action required</AlertTitle>
            <AlertDescription>
              Something needs your attention before you continue.
            </AlertDescription>
          </Alert>
          <Alert className="border-primary/30 bg-primary/5 text-foreground [&>svg]:text-primary">
            <CircleCheck />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Skeleton loaders">
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setLoading((v) => !v)}
          >
            Toggle loading state
          </Button>
          {loading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-medium">
                AS
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Content loaded</span>
                <span className="text-xs text-muted-foreground">
                  This is the resolved state
                </span>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Empty & error states">
        <div className="grid gap-4 sm:grid-cols-2">
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Info />
              </EmptyMedia>
              <EmptyTitle>No results</EmptyTitle>
              <EmptyDescription>
                Try adjusting your filters or search terms.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>

          <ErrorState onRetry={() => toast("Retrying…")} />
        </div>
      </Section>

      <Separator />
    </PageContainer>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

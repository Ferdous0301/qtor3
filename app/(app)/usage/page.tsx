import { PageContainer, PageHeader } from "@/components/shell/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { TriangleAlert } from "lucide-react"
import { exportEntitlements, trialStatus } from "@/lib/mock-data"

export default function UsagePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Usage"
        description="Track your export entitlements for the current billing period."
      />

      <Alert>
        <TriangleAlert />
        <AlertTitle>Your trial ends in {trialStatus.daysRemaining} days</AlertTitle>
        <AlertDescription>
          Upgrade to Premium to keep unlimited access to the question bank,
          OCR import, and high-resolution exports.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Export entitlements</CardTitle>
          <CardDescription>
            Exports remaining this billing period, by paper size
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {exportEntitlements.map((entitlement) => (
            <Progress
              key={entitlement.id}
              value={(entitlement.used / entitlement.limit) * 100}
              className="w-full"
            >
              <ProgressLabel>{entitlement.size} paper</ProgressLabel>
              <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                {entitlement.used} / {entitlement.limit} exports used
              </span>
            </Progress>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline">Upgrade to Premium</Button>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}

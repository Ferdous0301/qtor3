import { Circle, CircleCheck, CircleDot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PaperStatus } from "@/lib/mock-data"

const statusConfig: Record<
  PaperStatus,
  { label: string; icon: typeof Circle; variant: "secondary" | "outline" | "default" }
> = {
  draft: { label: "Draft", icon: CircleDot, variant: "secondary" },
  ready: { label: "Ready to export", icon: Circle, variant: "outline" },
  exported: { label: "Exported", icon: CircleCheck, variant: "default" },
}

export function StatusBadge({ status }: { status: PaperStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon data-icon="inline-start" />
      {config.label}
    </Badge>
  )
}

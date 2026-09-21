import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  BookOpenText,
  Camera,
  FileText,
  LayoutTemplate,
  Gauge,
  Settings,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export const primaryNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your papers, templates, and usage",
  },
  {
    title: "Question Bank",
    href: "/question-bank",
    icon: BookOpenText,
    description: "Browse and manage your shared question library",
  },
  {
    title: "Photo to question",
    href: "/photo-to-question",
    icon: Camera,
    description: "Turn question photos into reviewable content",
  },
  {
    title: "My Papers",
    href: "/papers",
    icon: FileText,
    description: "Every paper you've created, drafted, or exported",
  },
  {
    title: "Templates",
    href: "/templates",
    icon: LayoutTemplate,
    description: "Reusable layouts and cover pages for new papers",
  },
  {
    title: "Usage",
    href: "/usage",
    icon: Gauge,
    description: "Export entitlements and plan consumption",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Profile, account, and workspace preferences",
  },
]

// Shown as primary destinations in the mobile bottom bar. The remaining
// items are reachable through the "More" sheet.
export const mobilePrimaryNav = primaryNav.slice(0, 4)
export const mobileOverflowNav = primaryNav.slice(4)

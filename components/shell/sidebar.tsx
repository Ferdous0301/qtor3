"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileSignature, ShieldCheck } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"
import { primaryNav } from "@/lib/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const navItems = user?.roles?.includes("admin") ? [...primaryNav, { title: "Admin", href: "/admin", icon: ShieldCheck, description: "Operational administration" }] : primaryNav

  return (
    <aside
      className="hidden shrink-0 flex-col border-r border-border bg-sidebar lg:flex lg:w-56"
      aria-label="Primary"
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileSignature className="size-4" />
          </span>
          <span className="font-serif text-[1.05rem] font-semibold tracking-tight text-sidebar-foreground">
            Qtor
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive
                        ? "border-primary bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                    )}
                  />
                }
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/50"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </TooltipTrigger>
              <TooltipContent side="right">{item.description}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

    </aside>
  )
}

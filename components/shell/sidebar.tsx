"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileSignature } from "lucide-react"
import { cn } from "@/lib/utils"
import { primaryNav } from "@/lib/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()

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
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0b4167] via-[#087b9c] to-[#13c8e1] text-primary-foreground shadow-sm shadow-cyan-900/20 transition-transform duration-200 group-hover:rotate-[-4deg] group-hover:scale-105">
            <FileSignature className="size-4" />
          </span>
          <span className="font-serif text-[1.05rem] font-semibold tracking-tight text-sidebar-foreground">
            Qtor
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {primaryNav.map((item) => {
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

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, Search, LogOut, Settings, UserRound, Languages } from "lucide-react"
import { primaryNav } from "@/lib/navigation"
import { mockUser } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

export function Header() {
  const pathname = usePathname()
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const current = primaryNav.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  useEffect(() => {
    const stored = window.localStorage.getItem("qtor-language")
    if (stored === "bn" || stored === "en") setLanguage(stored)
    const sync = () => setLanguage(window.localStorage.getItem("qtor-language") === "bn" ? "bn" : "en")
    window.addEventListener("qtor-language-change", sync)
    return () => window.removeEventListener("qtor-language-change", sync)
  }, [])

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en"
    setLanguage(next)
    window.localStorage.setItem("qtor-language", next)
    window.dispatchEvent(new Event("qtor-language-change"))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <h2 className="hidden shrink-0 text-sm font-medium text-foreground lg:block">
        {current?.title ?? "Qtor"}
      </h2>

      <Separator orientation="vertical" className="hidden h-5 lg:block" />

      <div className="relative hidden w-full max-w-sm sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search papers, questions, templates…"
          aria-label="Search"
          className="pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-full border-primary/20 bg-primary/[0.04] px-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/10"
          onClick={toggleLanguage}
          aria-label="Switch language"
        >
          <Languages data-icon="inline-start" />
          <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
          <span className="text-muted-foreground">/</span>
          <span className={language === "bn" ? "text-primary" : "text-muted-foreground"}>বাংলা</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Notifications" />
            }
          >
            <Bell />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Empty className="p-4">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell />
                </EmptyMedia>
                <EmptyTitle>You&apos;re all caught up</EmptyTitle>
                <EmptyDescription>
                  New activity on your papers and question bank will show up
                  here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-8 gap-2 rounded-full px-1 pr-2.5"
                aria-label="Account menu"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>{mockUser.initials}</AvatarFallback>
            </Avatar>
            <Badge
              variant="secondary"
              className="hidden text-xs font-normal sm:inline-flex"
            >
              Trial
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{mockUser.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {mockUser.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <UserRound />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

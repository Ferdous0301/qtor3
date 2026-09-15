"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, LogOut, Settings, UserRound } from "lucide-react"
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
  const current = primaryNav.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 supports-backdrop-filter:backdrop-blur-sm sm:px-6 lg:px-8">
      <h2 className="hidden shrink-0 text-sm font-medium text-foreground lg:block">
        {current?.title ?? "Qtor"}
      </h2>

      <Separator orientation="vertical" className="hidden h-5 lg:block" />

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search papers, questions, templates…"
          aria-label="Search"
          className="pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
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

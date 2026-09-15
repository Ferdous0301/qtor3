import type { ReactNode } from "react"
import { Sidebar } from "@/components/shell/sidebar"
import { Header } from "@/components/shell/header"
import { BottomNav } from "@/components/shell/bottom-nav"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full bg-background">
      <Sidebar />
      <div className="flex min-h-svh flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col pb-20 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}

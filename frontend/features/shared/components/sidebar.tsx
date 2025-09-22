"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  BarChart2,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Home,
  Menu,
  Settings,
  Users,
  DollarSign,
  Wallet,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import path from "path"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: ClipboardList,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: BarChart3,
    },
    {
      name: "People",
      path: "/pessoas",
      icon: Users,
    },

    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: "Indicators",
      path: "/Indicadores",
      icon: BarChart2,
    },
    {
      name: "Budget Categories",
      path: "/rubricas",
      icon: DollarSign,
    },
    {
      name: "Budgets",
      path: "/orcamentos",
      icon: Wallet,
    },
    {
      name: "Allocations",
      path: "/afetacoes",
      icon: UserCheck,
    },
    {
      name: "Deliverables",
      path: "/entregaveis",
      icon: ClipboardList,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={() => setOpen(!open)}>
        <Menu className="h-5 w-5" />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-xl">
            <ClipboardList className="h-6 w-6" />
            <span>ProjectHub</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:flex hidden" onClick={() => setOpen(!open)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.path
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

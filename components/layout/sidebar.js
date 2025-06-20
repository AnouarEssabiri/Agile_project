"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Kanban,
  Users,
  GitBranch,
  FolderOpen,
  User,
  MessageCircle,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "Assignments", href: "/assignments" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Kanban, label: "Kanban Board", href: "/kanbanboard" },
  { icon: GitBranch, label: "Scrum Board", href: "/scrumboard" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: GitBranch, label: "Workflow", href: "/workflow" },
  { icon: FolderOpen, label: "Projects", href: "/projectboard" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold text-gray-900 dark:text-white">ProjectHub</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Bell, Moon, Sun, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuUserInfo,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { mockNotifications } from "@/lib/mock-data"

export default function Header({ collapsed }) {
  const [darkMode, setDarkMode] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 right-0 ${collapsed ? "left-16" : "left-64"} z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-2 shadow-sm flex items-center justify-between h-16 transition-all duration-300`}
      style={{ minHeight: 64 }}
    >
      {/* Left: Search */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative w-full max-w-xs md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects, tasks, or people..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 md:space-x-4 ml-4">
        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          onClick={() => router.push("/notifications")}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 text-white border-2 border-white dark:border-gray-900 shadow">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* User dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-9 w-9 rounded-full border-2 border-blue-500 shadow-sm object-cover"
                />
                <span className="font-medium max-w-[100px] truncate hidden md:inline-block">{user.name}</span>
                <ChevronDown className="h-4 w-4 hidden md:inline-block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-2">
              <DropdownMenuUserInfo avatar={user.avatar} name={user.name} email={user.email} />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}> <User className="mr-2 h-5 w-5" /> Profile </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}> <Settings className="mr-2 h-5 w-5" /> Settings </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}> <LogOut className="mr-2 h-5 w-5" /> Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.header>
  )
}

"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Sidebar from "./sidebar"
import Header from "./header"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { loading } = useAuth()

  // Pages that don't need the dashboard layout
  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(pathname)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // For public pages (login/register), render without dashboard layout
  if (isPublicPage) {
    return children
  }

  // For authenticated pages, render with dashboard layout and protection
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Header collapsed={collapsed} />
        <main className={`${collapsed ? "ml-16" : "ml-64"} pt-20 p-6 transition-all duration-300`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Sidebar from "./sidebar"
import Header from "./header"
import { getCurrentUser } from "@/lib/auth"

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Pages that don't need the dashboard layout
  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser && !isPublicPage) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
    setLoading(false)
  }, [router, isPublicPage])

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

  // For authenticated pages, render with dashboard layout
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
} 
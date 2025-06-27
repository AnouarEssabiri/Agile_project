"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, User, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockNotifications = [
  {
    id: 1,
    type: "mention",
    title: "You were mentioned in a comment",
    description: "Alice Johnson mentioned you in Project Alpha.",
    time: "2m ago",
    icon: MessageCircle,
    read: false,
  },
  {
    id: 2,
    type: "assignment",
    title: "New task assigned",
    description: "You have been assigned to 'Design Sprint Planning'.",
    time: "10m ago",
    icon: CheckCircle,
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Deadline approaching",
    description: "The deadline for 'Release v1.2' is tomorrow.",
    time: "1h ago",
    icon: AlertTriangle,
    read: true,
  },
  {
    id: 4,
    type: "project",
    title: "Project updated",
    description: "Project Beta status changed to 'In Review'.",
    time: "3h ago",
    icon: Bell,
    read: true,
  },
  {
    id: 5,
    type: "team",
    title: "New team member",
    description: "Bob Williams joined your team.",
    time: "Yesterday",
    icon: User,
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay up to date with your workspace activity.</p>
          </div>
          <Button onClick={markAllAsRead} variant="outline" disabled={notifications.every(n => n.read)}>
            Mark all as read
          </Button>
        </div>
      </motion.div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">No notifications</CardContent>
          </Card>
        ) : (
          notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`flex items-center gap-4 p-4 ${!n.read ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex-shrink-0">
                  <n.icon className={`h-8 w-8 ${!n.read ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{n.title}</span>
                    {!n.read && <Badge className="bg-blue-500 text-white">New</Badge>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{n.description}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{n.time}</div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
} 
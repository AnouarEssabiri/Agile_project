"use client"

import { motion } from "framer-motion"
import { Calendar, MessageCircle, Paperclip, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const priorityColors = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const statusColors = {
  "To Do": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "In Review": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function TaskCard({ task, onClick, isDragging = false }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${isDragging ? "rotate-3 scale-105" : ""}`}
      onClick={onClick}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
            <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className={statusColors[task.status]}>
              {task.status}
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {task.comments > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

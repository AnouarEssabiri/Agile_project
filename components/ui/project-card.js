"use client"

import { motion } from "framer-motion"
import { Calendar, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const statusColors = {
  Planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "On Hold": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const priorityColors = {
  High: "border-red-500",
  Medium: "border-yellow-500",
  Low: "border-green-500",
}

export default function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={`hover:shadow-lg transition-shadow border-l-4 ${priorityColors[project.priority]}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge className={statusColors[project.status]}>{project.status}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{project.team.length} members</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

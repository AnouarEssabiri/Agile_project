"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal } from "lucide-react"
import TaskCard from "@/components/ui/task-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockTasks } from "@/lib/mock-data"

const columns = [
  { id: "To Do", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "In Review", title: "In Review", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "Done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
]

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(mockTasks)
  const [draggedTask, setDraggedTask] = useState(null)

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== columnId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === draggedTask.id ? { ...task, status: columnId } : task)),
      )
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <p className="text-gray-600 dark:text-gray-400">Drag and drop tasks to update their status</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
            className="flex flex-col h-full"
          >
            <Card className="flex-1 flex flex-col">
              <CardHeader className={`${column.color} rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                      {getTasksByStatus(column.id).length}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Add Task</DropdownMenuItem>
                        <DropdownMenuItem>Clear Column</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className="flex-1 p-4 space-y-3 overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task, taskIndex) => (
                  <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task)} className="cursor-move">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: taskIndex * 0.05 }}
                    >
                      <TaskCard task={task} isDragging={draggedTask?.id === task.id} />
                    </motion.div>
                  </div>
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
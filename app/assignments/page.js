"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, SortAsc } from "lucide-react"
import TaskCard from "@/components/ui/task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockTasks } from "@/lib/mock-data"

const filterOptions = {
  status: ["All", "To Do", "In Progress", "In Review", "Done"],
  priority: ["All", "High", "Medium", "Low"],
  assignee: ["All", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
}

export default function Assignments() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    assignee: "All",
  })
  const [sortBy, setSortBy] = useState("dueDate")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.status === "All" || task.status === filters.status
    const matchesPriority = filters.priority === "All" || task.priority === filters.priority
    const matchesAssignee = filters.assignee === "All" || task.assignee === filters.assignee

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate)
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "To Do").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all your tasks</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Task title" />
              <Input placeholder="Description" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{taskStats.todo}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{taskStats.inProgress}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border"
      >
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.status.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.priority.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Tasks Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </motion.div>

      {sortedTasks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">No tasks found matching your criteria</div>
        </motion.div>
      )}
    </div>
  )
} 
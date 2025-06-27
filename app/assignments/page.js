"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, SortAsc, Check } from "lucide-react"
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

const statusOptions = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
const assigneeOptions = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"];

export default function Assignments() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    assignee: "All",
  })
  const [sortBy, setSortBy] = useState("dueDate")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "Backlog",
    assignee: assigneeOptions[0],
    project: "",
    dueDate: "",
    tags: "",
    comments: 0,
    attachments: 0,
    storyPoints: 1,
  })

  const handleNewTaskChange = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    setTasks([
      {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority.charAt(0).toUpperCase() + newTask.priority.slice(1),
        status: newTask.status,
        assignee: newTask.assignee,
        project: newTask.project,
        dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
        tags: newTask.tags.split(",").map(t => t.trim()).filter(Boolean),
        comments: Number(newTask.comments) || 0,
        attachments: Number(newTask.attachments) || 0,
        storyPoints: Number(newTask.storyPoints) || 1,
      },
      ...tasks,
    ])
    setShowAddForm(false)
    setNewTask({
      title: "",
      description: "",
      priority: "High",
      status: "Backlog",
      assignee: assigneeOptions[0],
      project: "",
      dueDate: "",
      tags: "",
      comments: 0,
      attachments: 0,
      storyPoints: 1,
    })
  }

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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-base transition-all" onClick={() => setShowAddForm(true)}>
          New Task
          <Plus className="h-5 w-5 ml-2" />
        </Button>
      </motion.div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border mb-6 space-y-4 shadow"
          onSubmit={handleAddTask}
        >
          <h2 className="text-xl font-bold mb-2">Add New Task</h2>
          <Input placeholder="Task title" value={newTask.title} onChange={e => handleNewTaskChange("title", e.target.value)} />
          <Input placeholder="Description" value={newTask.description} onChange={e => handleNewTaskChange("description", e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={newTask.priority.toLowerCase()} onValueChange={val => handleNewTaskChange("priority", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newTask.status} onValueChange={val => handleNewTaskChange("status", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={newTask.assignee} onValueChange={val => handleNewTaskChange("assignee", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Project" value={newTask.project} onChange={e => handleNewTaskChange("project", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" value={newTask.dueDate} onChange={e => handleNewTaskChange("dueDate", e.target.value)} />
            <Input placeholder="Tags (comma separated)" value={newTask.tags} onChange={e => handleNewTaskChange("tags", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="number" min={0} placeholder="Comments" value={newTask.comments} onChange={e => handleNewTaskChange("comments", e.target.value)} />
            <Input type="number" min={0} placeholder="Attachments" value={newTask.attachments} onChange={e => handleNewTaskChange("attachments", e.target.value)} />
            <Input type="number" min={1} placeholder="Story Points" value={newTask.storyPoints} onChange={e => handleNewTaskChange("storyPoints", e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 text-base transition-all" disabled={!newTask.title.trim()}>
              <Check className="h-5 w-5 mr-1" />
              Create Task
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </motion.form>
      )}

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
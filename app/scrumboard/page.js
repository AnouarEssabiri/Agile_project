"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Play, Pause, Target, Users, Calendar, TrendingDown } from "lucide-react"
import TaskCard from "@/components/ui/task-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockTasks, mockTeamMembers } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Scrum-specific columns
const scrumColumns = [
  { 
    id: "Backlog", 
    title: "Product Backlog", 
    color: "bg-gray-100 dark:bg-gray-800",
    description: "Features and stories to be planned"
  },
  { 
    id: "Sprint Backlog", 
    title: "Sprint Backlog", 
    color: "bg-blue-100 dark:bg-blue-900",
    description: "Stories committed to current sprint"
  },
  { 
    id: "In Progress", 
    title: "In Progress", 
    color: "bg-yellow-100 dark:bg-yellow-900",
    description: "Currently being worked on"
  },
  { 
    id: "Review", 
    title: "Review", 
    color: "bg-purple-100 dark:bg-purple-900",
    description: "Ready for review and testing"
  },
  { 
    id: "Done", 
    title: "Done", 
    color: "bg-green-100 dark:bg-green-900",
    description: "Completed and ready for demo"
  },
]

// Mock sprint data
const currentSprint = {
  id: 1,
  name: "Sprint 3",
  startDate: "2024-01-22",
  endDate: "2024-02-05",
  totalStoryPoints: 45,
  completedStoryPoints: 28,
  teamMembers: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
  velocity: 15, // story points per day
  burndownData: [
    { day: 1, remaining: 45 },
    { day: 2, remaining: 40 },
    { day: 3, remaining: 35 },
    { day: 4, remaining: 30 },
    { day: 5, remaining: 28 },
  ]
}

export default function ScrumBoard() {
  const [tasks, setTasks] = useState(mockTasks)
  const [draggedTask, setDraggedTask] = useState(null)
  const [sprintStatus, setSprintStatus] = useState("active") // active, paused, completed
  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium",
    storyPoints: 3,
  })
  const [targetColumn, setTargetColumn] = useState("Backlog")

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

  const getTotalStoryPoints = (status) => {
    return getTasksByStatus(status).reduce((total, task) => total + (task.storyPoints || 0), 0)
  }

  const getSprintProgress = () => {
    const totalPoints = currentSprint.totalStoryPoints
    const completedPoints = currentSprint.completedStoryPoints
    return Math.round((completedPoints / totalPoints) * 100)
  }

  const getRemainingDays = () => {
    const endDate = new Date(currentSprint.endDate)
    const today = new Date()
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const openAddStoryDialog = (columnId) => {
    setTargetColumn(columnId)
    setIsAddStoryDialogOpen(true)
  }

  const handleAddNewStory = (e) => {
    e.preventDefault()
    if (!newStory.title) return

    const newTask = {
      ...newStory,
      id: Date.now(),
      status: targetColumn,
      project: "New Project",
      comments: 0,
      attachments: 0,
      tags: [],
      dueDate: new Date().toISOString().split("T")[0],
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
    setIsAddStoryDialogOpen(false)
    setNewStory({
      title: "",
      description: "",
      assignee: "",
      priority: "Medium",
      storyPoints: 3,
    })
  }

  const handleNewStoryChange = (field, value) => {
    setNewStory((prev) => ({ ...prev, [field]: value }))
  }

  const handleMoveAll = (fromColumn, toColumn) => {
    if (!toColumn) return
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.status === fromColumn) {
          return { ...task, status: toColumn }
        }
        return task
      })
    })
  }

  const handleClearColumn = (columnId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.status !== columnId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Scrum Board</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sprint planning and task management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Calendar className="h-4 w-4 mr-2" />
            Sprint Planning
          </Button>
          <Button onClick={() => openAddStoryDialog("Backlog")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        </div>
      </motion.div>

      {/* Sprint Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-lg font-bold">{currentSprint.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getRemainingDays()} days remaining
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-lg font-bold">{currentSprint.completedStoryPoints}/{currentSprint.totalStoryPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Story Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <div className="text-lg font-bold">{currentSprint.teamMembers.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                {sprintStatus === "active" ? (
                  <Play className="h-3 w-3 text-yellow-600" />
                ) : (
                  <Pause className="h-3 w-3 text-yellow-600" />
                )}
              </div>
              <div>
                <div className="text-lg font-bold capitalize">{sprintStatus}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sprint Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sprint Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5" />
              <span>Sprint Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm text-gray-600">{getSprintProgress()}%</span>
              </div>
              <Progress value={getSprintProgress()} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">{new Date(currentSprint.startDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-2 font-medium">{new Date(currentSprint.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{currentSprint.velocity}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Story Points/Day</div>
              <div className="mt-4 text-xs text-gray-500">
                Based on previous sprints
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scrum Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-x-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-[800px] lg:min-w-0 h-[calc(100vh-400px)]">
          {scrumColumns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="flex flex-col h-full"
            >
              <Card className="flex-1 flex flex-col">
                <CardHeader className={`${column.color} rounded-t-lg`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => openAddStoryDialog(column.id)}>Add Story</DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleMoveAll(column.id, scrumColumns[columnIndex + 1]?.id)}
                            disabled={!scrumColumns[columnIndex + 1]}
                          >
                            Move All to Next
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onSelect={() => handleClearColumn(column.id)}>
                            Clear Column
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 hidden sm:block">{column.description}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getTasksByStatus(column.id).length} ({getTotalStoryPoints(column.id)} SP)
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className="flex-1 p-3 space-y-2 overflow-y-auto"
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
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border hover:shadow-md transition-shadow">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {task.storyPoints || 3} SP
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{task.assignee}</span>
                              <span className="text-gray-500">{task.priority}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Dialog open={isAddStoryDialogOpen} onOpenChange={setIsAddStoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Story to {targetColumn}</DialogTitle>
            <DialogDescription>
              Fill in the details for the new story. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNewStory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newStory.title}
                  onChange={(e) => handleNewStoryChange("title", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newStory.description}
                  onChange={(e) => handleNewStoryChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className="text-right">
                  Assignee
                </Label>
                <Select onValueChange={(value) => handleNewStoryChange("assignee", value)} value={newStory.assignee}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) => handleNewStoryChange("priority", value)}
                  defaultValue={newStory.priority}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="storyPoints" className="text-right">
                  Story Points
                </Label>
                <Input
                  id="storyPoints"
                  type="number"
                  value={newStory.storyPoints}
                  onChange={(e) => handleNewStoryChange("storyPoints", parseInt(e.target.value, 10))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Story</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
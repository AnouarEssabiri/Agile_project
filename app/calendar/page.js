"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Utility functions
const generateId = () => Date.now() + Math.random()
const formatDate = (date) => date.toISOString().split('T')[0]

// Initial mock data
const initialEvents = [
  {
    id: 1,
    title: "Team Standup",
    description: "Daily team synchronization meeting",
    date: "2024-01-15",
    time: "09:00",
    type: "meeting",
    duration: 30,
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "Final submission for Q1 project",
    date: "2024-01-20",
    time: "17:00",
    type: "deadline",
    duration: 0,
  },
  {
    id: 3,
    title: "Code Review",
    description: "Review pull request #123",
    date: "2024-01-18",
    time: "14:00",
    type: "review",
    duration: 60,
  },
]

const initialTasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    description: "Create wireframes and mockups for the new homepage design",
    status: "In Progress",
    priority: "High",
    assignee: "Jane Smith",
    project: "Website Redesign",
    dueDate: "2024-01-25",
    tags: ["Design", "UI/UX"],
    comments: 3,
    attachments: 2,
    storyPoints: 8,
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "To Do",
    priority: "High",
    assignee: "John Doe",
    project: "Mobile App",
    dueDate: "2024-01-30",
    tags: ["Backend", "Security"],
    comments: 1,
    attachments: 0,
    storyPoints: 13,
  },
]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const eventTypes = [
  { value: "meeting", label: "Meeting", color: "bg-blue-500" },
  { value: "deadline", label: "Deadline", color: "bg-red-500" },
  { value: "review", label: "Review", color: "bg-purple-500" },
]

const priorityOptions = ["Low", "Medium", "High"]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [events, setEvents] = useState([])
  const [tasks, setTasks] = useState([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [filter, setFilter] = useState("all")

  // Form states
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "meeting",
    duration: 30,
  })

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignee: "John Doe",
    project: "",
    tags: "",
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents')
    const savedTasks = localStorage.getItem('calendarTasks')
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      setEvents(initialEvents)
      localStorage.setItem('calendarEvents', JSON.stringify(initialEvents))
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(initialTasks)
      localStorage.setItem('calendarTasks', JSON.stringify(initialTasks))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('calendarTasks', JSON.stringify(tasks))
  }, [tasks])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1))
  }

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date)
    return events.filter((event) => event.date === dateStr)
  }

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date)
    return tasks.filter((task) => task.dueDate === dateStr)
  }

  const handleAddEvent = () => {
    if (!eventForm.title.trim() || !eventForm.date) return

    const newEvent = {
      id: generateId(),
      ...eventForm,
      date: eventForm.date,
    }

    setEvents([...events, newEvent])
    setShowEventModal(false)
    resetEventForm()
  }

  const handleEditEvent = () => {
    if (!eventForm.title.trim() || !eventForm.date) return

    const updatedEvents = events.map(event =>
      event.id === editingEvent.id ? { ...event, ...eventForm } : event
    )
    setEvents(updatedEvents)
    setShowEventModal(false)
    setEditingEvent(null)
    resetEventForm()
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  const handleAddTask = () => {
    if (!taskForm.title.trim() || !taskForm.dueDate) return

    const newTask = {
      id: generateId(),
      ...taskForm,
      status: "To Do",
      comments: 0,
      attachments: 0,
      storyPoints: 1,
      tags: taskForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    setTasks([...tasks, newTask])
    setShowTaskModal(false)
    resetTaskForm()
  }

  const handleEditTask = () => {
    if (!taskForm.title.trim() || !taskForm.dueDate) return

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? { ...task, ...taskForm } : task
    )
    setTasks(updatedTasks)
    setShowTaskModal(false)
    setEditingTask(null)
    resetTaskForm()
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: selectedDate || formatDate(new Date()),
      time: "",
      type: "meeting",
      duration: 30,
    })
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: selectedDate || formatDate(new Date()),
      assignee: "John Doe",
      project: "",
      tags: "",
    })
  }

  const openEventModal = (event = null, date = null) => {
    if (event) {
      setEditingEvent(event)
      setEventForm({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        type: event.type,
        duration: event.duration,
      })
    } else {
      setEditingEvent(null)
      setEventForm({
        title: "",
        description: "",
        date: date || formatDate(new Date()),
        time: "",
        type: "meeting",
        duration: 30,
      })
    }
    setShowEventModal(true)
  }

  const openTaskModal = (task = null, date = null) => {
    if (task) {
      setEditingTask(task)
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
        project: task.project,
        tags: task.tags.join(', '),
      })
    } else {
      setEditingTask(null)
      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: date || formatDate(new Date()),
        assignee: "John Doe",
        project: "",
        tags: "",
      })
    }
    setShowTaskModal(true)
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        />
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)
      const events = getEventsForDate(date)
      const tasks = getTasksForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`h-32 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
            isToday ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="flex items-center justify-between mb-1">
            <div
              className={`text-sm font-medium ${
                isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
              }`}
            >
              {day}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  openEventModal(null, dateStr)
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  openTaskModal(null, dateStr)
                }}
              >
                📋
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer group relative ${
                  event.type === "meeting"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : event.type === "deadline"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  openEventModal(event)
                }}
              >
                {event.title}
                <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEvent(event.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {tasks.slice(0, 1).map((task) => (
              <div
                key={task.id}
                className="text-xs p-1 rounded truncate cursor-pointer group relative bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                onClick={(e) => {
                  e.stopPropagation()
                  openTaskModal(task)
                }}
              >
                📋 {task.title}
                <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTask(task.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {events.length + tasks.length > 3 && (
              <div className="text-xs text-gray-500">+{events.length + tasks.length - 3} more</div>
            )}
          </div>
        </motion.div>
      )
    }

    return days
  }

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.type === filter)

  const filteredTasks = tasks.filter(task => task.dueDate)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">View tasks and events in calendar format</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setView(view === "month" ? "week" : "month")}>
            {view === "month" ? "Week View" : "Month View"}
          </Button>
          <Button onClick={() => openEventModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button onClick={() => openTaskModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>
                {months[month]} {year}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0 mb-4">
            {weekdays.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 dark:text-gray-400 border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">{renderCalendarDays()}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredEvents.length > 0 ? (
              filteredEvents
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 group">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.type === "meeting"
                          ? "bg-blue-500"
                          : event.type === "deadline"
                            ? "bg-red-500"
                            : "bg-purple-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEventModal(event)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-500 py-4">No upcoming events</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks
                .filter(task => new Date(task.dueDate) >= new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 group">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openTaskModal(task)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-500 py-4">No upcoming tasks</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm">Meetings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-sm">Deadlines</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-sm">Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-sm">Task Deadlines</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update event details" : "Create a new calendar event"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-type">Type</Label>
                <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-duration">Duration (minutes)</Label>
                <Input
                  id="event-duration"
                  type="number"
                  value={eventForm.duration}
                  onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingEvent ? handleEditEvent : handleAddEvent}
                disabled={!eventForm.title.trim() || !eventForm.date}
                className="flex-1"
              >
                {editingEvent ? "Update Event" : "Add Event"}
              </Button>
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update task details" : "Create a new task with deadline"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-assignee">Assignee</Label>
                <Input
                  id="task-assignee"
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  placeholder="Assignee name"
                />
              </div>
              <div>
                <Label htmlFor="task-project">Project</Label>
                <Input
                  id="task-project"
                  value={taskForm.project}
                  onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                  placeholder="Project name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="task-tags">Tags (comma separated)</Label>
              <Input
                id="task-tags"
                value={taskForm.tags}
                onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                placeholder="Design, UI/UX, Frontend"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingTask ? handleEditTask : handleAddTask}
                disabled={!taskForm.title.trim() || !taskForm.dueDate}
                className="flex-1"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
              <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
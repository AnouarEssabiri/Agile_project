"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCalendarEvents, mockTasks } from "@/lib/mock-data"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month") // month, week

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
    const dateStr = date.toISOString().split("T")[0]
    return mockCalendarEvents.filter((event) => event.date === dateStr)
  }

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return mockTasks.filter((task) => task.dueDate === dateStr)
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        />,
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const events = getEventsForDate(date)
      const tasks = getTasksForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`h-32 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            isToday ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${
                  event.type === "meeting"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : event.type === "deadline"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                }`}
              >
                {event.title}
              </div>
            ))}
            {tasks.slice(0, 1).map((task) => (
              <div
                key={task.id}
                className="text-xs p-1 rounded truncate bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              >
                📋 {task.title}
              </div>
            ))}
            {events.length + tasks.length > 3 && (
              <div className="text-xs text-gray-500">+{events.length + tasks.length - 3} more</div>
            )}
          </div>
        </motion.div>,
      )
    }

    return days
  }

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
          <Button variant="outline" size="sm" onClick={() => setView(view === "month" ? "week" : "month")}>
            {view === "month" ? "Week View" : "Month View"}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
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
            {mockCalendarEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
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
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTasks
              .filter((task) => task.dueDate)
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
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
    </div>
  )
} 
"use client"

import { motion } from "framer-motion"
import { CheckSquare, Clock, Users, TrendingUp, Calendar, AlertCircle, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import TaskCard from "@/components/ui/task-card"
import { mockTasks, mockProjects } from "@/lib/mock-data"

const stats = [
  {
    title: "Total Tasks",
    value: "24",
    change: "+12%",
    icon: CheckSquare,
    color: "text-blue-600",
  },
  {
    title: "In Progress",
    value: "8",
    change: "+5%",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    title: "Team Members",
    value: "12",
    change: "+2",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+3%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Task completed",
    description: "Design homepage mockup",
    user: "Jane Smith",
    time: "2 hours ago",
    type: "completed",
  },
  {
    id: 2,
    action: "New task assigned",
    description: "Implement user authentication",
    user: "John Doe",
    time: "4 hours ago",
    type: "assigned",
  },
  {
    id: 3,
    action: "Project updated",
    description: "Website Redesign progress updated to 65%",
    user: "Mike Johnson",
    time: "6 hours ago",
    type: "updated",
  },
]

export default function Dashboard() {
  const upcomingTasks = mockTasks.filter((task) => task.status !== "Done").slice(0, 4)
  const activeProjects = mockProjects.filter((project) => project.status === "In Progress")

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Projects currently in progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{project.team.length} team members</span>
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "completed"
                        ? "bg-green-500"
                        : activity.type === "assigned"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Upcoming Tasks</span>
            </CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
"use client"

import { motion } from "framer-motion"
import { CheckSquare, Clock, Users, TrendingUp, Calendar, AlertCircle, Activity, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProjects, useTasks } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function Dashboard() {
  const { user } = useAuth()
  const { data: projects, loading: projectsLoading, error: projectsError } = useProjects()
  const { data: tasks, loading: tasksLoading, error: tasksError } = useTasks()

  // Calculate stats from real data
  const totalTasks = tasks?.length || 0
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      change: "+12%",
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: inProgressTasks.toString(),
      change: "+5%",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Active Projects",
      value: (projects?.length || 0).toString(),
      change: "+2",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
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
      user: user?.name || "User",
      time: "2 hours ago",
      type: "completed",
    },
    {
      id: 2,
      action: "New task assigned",
      description: "Implement user authentication",
      user: user?.name || "User",
      time: "4 hours ago",
      type: "assigned",
    },
    {
      id: 3,
      action: "Project updated",
      description: "Website Redesign progress updated to 65%",
      user: user?.name || "User",
      time: "6 hours ago",
      type: "updated",
    },
  ]

  const upcomingTasks = tasks?.filter(task => task.status !== "completed").slice(0, 4) || []
  const activeProjects = projects?.filter(project => project.status === "in_progress") || []

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (projectsError || tasksError) {
    toast.error("Failed to load dashboard data")
  }

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
            Welcome back, {user?.name}! Here's what's happening with your projects.
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Projects currently in progress</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.length > 0 ? (
                activeProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                      <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No active projects yet</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              )}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{task.status}</Badge>
                        <span className="text-xs text-gray-500">
                          Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming tasks</p>
                <p className="text-sm">All caught up! Create new tasks to stay productive</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
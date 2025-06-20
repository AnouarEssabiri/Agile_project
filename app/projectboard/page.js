"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Grid, List } from "lucide-react"
import ProjectCard from "@/components/ui/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProjects } from "@/lib/mock-data"

export default function ProjectBoard() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [viewMode, setViewMode] = useState("grid") // grid or list

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const projectStats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    completed: projects.filter((p) => p.status === "Completed").length,
    planning: projects.filter((p) => p.status === "Planning").length,
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all your projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      {/* Project Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{projectStats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{projectStats.planning}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Planning</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{projectStats.inProgress}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{projectStats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
      </motion.div>

      {/* Search and Filters */}
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Projects Display */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <Badge
                        className={
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : project.status === "Planning"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Progress: {project.progress}%</span>
                      <span>Team: {project.team.length} members</span>
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - project.progress / 100)}`}
                          className="text-blue-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">No projects found matching your criteria</div>
        </motion.div>
      )}
    </div>
  )
} 
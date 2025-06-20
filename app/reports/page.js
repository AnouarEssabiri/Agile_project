"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, AlertTriangle, Users, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockProjects, mockTasks, mockTeamMembers } from "@/lib/mock-data"

// Mock data aggregation for reports
const reportData = {
  tasksCompleted: mockTasks.filter(t => t.status === "Done").length,
  projectsOverdue: mockProjects.filter(p => new Date(p.dueDate) < new Date() && p.status !== "Completed").length,
  teamProductivity: Math.round(mockTasks.filter(t => t.status === "Done").length / mockTasks.length * 100),
  completionRateData: [
    { name: "Jan", completed: 30 }, { name: "Feb", completed: 45 }, { name: "Mar", completed: 60 },
    { name: "Apr", completed: 50 }, { name: "May", completed: 70 }, { name: "Jun", completed: 85 },
  ],
  projectStatusData: {
    "Planning": mockProjects.filter(p => p.status === "Planning").length,
    "In Progress": mockProjects.filter(p => p.status === "In Progress").length,
    "Completed": mockProjects.filter(p => p.status === "Completed").length,
    "On Hold": mockProjects.filter(p => p.status === "On Hold").length,
  },
  teamPerformance: mockTeamMembers.map(member => ({
    ...member,
    tasksCompleted: mockTasks.filter(t => t.assignee === member.name && t.status === "Done").length,
    storyPoints: mockTasks.filter(t => t.assignee === member.name && t.status === "Done").reduce((acc, t) => acc + (t.storyPoints || 0), 0)
  })),
};

export default function ReportsPage() {
  const projectStatusColors = {
    "Planning": "bg-yellow-500",
    "In Progress": "bg-blue-500",
    "Completed": "bg-green-500",
    "On Hold": "bg-red-500",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your team's performance and project progress.</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter by Date
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportData.tasksCompleted}</div>
            <p className="text-sm text-green-600">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{reportData.projectsOverdue}</div>
            <p className="text-sm text-gray-500">2 new overdue projects this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportData.teamProductivity}%</div>
            <Progress value={reportData.teamProductivity} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Tasks completed over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full flex items-end justify-between px-4">
                {reportData.completionRateData.map((month, index) => (
                  <div key={month.name} className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.completed / 100) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                      className="w-8 bg-blue-500 rounded-t-lg"
                      style={{maxHeight: '100%'}}
                    />
                    <span className="text-xs font-medium">{month.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Current breakdown of all projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-40 w-40 mx-auto my-4 relative">
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(
                    ${projectStatusColors["Completed"]} 0% ${reportData.projectStatusData["Completed"] / mockProjects.length * 100}%,
                    ${projectStatusColors["In Progress"]} ${reportData.projectStatusData["Completed"] / mockProjects.length * 100}% ${ (reportData.projectStatusData["Completed"] + reportData.projectStatusData["In Progress"]) / mockProjects.length * 100}%,
                    ${projectStatusColors["Planning"]} ${ (reportData.projectStatusData["Completed"] + reportData.projectStatusData["In Progress"]) / mockProjects.length * 100}% ${ (reportData.projectStatusData["Completed"] + reportData.projectStatusData["In Progress"] + reportData.projectStatusData["Planning"]) / mockProjects.length * 100}%,
                    ${projectStatusColors["On Hold"]} ${ (reportData.projectStatusData["Completed"] + reportData.projectStatusData["In Progress"] + reportData.projectStatusData["Planning"]) / mockProjects.length * 100}% 100%
                  )`
                }}></div>
                 <div className="h-24 w-24 bg-white dark:bg-gray-800 rounded-full"/>
              </div>
              <div className="space-y-2">
                {Object.entries(reportData.projectStatusData).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className={`h-3 w-3 rounded-full mr-2 ${projectStatusColors[status]}`}></span>
                      <span>{status}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual performance metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Tasks Completed</TableHead>
                  <TableHead>Story Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.teamPerformance.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.tasksCompleted}</TableCell>
                    <TableCell>{member.storyPoints}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
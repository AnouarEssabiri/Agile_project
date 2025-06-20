"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, GitBranch, ArrowRight, Zap, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockWorkflow = {
  id: 1,
  name: "Default Development Workflow",
  description: "Standard workflow for software development projects.",
  stages: [
    { id: "backlog", title: "Backlog", tasks: 15, color: "border-gray-300 dark:border-gray-600" },
    { id: "todo", title: "To Do", tasks: 8, color: "border-blue-500" },
    { id: "in-progress", title: "In Progress", tasks: 5, color: "border-yellow-500" },
    { id: "review", title: "In Review", tasks: 3, color: "border-purple-500" },
    { id: "done", title: "Done", tasks: 27, color: "border-green-500" },
  ],
  automations: [
    {
      id: 1,
      trigger: "When a card is moved to 'In Review'",
      action: "Assign 'QA Team' and add 'Needs Testing' tag.",
    },
    {
      id: 2,
      trigger: "When a card is moved to 'Done'",
      action: "Notify project manager and close the story.",
    },
    {
      id: 3,
      trigger: "When a card in 'In Progress' is idle for 3 days",
      action: "Add 'Stale' tag and notify assignee.",
    },
  ],
}

export default function WorkflowPage() {
  const [workflow, setWorkflow] = useState(mockWorkflow)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflow</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualize and automate your team's processes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </motion.div>

      {/* Workflow Visualization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <span>{workflow.name}</span>
                </CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Workflow
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto p-4">
              {workflow.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <Card className={`min-w-[180px] text-center border-l-4 ${stage.color}`}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{stage.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Badge variant="secondary">{stage.tasks} tasks</Badge>
                    </CardContent>
                  </Card>
                  {index < workflow.stages.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500 mx-2 md:mx-4 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Automation Rules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Automation Rules</span>
            </CardTitle>
            <CardDescription>Automate repetitive tasks and keep your workflow moving smoothly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflow.automations.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rule.id * 0.1 }}
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-sm">{rule.trigger}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{rule.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {workflow.automations.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No automation rules defined.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
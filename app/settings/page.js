"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Palette, Zap, CreditCard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your workspace settings and integrations.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'general' && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Update your workspace name and details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input id="workspace-name" defaultValue="ProjectHub" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmt-8">(GMT-08:00) Pacific Time</SelectItem>
                        <SelectItem value="gmt-5">(GMT-05:00) Eastern Time</SelectItem>
                        <SelectItem value="gmt+1">(GMT+01:00) Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of your workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                    <Label>Theme</Label>
                    <p className="text-sm text-gray-500">Theme is controlled globally from the main layout.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                     <div className="flex space-x-2">
                       <Button size="icon" className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600" />
                       <Button size="icon" className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600" />
                       <Button size="icon" className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600" />
                       <Button size="icon" className="h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'integrations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect with your favorite tools.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <p className="font-medium">Slack</p>
                    <Button variant="outline">Connect</Button>
                  </div>
                   <div className="flex items-center justify-between p-3 rounded-lg border">
                    <p className="font-medium">GitHub</p>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>You are currently on the <Badge>Pro</Badge> plan.</p>
                  <Button>Upgrade Plan</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="destructive">Delete Workspace</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
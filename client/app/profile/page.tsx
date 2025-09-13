"use client"

import { useState } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, User, Settings, Key, Moon, Sun, Save, Copy, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedRole, setSelectedRole] = useState("farmer")
  const [apiKey, setApiKey] = useState("")
  const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Wallet Information */}
          <Card3D>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Wallet Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Connected Wallet</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted/50 rounded p-2 font-mono text-sm break-all">{walletAddress}</div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(walletAddress)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Connection Status</p>
                  <p className="text-sm text-muted-foreground">MetaMask connected</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Disconnect Wallet
              </Button>
            </div>
          </Card3D>

          {/* Role Selection */}
          <Card3D>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Role & Permissions</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Your Role in Supply Chain</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="warehouse">Warehouse Manager</SelectItem>
                    <SelectItem value="store">Store Manager</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">System Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This determines your permissions and available features.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Current Permissions</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Submit events</li>
                    <li>• View product history</li>
                    <li>• Access AI insights</li>
                    <li>• Export reports</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Activity Stats</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 47 events submitted</li>
                    <li>• 12 products tracked</li>
                    <li>• 98% verification rate</li>
                    <li>• Member since Jan 2024</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card3D>

          {/* API Configuration */}
          <Card3D>
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">API Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Private AI API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your private AI service API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use your own AI service for enhanced privacy and custom models.
                </p>
              </div>

              <div className="bg-muted/50 rounded p-3 text-sm">
                <h4 className="font-medium mb-1">Supported AI Services</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• OpenAI GPT-4</li>
                  <li>• Anthropic Claude</li>
                  <li>• Google Gemini</li>
                  <li>• Custom endpoints</li>
                </ul>
              </div>
            </div>
          </Card3D>

          {/* Preferences */}
          <Card3D>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for important events</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Auto-GPS Detection</Label>
                  <p className="text-sm text-muted-foreground">Automatically capture location data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">AI Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Show AI-powered recommendations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card3D>

          {/* Save Button */}
          <Button onClick={handleSave} size="lg" className="w-full">
            {isSaved ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Bell, Settings, User, Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useTheme } from "next-themes"

interface TopNavProps {
  toggleSidebar: () => void
}

export default function TopNav({ toggleSidebar }: TopNavProps) {
  const [notifications, setNotifications] = useState(2)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center md:hidden">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="font-semibold text-lg">NoVirus</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

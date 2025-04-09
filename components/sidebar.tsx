"use client"

import { useState, useEffect } from "react"
import { Shield, Activity, Lock, Settings, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type SidebarProps = {
  activeTab: string
  setActiveTab: (tab: "dashboard" | "antivirus" | "vpn" | "settings") => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true)
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleTabChange = (tab: "dashboard" | "antivirus" | "vpn" | "settings") => {
    setActiveTab(tab)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn("h-16 border-b flex items-center transition-all", isCollapsed ? "justify-center px-2" : "px-6")}
        >
          <Shield className="h-6 w-6 text-primary flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-semibold text-lg">NoVirus</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleTabChange("dashboard")}
                  className={cn(
                    "flex items-center w-full rounded-lg transition-colors",
                    isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
                    activeTab === "dashboard"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Activity className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>Dashboard</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleTabChange("antivirus")}
                  className={cn(
                    "flex items-center w-full rounded-lg transition-colors",
                    isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
                    activeTab === "antivirus"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>Antivirus</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Antivirus</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleTabChange("vpn")}
                  className={cn(
                    "flex items-center w-full rounded-lg transition-colors",
                    isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
                    activeTab === "vpn"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Lock className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>VPN</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">VPN</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleTabChange("settings")}
                  className={cn(
                    "flex items-center w-full rounded-lg transition-colors",
                    isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
                    activeTab === "settings"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>Settings</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>

            {!isCollapsed && (
              <>
                <button className="flex items-center w-full px-4 py-3 space-x-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mt-1">
                  <HelpCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Help & Support</span>
                </button>

                <button className="flex items-center w-full px-4 py-3 space-x-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mt-1">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Log Out</span>
                </button>
              </>
            )}

            {/* Collapse button */}
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? "Expand" : "Collapse"}
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </aside>
    </>
  )
}

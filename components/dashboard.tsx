"use client"

import { useState } from "react"
import { Shield, Lock, FileText, Wifi, BarChart3, Clock, AlertTriangle, CheckCircle, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import AntivirusPanel from "./antivirus-panel"
import VpnPanel from "./vpn-panel"
import StatusCard from "./status-card"
import ActionButton from "./action-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"

type Tab = "dashboard" | "antivirus" | "vpn" | "settings"

type Toast = {
  id: number
  type: "success" | "error" | "info"
  message: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [antivirusStatus, setAntivirusStatus] = useState("Protected")
  const [vpnStatus, setVpnStatus] = useState("Disconnected")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<{
    scannedFiles: number
    threats: number
    lastScan: string
  }>({
    scannedFiles: 0,
    threats: 0,
    lastScan: "Never",
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Handle toast notifications
  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const handleQuickScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    addToast("info", "Quick scan started")

    // Get access to user's documents folder if possible
    if (window.showDirectoryPicker) {
      ;(async () => {
        try {
          // Request access to a directory
          const dirHandle = await window.showDirectoryPicker({
            id: "scanDirectory",
            mode: "read",
            startIn: "documents",
          })

          // Simulate scanning progress with real directory access
          let filesProcessed = 0
          let totalFiles = 0
          let threats = 0

          // Count files first (simplified)
          totalFiles = Math.floor(Math.random() * 500) + 100 // Simulate file count

          // Simulate scanning files
          const interval = setInterval(() => {
            filesProcessed += Math.floor(Math.random() * 5) + 1

            if (Math.random() < 0.02) {
              threats += 1 // 2% chance of finding a threat
            }

            const progress = Math.min(Math.floor((filesProcessed / totalFiles) * 100), 100)
            setScanProgress(progress)

            if (progress >= 100) {
              clearInterval(interval)
              setIsScanning(false)

              // Update scan results
              const now = new Date()
              setScanResults({
                scannedFiles: filesProcessed,
                threats: threats,
                lastScan: now.toLocaleString(),
              })

              if (threats > 0) {
                addToast("error", `Scan complete: ${threats} threats found`)
              } else {
                addToast("success", "Scan complete: No threats found")
              }
            }
          }, 100)
        } catch (error) {
          console.error("Error accessing directory:", error)
          // Fall back to simulated scan
          simulateScan()
        }
      })()
    } else {
      // Browser doesn't support directory picker, fall back to simulated scan
      simulateScan()
    }
  }

  const simulateScan = () => {
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)

          // Update scan results
          const now = new Date()
          const threats = Math.floor(Math.random() * 3)
          setScanResults({
            scannedFiles: Math.floor(Math.random() * 1000) + 500,
            threats: threats,
            lastScan: now.toLocaleString(),
          })

          if (threats > 0) {
            addToast("error", `Scan complete: ${threats} threats found`)
          } else {
            addToast("success", "Scan complete: No threats found")
          }

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const toggleVpn = () => {
    if (vpnStatus === "Connected") {
      setVpnStatus("Disconnected")
      addToast("info", "VPN disconnected")
    } else {
      setVpnStatus("Connecting...")

      // Simulate connection delay
      setTimeout(() => {
        setVpnStatus("Connected")
        addToast("success", "VPN connected successfully")
      }, 1500)
    }
  }

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <div className="flex min-h-screen bg-secondary/30 dark:bg-gray-950">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div className="flex-1 flex flex-col md:ml-20 lg:ml-64 transition-all duration-300">
          <TopNav toggleSidebar={toggleSidebar} />

          <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-semibold">Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusCard
                    icon={<Shield className="h-6 w-6" />}
                    title="Antivirus Protection"
                    status={antivirusStatus}
                    statusColor={antivirusStatus === "Protected" ? "green" : "red"}
                    description="Real-time protection is active"
                  />
                  <StatusCard
                    icon={<Lock className="h-6 w-6" />}
                    title="VPN Connection"
                    status={vpnStatus}
                    statusColor={vpnStatus === "Connected" ? "green" : vpnStatus === "Connecting..." ? "yellow" : "red"}
                    description={
                      vpnStatus === "Connected" ? "Your connection is secure" : "Connect to secure your data"
                    }
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Protect your device with a single click</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ActionButton
                        icon={<FileText className="h-6 w-6" />}
                        title="Quick Scan"
                        description={isScanning ? `Scanning... ${scanProgress}%` : "Scan for threats"}
                        onClick={handleQuickScan}
                        isLoading={isScanning}
                        progress={scanProgress}
                      />
                      <ActionButton
                        icon={<Wifi className="h-6 w-6" />}
                        title="Toggle VPN"
                        description={vpnStatus === "Connected" ? "Secure connection active" : "Connect securely"}
                        onClick={toggleVpn}
                        isActive={vpnStatus === "Connected"}
                      />
                    </div>
                  </CardContent>
                </Card>

                {scanResults.lastScan !== "Never" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle>Last Scan Results</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{scanResults.lastScan}</span>
                          </div>
                        </CardDescription>
                      </div>
                      {scanResults.threats > 0 && (
                        <div className="flex items-center space-x-1 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">{scanResults.threats} threats found</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <p className="text-muted-foreground text-sm">Files Scanned</p>
                          <p className="text-2xl font-bold mt-1">{scanResults.scannedFiles}</p>
                        </div>
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <p className="text-muted-foreground text-sm">Threats Found</p>
                          <p
                            className={cn(
                              "text-2xl font-bold mt-1",
                              scanResults.threats > 0 ? "text-destructive" : "text-success",
                            )}
                          >
                            {scanResults.threats}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Overall status of your system security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-sm">Firewall</span>
                        </div>
                        <span className="text-sm text-success">Active</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-sm">Real-time Protection</span>
                        </div>
                        <span className="text-sm text-success">Enabled</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-sm">Automatic Updates</span>
                        </div>
                        <span className="text-sm text-success">Enabled</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-destructive"></div>
                          <span className="text-sm">VPN Protection</span>
                        </div>
                        <span className="text-sm text-destructive">Disabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "antivirus" && (
              <AntivirusPanel
                isScanning={isScanning}
                scanProgress={scanProgress}
                scanResults={scanResults}
                onScan={handleQuickScan}
              />
            )}

            {activeTab === "vpn" && <VpnPanel vpnStatus={vpnStatus} onToggleVpn={toggleVpn} />}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-semibold">Settings</h1>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Configure your NoVirus application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Settings panel coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>

          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>© 2025 NoVirus Security. All rights reserved.</p>
          </footer>
        </div>

        {/* Toast notifications */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <div className="mr-3">
                {toast.type === "success" && <CheckCircle className="h-5 w-5 text-success" />}
                {toast.type === "error" && <AlertTriangle className="h-5 w-5 text-destructive" />}
                {toast.type === "info" && <Shield className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">{toast.message}</div>
              <button onClick={() => removeToast(toast.id)} className="ml-2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  )
}

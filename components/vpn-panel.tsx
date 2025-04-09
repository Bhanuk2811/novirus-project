"use client"

import { useState, useEffect } from "react"
import { Lock, Shield, AlertTriangle, RefreshCw, Globe, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vpnLocations, generateVpnStats, type VpnStats } from "@/lib/vpn"
import { Badge } from "@/components/ui/badge"

type VpnPanelProps = {
  vpnStatus: string
  onToggleVpn: () => void
}

export default function VpnPanel({ vpnStatus, onToggleVpn }: VpnPanelProps) {
  const [selectedLocation, setSelectedLocation] = useState("auto")
  const [isConnecting, setIsConnecting] = useState(false)
  const [stats, setStats] = useState<VpnStats | null>(null)
  const [statsInterval, setStatsInterval] = useState<NodeJS.Timeout | null>(null)

  // Update stats when connected
  useEffect(() => {
    if (vpnStatus === "Connected") {
      // Initial stats
      setStats(generateVpnStats())

      // Update stats periodically
      const interval = setInterval(() => {
        setStats(generateVpnStats())
      }, 5000)

      setStatsInterval(interval)
    } else {
      // Clear interval when disconnected
      if (statsInterval) {
        clearInterval(statsInterval)
        setStatsInterval(null)
      }
    }

    return () => {
      if (statsInterval) {
        clearInterval(statsInterval)
      }
    }
  }, [vpnStatus])

  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      onToggleVpn()
      setIsConnecting(false)
    }, 1500)
  }

  const handleDisconnect = () => {
    onToggleVpn()
  }

  // Get location name by ID
  const getLocationName = (id: string) => {
    const location = vpnLocations.find((loc) => loc.id === id)
    return location ? `${location.flag} ${location.name}` : "Unknown"
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <Lock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">VPN</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VPN Connection</CardTitle>
              <CardDescription>Secure your internet connection with our VPN service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Server Location</label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  disabled={vpnStatus === "Connected" || vpnStatus === "Connecting..." || isConnecting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {vpnLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <span className="flex items-center">
                          <span className="mr-2">{location.flag}</span>
                          {location.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center py-6">
                <div className="text-center">
                  <div
                    className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto ${
                      vpnStatus === "Connected"
                        ? "bg-success/10"
                        : vpnStatus === "Connecting..."
                          ? "bg-amber-500/10"
                          : "bg-destructive/10"
                    }`}
                  >
                    <Lock
                      className={`h-12 w-12 ${
                        vpnStatus === "Connected"
                          ? "text-success"
                          : vpnStatus === "Connecting..."
                            ? "text-amber-500"
                            : "text-destructive"
                      }`}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <span
                      className={`status-indicator ${
                        vpnStatus === "Connected"
                          ? "connected"
                          : vpnStatus === "Connecting..."
                            ? "connecting"
                            : "disconnected"
                      }`}
                    />
                    <p className="font-medium">{vpnStatus}</p>
                  </div>
                  {vpnStatus === "Connected" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Connected to {getLocationName(selectedLocation)}
                    </p>
                  )}
                </div>
              </div>

              {vpnStatus === "Connected" ? (
                <Alert variant="default" className="bg-success/10 text-success border-success/20">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Connection Secure</AlertTitle>
                  <AlertDescription>Your internet traffic is encrypted and your IP address is hidden.</AlertDescription>
                </Alert>
              ) : (
                vpnStatus === "Disconnected" && (
                  <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Connection Not Secure</AlertTitle>
                    <AlertDescription>
                      Your internet traffic is not encrypted. Connect to VPN for protection.
                    </AlertDescription>
                  </Alert>
                )
              )}
            </CardContent>
            <CardFooter>
              {vpnStatus === "Connected" ? (
                <Button onClick={handleDisconnect} className="w-full" variant="destructive">
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  className="w-full"
                  disabled={isConnecting || vpnStatus === "Connecting..."}
                >
                  {isConnecting || vpnStatus === "Connecting..." ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          {vpnStatus === "Connected" && stats && (
            <Card>
              <CardHeader>
                <CardTitle>Connection Statistics</CardTitle>
                <CardDescription>Real-time information about your VPN connection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Download Speed</span>
                      <span className="font-medium">{stats.downloadSpeed} Mbps</span>
                    </div>
                    <Progress value={stats.downloadSpeed * 2} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Upload Speed</span>
                      <span className="font-medium">{stats.uploadSpeed} Mbps</span>
                    </div>
                    <Progress value={stats.uploadSpeed * 4} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ping</span>
                      <span className="font-medium">{stats.ping} ms</span>
                    </div>
                    <Progress value={100 - stats.ping} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Data Used</span>
                      <span className="font-medium">{stats.dataUsed.toFixed(2)} GB</span>
                    </div>
                    <Progress value={stats.dataUsed * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Encryption</p>
                <p className="font-medium">AES-256-GCM</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Protocol</p>
                <p className="font-medium">OpenVPN (UDP)</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Real IP Address</p>
                <p className="font-medium">{stats?.ipAddress || "Not connected"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Virtual IP Address</p>
                <p className="font-medium">{vpnStatus === "Connected" ? stats?.virtualIp : "Not connected"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Kill Switch</p>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Servers</CardTitle>
              <CardDescription>Choose from our global server network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                {vpnLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors ${
                      selectedLocation === location.id && "bg-secondary"
                    }`}
                    onClick={() => vpnStatus !== "Connected" && setSelectedLocation(location.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{location.flag}</span>
                      <span>{location.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} ms</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Use VPN?</CardTitle>
          <CardDescription>Protect your privacy and security online</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary rounded-xl p-5 flex flex-col items-center text-center">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium">Enhanced Security</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Encrypt your internet traffic to protect your data from hackers and surveillance.
              </p>
            </div>

            <div className="bg-secondary rounded-xl p-5 flex flex-col items-center text-center">
              <Globe className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium">Global Access</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Access content from around the world by connecting to servers in different countries.
              </p>
            </div>

            <div className="bg-secondary rounded-xl p-5 flex flex-col items-center text-center">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium">Privacy Protection</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Hide your IP address and browsing activity from your ISP and other third parties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

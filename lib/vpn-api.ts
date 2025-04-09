// PureVPN API Integration

// Note: You'll need to replace these with your actual PureVPN API credentials
const PURE_VPN_API_KEY = process.env.PURE_VPN_API_KEY || "your-api-key"
const PURE_VPN_USERNAME = process.env.PURE_VPN_USERNAME || ""
const PURE_VPN_PASSWORD = process.env.PURE_VPN_PASSWORD || ""

// Types for API responses
export interface VpnServer {
  id: string
  country: string
  city: string
  hostname: string
  ip: string
  load: number
  ping: number
  protocol: string
}

export interface VpnSession {
  id: string
  status: "connecting" | "connected" | "disconnected" | "failed"
  server: VpnServer
  startTime?: string
  endTime?: string
  bytesReceived: number
  bytesSent: number
  assignedIp?: string
}

export interface VpnCredentials {
  username: string
  password: string
}

// API endpoints
const API_BASE_URL = "https://api.purevpn.com/v1"

// Function to fetch available VPN servers
export async function fetchVpnServers(): Promise<VpnServer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PURE_VPN_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch servers: ${response.status}`)
    }

    const data = await response.json()
    return data.servers || []
  } catch (error) {
    console.error("Error fetching VPN servers:", error)
    return []
  }
}

// Function to authenticate with PureVPN
export async function authenticateVpn(): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: PURE_VPN_USERNAME,
        password: PURE_VPN_PASSWORD,
      }),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      token: data.token,
    }
  } catch (error) {
    console.error("VPN authentication error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}

// Function to establish a VPN connection
export async function connectToVpnServer(
  serverId: string,
  protocol: "openvpn" | "wireguard" = "wireguard",
): Promise<{ success: boolean; session?: VpnSession; message?: string }> {
  try {
    // First authenticate
    const auth = await authenticateVpn()
    if (!auth.success || !auth.token) {
      return { success: false, message: "Authentication failed" }
    }

    // Then connect to server
    const response = await fetch(`${API_BASE_URL}/connect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_id: serverId,
        protocol: protocol,
      }),
    })

    if (!response.ok) {
      throw new Error(`Connection failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      session: data.session,
    }
  } catch (error) {
    console.error("VPN connection error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
    }
  }
}

// Function to disconnect from VPN
export async function disconnectVpn(sessionId: string): Promise<{ success: boolean; message?: string }> {
  try {
    // First authenticate
    const auth = await authenticateVpn()
    if (!auth.success || !auth.token) {
      return { success: false, message: "Authentication failed" }
    }

    const response = await fetch(`${API_BASE_URL}/disconnect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Disconnection failed: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("VPN disconnection error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Disconnection failed",
    }
  }
}

// Function to get VPN connection status
export async function getVpnStatus(
  sessionId: string,
): Promise<{ success: boolean; session?: VpnSession; message?: string }> {
  try {
    // First authenticate
    const auth = await authenticateVpn()
    if (!auth.success || !auth.token) {
      return { success: false, message: "Authentication failed" }
    }

    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      session: data.session,
    }
  } catch (error) {
    console.error("Error getting VPN status:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get status",
    }
  }
}

// Function to get VPN connection statistics
export async function getVpnStats(sessionId: string): Promise<{ success: boolean; stats?: any; message?: string }> {
  try {
    // First authenticate
    const auth = await authenticateVpn()
    if (!auth.success || !auth.token) {
      return { success: false, message: "Authentication failed" }
    }

    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get stats: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      stats: data.stats,
    }
  } catch (error) {
    console.error("Error getting VPN stats:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get stats",
    }
  }
}

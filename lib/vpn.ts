// Simulated VPN functionality

// VPN server locations
export const vpnLocations = [
  { id: "auto", name: "Auto Select", flag: "🌐" },
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { id: "jp", name: "Japan", flag: "🇯🇵" },
  { id: "de", name: "Germany", flag: "🇩🇪" },
  { id: "sg", name: "Singapore", flag: "🇸🇬" },
  { id: "ca", name: "Canada", flag: "🇨🇦" },
  { id: "fr", name: "France", flag: "🇫🇷" },
  { id: "au", name: "Australia", flag: "🇦🇺" },
  { id: "nl", name: "Netherlands", flag: "🇳🇱" },
]

// VPN connection states
export type VpnStatus = "Connected" | "Disconnected" | "Connecting..."

// VPN connection statistics
export interface VpnStats {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  dataUsed: number
  encryptionStrength: string
  ipAddress: string
  virtualIp: string
}

// Simulated VPN connection function
export function connectToVpn(location: string, statusCallback: (status: VpnStatus) => void): Promise<void> {
  return new Promise((resolve) => {
    statusCallback("Connecting...")

    // Simulate connection delay
    setTimeout(() => {
      statusCallback("Connected")
      resolve()
    }, 1500)
  })
}

// Simulated VPN disconnection function
export function disconnectFromVpn(statusCallback: (status: VpnStatus) => void): Promise<void> {
  return new Promise((resolve) => {
    statusCallback("Disconnected")
    resolve()
  })
}

// Generate simulated VPN statistics
export function generateVpnStats(): VpnStats {
  return {
    downloadSpeed: Math.floor(Math.random() * 50) + 20,
    uploadSpeed: Math.floor(Math.random() * 20) + 5,
    ping: Math.floor(Math.random() * 30) + 20,
    dataUsed: Number.parseFloat((Math.random() * 2).toFixed(2)),
    encryptionStrength: "AES-256",
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    virtualIp: `10.8.0.${Math.floor(Math.random() * 255)}`,
  }
}

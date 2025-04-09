import { NextResponse } from "next/server"
import { connectToVpnServer } from "@/lib/vpn-api"

export async function POST(request: Request) {
  try {
    const { serverId, protocol } = await request.json()

    if (!serverId) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 })
    }

    const result = await connectToVpnServer(serverId, protocol || "wireguard")

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Connection failed" }, { status: 500 })
    }

    return NextResponse.json({ session: result.session })
  } catch (error) {
    console.error("Error connecting to VPN:", error)
    return NextResponse.json({ error: "Failed to connect to VPN" }, { status: 500 })
  }
}

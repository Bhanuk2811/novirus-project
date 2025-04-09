import { NextResponse } from "next/server"
import { disconnectVpn } from "@/lib/vpn-api"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const result = await disconnectVpn(sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Disconnection failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disconnecting from VPN:", error)
    return NextResponse.json({ error: "Failed to disconnect from VPN" }, { status: 500 })
  }
}

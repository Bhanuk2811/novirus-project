import { NextResponse } from "next/server"
import { disconnectSession } from "@/lib/openvpn-api"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const result = await disconnectSession(sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to disconnect session" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disconnecting OpenVPN session:", error)
    return NextResponse.json({ error: "Failed to disconnect VPN session" }, { status: 500 })
  }
}

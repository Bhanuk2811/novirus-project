import { NextResponse } from "next/server"
import { getActiveSessions } from "@/lib/openvpn-api"

export async function GET() {
  try {
    const result = await getActiveSessions()

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to get sessions" }, { status: 500 })
    }

    return NextResponse.json({ sessions: result.sessions })
  } catch (error) {
    console.error("Error getting OpenVPN sessions:", error)
    return NextResponse.json({ error: "Failed to get VPN sessions" }, { status: 500 })
  }
}

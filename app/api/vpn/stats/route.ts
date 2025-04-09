import { NextResponse } from "next/server"
import { getVpnStats } from "@/lib/vpn-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const result = await getVpnStats(sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to get stats" }, { status: 500 })
    }

    return NextResponse.json({ stats: result.stats })
  } catch (error) {
    console.error("Error getting VPN stats:", error)
    return NextResponse.json({ error: "Failed to get VPN stats" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerStats } from "@/lib/openvpn-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get("serverId")

    if (!serverId) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 })
    }

    const result = await getServerStats(serverId)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to get stats" }, { status: 500 })
    }

    return NextResponse.json({ stats: result.stats })
  } catch (error) {
    console.error("Error getting server stats:", error)
    return NextResponse.json({ error: "Failed to get server stats" }, { status: 500 })
  }
}

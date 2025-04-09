import { NextResponse } from "next/server"
import { getVpnStatus } from "@/lib/vpn-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const result = await getVpnStatus(sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to get status" }, { status: 500 })
    }

    return NextResponse.json({ session: result.session })
  } catch (error) {
    console.error("Error getting VPN status:", error)
    return NextResponse.json({ error: "Failed to get VPN status" }, { status: 500 })
  }
}

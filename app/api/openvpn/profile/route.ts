import { NextResponse } from "next/server"
import { getVpnProfile } from "@/lib/openvpn-api"

export async function POST(request: Request) {
  try {
    const { serverId, protocol } = await request.json()

    if (!serverId) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 })
    }

    const result = await getVpnProfile(serverId, protocol || "udp")

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to generate profile" }, { status: 500 })
    }

    return NextResponse.json({ profileUrl: result.profileUrl })
  } catch (error) {
    console.error("Error generating OpenVPN profile:", error)
    return NextResponse.json({ error: "Failed to generate VPN profile" }, { status: 500 })
  }
}

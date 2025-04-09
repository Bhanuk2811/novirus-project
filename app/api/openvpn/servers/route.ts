import { NextResponse } from "next/server"
import { fetchVpnServers } from "@/lib/openvpn-api"

export async function GET() {
  try {
    const servers = await fetchVpnServers()
    return NextResponse.json({ servers })
  } catch (error) {
    console.error("Error fetching OpenVPN servers:", error)
    return NextResponse.json({ error: "Failed to fetch VPN servers" }, { status: 500 })
  }
}

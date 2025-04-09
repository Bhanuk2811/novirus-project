import { NextResponse } from "next/server"
import { authenticateVpn } from "@/lib/vpn-api"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Set environment variables for the API call
    process.env.PURE_VPN_USERNAME = username
    process.env.PURE_VPN_PASSWORD = password

    const result = await authenticateVpn()

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Authentication failed" }, { status: 401 })
    }

    return NextResponse.json({ token: result.token })
  } catch (error) {
    console.error("Error authenticating with VPN:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { authenticateVpn } from "@/lib/openvpn-api"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const result = await authenticateVpn(username, password)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Authentication failed" }, { status: 401 })
    }

    return NextResponse.json({ token: result.token })
  } catch (error) {
    console.error("Error authenticating with OpenVPN:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

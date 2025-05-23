import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      console.log("API/auth/me: No user found")
      return NextResponse.json({ user: null }, { status: 401 })
    }

    console.log("API/auth/me: User found:", user.email)

    // Don't send password hash to client
    const {  ...safeUser } = user

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: "Email, password, and name are required" }, { status: 400 })
    }

    // Register user
    const result = await registerUser(email, password, name)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId: result.userId })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

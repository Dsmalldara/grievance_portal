import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch all grievances with user information
    const allGrievances = await db.query.grievances.findMany({
      orderBy: (grievances, { desc }) => [desc(grievances.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            // Don't include passwordHash for security
            passwordHash: false,
          },
        },
      },
    })

    return NextResponse.json({ grievances: allGrievances })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

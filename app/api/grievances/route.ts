import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { grievances } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch user's grievances with user information
    const userGrievances = await db.query.grievances.findMany({
      where: eq(grievances.userId, user.id),
      orderBy: (grievances, { desc }) => [desc(grievances.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            passwordHash: false,
          },
        },
      },
    })

    return NextResponse.json({ grievances: userGrievances })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const { title, content, mood, severity } = await request.json()

    // Validate required fields
    if (!title || !content || !mood || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert grievance into database
    const [newGrievance] = await db
      .insert(grievances)
      .values({
        userId: user.id,
        title,
        content,
        mood,
        severity,
      })
      .returning()

    return NextResponse.json({ success: true, grievance: newGrievance })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

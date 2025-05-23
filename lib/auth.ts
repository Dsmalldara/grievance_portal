import { db } from "@/lib/db"
import { users, userSessions, type User } from "@/lib/db/schema"

import { eq, and } from "drizzle-orm"
import { cookies } from "next/headers"
import { randomUUID as uuidv4 } from "crypto"
import bcrypt from "bcryptjs"
// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get session token from cookie
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    console.log("Session token from cookie:", sessionToken ? "Found" : "Not found")

    if (!sessionToken) {
      return null
    }

    // Find active session
    const session = await db.query.userSessions.findFirst({
      where: and(eq(userSessions.sessionToken, sessionToken), eq(userSessions.isActive, true)),
      with: {
        user: true,
      },
    })

    console.log("Session found:", session ? "Yes" : "No")

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Register a new user
export async function registerUser(email: string, password: string, name: string) {
  try {
    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return { success: false, message: "Email already exists" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new user
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning()

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, message: "Failed to register user" }
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash)

    if (!passwordValid) {
      return { success: false, message: "Invalid email or password" }
    }

    // Generate session token
    const sessionToken = uuidv4()

    // Deactivate existing sessions
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(and(eq(userSessions.userId, user.id), eq(userSessions.isActive, true)))

    // Create new session
    const [session] = await db
      .insert(userSessions)
      .values({
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      })
      .returning()

    // Set session cookie
    ;(await
      // Set session cookie
      cookies()).set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return {
      success: true,
      userId: user.id,
      sessionId: session.id,
      sessionToken,
    }
  } catch (error) {
    console.error("Error logging in user:", error)
    return { success: false, message: "Failed to log in" }
  }
}

// Logout user
export async function logout() {
  try {
    // Get session token from cookie
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (sessionToken) {
      // Deactivate session
      await db
        .update(userSessions)
        .set({ isActive: false })
        .where(and(eq(userSessions.sessionToken, sessionToken), eq(userSessions.isActive, true)))

      // Delete cookie
      ;(await
        // Delete cookie
        cookies()).delete("session_token")
    }

    return { success: true }
  } catch (error) {
    console.error("Error logging out:", error)
    return { success: false, error }
  }
}

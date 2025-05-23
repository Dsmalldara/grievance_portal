import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

// Get connection string from environment variables
const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase", "postgres")?.replace(".co", ".co:5432") +
    `?user=postgres&password=${process.env.SUPABASE_SERVICE_ROLE_KEY}`

if (!connectionString) {
  throw new Error("DATABASE_URL or Supabase credentials are required")
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // Changed from "driver: 'pg'" to "dialect: 'postgresql'"
  dbCredentials: {
    url: connectionString, // Changed from "connectionString" to "url"
  },
} satisfies Config
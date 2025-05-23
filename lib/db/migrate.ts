import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// This script runs migrations on the database
async function main() {
  console.log("Running migrations...")

  // Create connection string
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase", "postgres")?.replace(".co", ".co:5432") +
      `?user=postgres&password=${process.env.SUPABASE_SERVICE_ROLE_KEY}`

  if (!connectionString) {
    throw new Error("DATABASE_URL or SUPABASE credentials are required")
  }

  // For migrations, use a separate connection
  const migrationClient = postgres(connectionString, { max: 1 })
  const db = drizzle(migrationClient)

  // Run migrations
  await migrate(db, { migrationsFolder: "drizzle" })

  // Close connection
  await migrationClient.end()
  console.log("Migrations completed successfully")
  process.exit(0)
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})

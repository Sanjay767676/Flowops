import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Set default DATABASE_URL for development if not provided
// Note: Client-side pipeline engine handles simulation, so database is optional
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "development") {
    // Use a placeholder URL for development
    // The client uses client-side simulation, so the database isn't required
    process.env.DATABASE_URL = "postgresql://localhost:5432/flowops_dev";
    console.warn("⚠️  DATABASE_URL not set. Using placeholder. Client-side simulation is active.");
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Allow connection errors in development since client-side engine is used
  ...(process.env.NODE_ENV === "development" ? {
    // Connection will fail gracefully if DB doesn't exist, but server will still start
  } : {})
});

// Handle connection errors gracefully in development
if (process.env.NODE_ENV === "development") {
  pool.on("error", (err) => {
    console.warn("⚠️  Database connection error (expected in dev with client-side simulation):", err.message);
  });
}

export const db = drizzle(pool, { schema });

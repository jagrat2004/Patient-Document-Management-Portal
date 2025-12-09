import { initDb, run, closeDb } from "./db.js";

const createTables = async () => {
  try {
    await initDb();

    // Create documents table
    await run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        original_name TEXT NOT NULL,
        filepath TEXT NOT NULL,
        filesize INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    console.log("✅ Migration completed: documents table created/verified");
    await closeDb();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

createTables();

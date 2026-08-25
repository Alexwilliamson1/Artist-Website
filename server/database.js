const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Ensure that the data directory exists.
const dataDirectory = path.join(__dirname, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

// SQLite creates this file if it does not already exist.
const localDatabase = path.join(dataDirectory, "art.db");

const databasePath = process.env.DB_PATH || localDatabase;

if (process.env.DB_PATH && !fs.existsSync(databasePath)) {
    fs.copyFileSync(localDatabase, databasePath);
}

const database = new Database(databasePath);

// Enforce foreign-key constraints if other related tables
// are added later.
database.pragma('foreign_keys = ON');

// Recommended by better-sqlite3 for typical applications.
database.pragma('journal_mode = WAL');

// Create the artworks table if it does not already exist.
database.exec(`
    CREATE TABLE IF NOT EXISTS artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        year INTEGER,
        category TEXT NOT NULL DEFAULT 'painting',
        medium TEXT,
        dimensions TEXT,
        description TEXT,
        alt_text TEXT NOT NULL,
        thumbnail_url TEXT NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        is_featured INTEGER NOT NULL DEFAULT 0
            CHECK (is_featured IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS
        idx_artworks_display_order
    ON artworks(display_order);
`);

console.log(`SQLite database opened at ${databasePath}`);

module.exports = database;

import { SQLiteDatabase } from "expo-sqlite";
import { populateTemplates } from "./DefaultTemplates";

const initializeDatabase = async (db: SQLiteDatabase) => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS habits (
                                                  id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  name             TEXT NOT NULL,
                                                  description      TEXT,
                                                  type             TEXT NOT NULL CHECK (type IN ('boolean','count','quantity','duration')),
                target_value     REAL,
                unit             TEXT,
                color            TEXT,
                icon             TEXT,
                start_date       TEXT NOT NULL,
                end_date         TEXT,
                is_archived      INTEGER NOT NULL DEFAULT 0,
                created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now')),
                updated_at       INTEGER NOT NULL DEFAULT (strftime('%s','now'))
                );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS habit_schedules (
                                                           id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                                           habit_id         INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                schedule_type    TEXT NOT NULL CHECK (schedule_type IN ('daily','weekly','interval')),
                dow_mask         INTEGER,
                interval_days    INTEGER,
                start_date       TEXT NOT NULL,
                timezone         TEXT DEFAULT 'Africa/Cairo'
                );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS reminders (
                                                     id                   INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     habit_id             INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                minutes_after_midnight INTEGER NOT NULL CHECK (minutes_after_midnight BETWEEN 0 AND 1439),
                dow_mask             INTEGER DEFAULT 127,
                enabled              INTEGER NOT NULL DEFAULT 1
                );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS habit_entries (
                                                         id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         habit_id         INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                occurred_on      TEXT NOT NULL,
                value            REAL,
                note             TEXT,
                created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now'))
                );
        `);

        await db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_entries_habit_date ON habit_entries(habit_id, occurred_on);
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS hidden_habits (
                                                         id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         habit_id         INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                hidden_date      TEXT NOT NULL,
                created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now')),
                UNIQUE(habit_id, hidden_date)
                );
        `);

        await db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_hidden_habits ON hidden_habits(habit_id, hidden_date);
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS templates (
                                                     id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     name             TEXT NOT NULL,
                                                     description      TEXT,
                                                     type             TEXT NOT NULL CHECK (type IN ('boolean','count','quantity','duration')),
                default_target   REAL,
                unit             TEXT,
                default_dow_mask INTEGER,
                default_color    TEXT,
                default_icon     TEXT,
                category         TEXT
                );
        `);

        const templateCount = await db.getFirstAsync(`SELECT COUNT(*) as count FROM templates`) as {count: number};
        if (templateCount.count === 0) {
            await populateTemplates(db);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

export default initializeDatabase;
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { neon } from '@neondatabase/serverless';

// 1. Neon Postgres connection when deployed on Vercel
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isPostgres = Boolean(postgresUrl);
const sql = isPostgres ? neon(postgresUrl!) : null;

// 2. Local SQLite connection fallback for offline dev
let db: InstanceType<typeof Database> | null = null;

if (!isPostgres) {
  let dbPath: string;
  try {
    const localDb = path.join(process.cwd(), 'weekend_club.db');
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    dbPath = localDb;
  } catch (e) {
    dbPath = path.join('/tmp', 'weekend_club.db');
  }

  try {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  } catch (error) {
    console.error("Failed to connect to SQLite file DB, falling back to memory:", error);
    db = new Database(':memory:');
  }
}

export function initDb() {
  if (isPostgres) return;
  if (!db) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      email_verified INTEGER DEFAULT 0,
      verification_code TEXT,
      code_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      ticket_price TEXT DEFAULT '1500',
      payment_info TEXT,
      capacity INTEGER NOT NULL DEFAULT 50,
      registered_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'upcoming',
      badge_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER,
      ticket_code TEXT UNIQUE NOT NULL,
      attendee_name TEXT NOT NULL,
      attendee_email TEXT NOT NULL,
      attendee_phone TEXT NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 1,
      payment_screenshot TEXT,
      payment_ref TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending_approval',
      checked_in INTEGER DEFAULT 0,
      checked_in_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try { db.exec("ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN verification_code TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN code_expires_at DATETIME"); } catch (e) {}
  try { db.exec("ALTER TABLE events ADD COLUMN ticket_price TEXT DEFAULT '1500'"); } catch (e) {}
  try { db.exec("ALTER TABLE events ADD COLUMN payment_info TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_screenshot TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_ref TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_status TEXT DEFAULT 'pending'"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN checked_in INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN checked_in_at TEXT"); } catch (e) {}

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@weekendclub.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (email, password, name, phone, role, email_verified) 
      VALUES (?, ?, 'Organizer Admin', '+92 325 4204200', 'admin', 1)
    `).run(adminEmail, adminPassword);
  } else {
    db.prepare("UPDATE users SET email = ?, password = ?, email_verified = 1 WHERE role = 'admin'").run(adminEmail, adminPassword);
  }

  const memberCount = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'member'").get() as { count: number }).count;
  if (memberCount === 0) {
    db.prepare(`
      INSERT INTO users (email, password, name, phone, role, email_verified) 
      VALUES ('member@weekendclub.com', 'member123', 'Weekend Member', '+92 300 1234567', 'member', 1)
    `).run();
  }

  db.prepare("DELETE FROM events WHERE title LIKE '35mm%' OR title LIKE 'Riso%' OR title LIKE 'Vinyl%' OR title LIKE 'Vintage Poster%' OR title LIKE 'Handmade Clay%' OR title LIKE 'Super 8mm%'").run();

  const sadaPayDetails = 'Bank: SadaPay\nAccount Title: Sabahat Batool\nAccount Number: 03254204200';

  db.prepare(`
    UPDATE events 
    SET ticket_price = 'Rs. 1,500',
        payment_info = ?,
        image_url = '/poster.jpeg'
    WHERE id = 1 OR title LIKE '%Outdoor Cinema%'
  `).run(sadaPayDetails);

  const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number }).count;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (title, category, date, time, location, description, image_url, ticket_price, payment_info, capacity, registered_count, status, badge_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'upcoming', ?)
    `);

    insertEvent.run(
      'Outdoor Cinema & Photobooth Night',
      'Movie Night',
      'Sunday, Aug 9, 2026',
      '7:00 PM Onwards',
      'La Kofe Cafe, Citrus City',
      'Join us for an exclusive Sunday movie night under the stars! Featuring a massive SMD Screen, a fun photobooth to capture memories, and FREE freshly popped popcorn for everyone.',
      '/poster.jpeg',
      'Rs. 1,500',
      sadaPayDetails,
      50,
      'NEW'
    );
  }
}

try {
  initDb();
} catch (e) {
  console.error("Db auto-init warning:", e);
}

// Unified Async Database Query Helpers for both Neon Postgres & Local SQLite
export async function queryAll(sqlText: string, params: any[] = []) {
  if (isPostgres && sql) {
    let paramIndex = 1;
    const pgSqlText = sqlText.replace(/\?/g, () => `$${paramIndex++}`);
    const results = await (sql as any)(pgSqlText, params);
    return results as any[];
  } else if (db) {
    return db.prepare(sqlText).all(...params) as any[];
  }
  return [];
}

export async function queryOne(sqlText: string, params: any[] = []) {
  const rows = await queryAll(sqlText, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sqlText: string, params: any[] = []) {
  if (isPostgres && sql) {
    let paramIndex = 1;
    const pgSqlText = sqlText.replace(/\?/g, () => `$${paramIndex++}`);
    await (sql as any)(pgSqlText, params);
    return { lastInsertRowid: null };
  } else if (db) {
    const info = db.prepare(sqlText).run(...params);
    return { lastInsertRowid: info.lastInsertRowid };
  }
  return { lastInsertRowid: null };
}

export default db;

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use writeable directory path if running in serverless environment
let dbPath: string;

try {
  const localDb = path.join(process.cwd(), 'weekend_club.db');
  // Check if current directory is writeable
  fs.accessSync(process.cwd(), fs.constants.W_OK);
  dbPath = localDb;
} catch (e) {
  // Fallback to OS tmp folder for serverless environments
  dbPath = path.join('/tmp', 'weekend_club.db');
}

let db: InstanceType<typeof Database>;

try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error("Failed to connect to SQLite file DB, falling back to memory:", error);
  db = new Database(':memory:');
}

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'member',
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

  // Safe table migrations for existing database files
  try { db.exec("ALTER TABLE events ADD COLUMN ticket_price TEXT DEFAULT '1500'"); } catch (e) {}
  try { db.exec("ALTER TABLE events ADD COLUMN payment_info TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_screenshot TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_ref TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE registrations ADD COLUMN payment_status TEXT DEFAULT 'pending'"); } catch (e) {}

  // Seed default admin and member users if empty
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (email, password, name, phone, role) 
      VALUES (?, ?, ?, ?, ?)
    `);

    insertUser.run('admin@weekendclub.com', 'admin123', 'Organizer Admin', '+1 555 0192', 'admin');
    insertUser.run('member@weekendclub.com', 'member123', 'Weekend Member', '+1 555 0144', 'member');
  }

  // Clear mock events and seed real event with SadaPay details
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

export default db;

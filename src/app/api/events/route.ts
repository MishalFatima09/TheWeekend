import { NextResponse } from 'next/server';
import { initDb, queryAll, queryOne, execute } from '@/lib/db';

export async function GET(request: Request) {
  try {
    initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id DESC';

    const events = await queryAll(query, params);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { title, category, date, time, location, description, image_url, capacity, badge_text } = body;

    if (!title || !category || !date || !time || !location || !description || !image_url) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const result = await execute(`
      INSERT INTO events (title, category, date, time, location, description, image_url, capacity, registered_count, status, badge_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'upcoming', ?)
    `, [
      title,
      category,
      date,
      time,
      location,
      description,
      image_url,
      capacity || 30,
      badge_text || 'NEW'
    ]);

    let newEvent = null;
    if (result.lastInsertRowid) {
      newEvent = await queryOne('SELECT * FROM events WHERE id = ?', [result.lastInsertRowid]);
    } else {
      newEvent = await queryOne('SELECT * FROM events WHERE title = ? ORDER BY id DESC', [title]);
    }

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    initDb();
    const { id } = await params;
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    initDb();
    const { id } = await params;
    const body = await request.json();
    const { title, category, date, time, location, description, image_url, capacity, status, badge_text } = body;

    const stmt = db.prepare(`
      UPDATE events 
      SET title = COALESCE(?, title),
          category = COALESCE(?, category),
          date = COALESCE(?, date),
          time = COALESCE(?, time),
          location = COALESCE(?, location),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          capacity = COALESCE(?, capacity),
          status = COALESCE(?, status),
          badge_text = COALESCE(?, badge_text)
      WHERE id = ?
    `);

    stmt.run(title, category, date, time, location, description, image_url, capacity, status, badge_text, id);
    const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    initDb();
    const { id } = await params;
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
    db.prepare('DELETE FROM registrations WHERE event_id = ?').run(id);

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

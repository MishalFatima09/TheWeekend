import { NextResponse } from 'next/server';
import { initDb, queryOne, execute } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    initDb();
    const { id } = await params;
    const event = await queryOne('SELECT * FROM events WHERE id = ?', [id]);

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

    await execute(`
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
    `, [title, category, date, time, location, description, image_url, capacity, status, badge_text, id]);

    const updatedEvent = await queryOne('SELECT * FROM events WHERE id = ?', [id]);

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
    await execute('DELETE FROM events WHERE id = ?', [id]);
    await execute('DELETE FROM registrations WHERE event_id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

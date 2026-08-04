import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All contact fields are required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);

    stmt.run(name, email, subject, message);

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.' 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    initDb();
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Inquiry ID and status required' }, { status: 400 });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true, message: 'Inquiry updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

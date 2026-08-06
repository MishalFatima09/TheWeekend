import { NextResponse } from 'next/server';
import { initDb, queryAll, execute } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All contact fields are required' }, { status: 400 });
    }

    await execute(`
      INSERT INTO inquiries (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [name, email, subject, message]);

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
    const inquiries = await queryAll('SELECT * FROM inquiries ORDER BY id DESC');
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

    await execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'Inquiry updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

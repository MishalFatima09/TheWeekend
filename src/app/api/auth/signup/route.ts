import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, phone, role)
      VALUES (?, ?, ?, ?, 'member')
    `);

    const result = stmt.run(email, password, name, phone || '');
    const safeUser = {
      id: result.lastInsertRowid,
      email,
      name,
      phone: phone || '',
      role: 'member'
    };

    const response = NextResponse.json({ 
      success: true, 
      user: safeUser,
      message: 'Account created successfully! Welcome to the club.' 
    }, { status: 201 });

    response.cookies.set('weekend_user', JSON.stringify(safeUser), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

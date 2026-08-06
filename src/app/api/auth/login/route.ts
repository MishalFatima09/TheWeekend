import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@weekendclub.com').toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let user: any = null;

    if (cleanEmail === envAdminEmail && password === envAdminPassword) {
      user = {
        id: 1,
        email: envAdminEmail,
        name: 'Organizer Admin',
        phone: '+92 325 4204200',
        role: 'admin',
        email_verified: 1
      };
    } else {
      user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(cleanEmail, password) as any;
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.role !== 'admin' && user.email_verified === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your email has not been verified yet. Please check your email for the 6-digit verification code.' 
      }, { status: 403 });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      role: user.role
    };

    const response = NextResponse.json({ 
      success: true, 
      user: safeUser,
      message: `Welcome back, ${safeUser.name}!` 
    });

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

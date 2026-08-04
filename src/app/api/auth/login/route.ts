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

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Return safe user object (excluding raw password in response)
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role
    };

    const response = NextResponse.json({ 
      success: true, 
      user: safeUser,
      message: `Welcome back, ${user.name}!` 
    });

    // Set auth cookie
    response.cookies.set('weekend_user', JSON.stringify(safeUser), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

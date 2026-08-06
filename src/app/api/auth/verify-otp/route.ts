import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Email and verification code are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    if (user.email_verified === 1) {
      return NextResponse.json({ success: true, message: 'Account is already verified. You can sign in now.' });
    }

    if (!user.verification_code || user.verification_code !== cleanCode) {
      return NextResponse.json({ success: false, error: 'Invalid 6-digit verification code. Please check your email and try again.' }, { status: 400 });
    }

    // Check code expiration
    if (user.code_expires_at && new Date(user.code_expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Verification code has expired. Please request a new code.' }, { status: 400 });
    }

    // Mark email as verified and clear code
    db.prepare(`
      UPDATE users 
      SET email_verified = 1, verification_code = NULL, code_expires_at = NULL 
      WHERE id = ?
    `).run(user.id);

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
      message: 'Email verified successfully! Welcome to The Weekend Club.'
    });

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

import { NextResponse } from 'next/server';
import { initDb, queryOne, execute } from '@/lib/db';
import { sendVerificationOtpEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await queryOne('SELECT id, email_verified FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      if (existing.email_verified === 1) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists. Please sign in instead.' }, { status: 400 });
      } else {
        // Delete unverified stale account to allow fresh signup OTP
        await execute('DELETE FROM users WHERE id = ?', [existing.id]);
      }
    }

    // Generate random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

    await execute(`
      INSERT INTO users (email, password, name, phone, role, email_verified, verification_code, code_expires_at)
      VALUES (?, ?, ?, ?, 'member', 0, ?, ?)
    `, [cleanEmail, password, name, phone || '', otpCode, expiresAt]);

    // Dispatch verification OTP email asynchronously
    sendVerificationOtpEmail(cleanEmail, name, otpCode).catch(e => console.error("OTP send error:", e));

    return NextResponse.json({ 
      success: true, 
      requiresVerification: true,
      email: cleanEmail,
      message: `Verification code sent to ${cleanEmail}. Please enter the 6-digit code to complete sign up.` 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

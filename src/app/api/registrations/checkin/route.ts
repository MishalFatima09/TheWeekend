import { NextResponse } from 'next/server';
import { initDb, queryOne, execute } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { code, id } = body;

    if (!code && !id) {
      return NextResponse.json({ success: false, error: 'Ticket code or ID is required' }, { status: 400 });
    }

    let reg: any = null;
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      reg = await queryOne(`
        SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time, e.location as event_location
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE UPPER(r.ticket_code) = ?
      `, [cleanCode]);
    } else if (id) {
      reg = await queryOne(`
        SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time, e.location as event_location
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.id = ?
      `, [id]);
    }

    if (!reg) {
      return NextResponse.json({ success: false, error: 'Ticket pass not found in system.' }, { status: 404 });
    }

    if (reg.payment_status !== 'approved' && reg.status !== 'confirmed') {
      return NextResponse.json({ 
        success: false, 
        registration: reg,
        error: `UNPAID TICKET! Payment status is '${reg.payment_status}'. Approval required before entry.` 
      }, { status: 400 });
    }

    // CHECK IF TICKET WAS ALREADY USED / REDEEMED PREVIOUSLY
    if (reg.checked_in === 1) {
      return NextResponse.json({ 
        success: false, 
        alreadyCheckedIn: true,
        registration: reg,
        error: `⛔ DUPLICATE ENTRY DENIED! This ticket (${reg.ticket_code}) was ALREADY USED & REDEEMED at ${reg.checked_in_at || 'earlier tonight'}.` 
      }, { status: 409 });
    }

    // MARK TICKET AS CHECKED IN / USED AT THE DOOR
    const checkInTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    await execute(`
      UPDATE registrations 
      SET checked_in = 1, checked_in_at = ? 
      WHERE id = ?
    `, [checkInTime, reg.id]);

    reg.checked_in = 1;
    reg.checked_in_at = checkInTime;

    return NextResponse.json({
      success: true,
      registration: reg,
      message: `🟢 VALID TICKET PASS! Entry Granted for ${reg.attendee_name} (${reg.guest_count} seat(s)).`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

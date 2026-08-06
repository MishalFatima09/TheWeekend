import { NextResponse } from 'next/server';
import { initDb, queryOne, queryAll, execute } from '@/lib/db';
import { sendAdminPendingNotification, sendAttendeeConfirmationNotification } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { 
      event_id, 
      user_id, 
      attendee_name, 
      attendee_email, 
      attendee_phone, 
      guest_count, 
      payment_screenshot, 
      payment_ref, 
      notes 
    } = body;

    if (!event_id || !attendee_name || !attendee_email || !attendee_phone) {
      return NextResponse.json({ success: false, error: 'Missing required attendee details' }, { status: 400 });
    }

    if (!payment_screenshot) {
      return NextResponse.json({ success: false, error: 'Please upload your payment transfer screenshot' }, { status: 400 });
    }

    const seats = parseInt(guest_count || 1);

    // Fetch target event & check capacity
    const event = await queryOne('SELECT * FROM events WHERE id = ?', [event_id]);
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (event.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'This event has been cancelled' }, { status: 400 });
    }

    if (event.registered_count + seats > event.capacity) {
      return NextResponse.json({ 
        success: false, 
        error: `Sorry! Only ${Math.max(0, event.capacity - event.registered_count)} spots remaining for this event.` 
      }, { status: 400 });
    }

    // Generate unique retro ticket pass code e.g. WKD-8291-K4
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const ticket_code = `WKD-${randomCode}-${randomChar}${Math.floor(Math.random() * 9)}`;

    // Insert registration with payment_status = 'pending' and status = 'pending_approval'
    const result = await execute(`
      INSERT INTO registrations (
        event_id, user_id, ticket_code, attendee_name, attendee_email, attendee_phone, 
        guest_count, payment_screenshot, payment_ref, payment_status, notes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'pending_approval')
    `, [
      event_id, 
      user_id || null, 
      ticket_code, 
      attendee_name, 
      attendee_email, 
      attendee_phone, 
      seats, 
      payment_screenshot, 
      payment_ref || '', 
      notes || ''
    ]);

    let registration = null;
    if (result.lastInsertRowid) {
      registration = await queryOne(`
        SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time, e.location as event_location, e.category as event_category, e.ticket_price as event_price
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.id = ?
      `, [result.lastInsertRowid]);
    } else {
      registration = await queryOne(`
        SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time, e.location as event_location, e.category as event_category, e.ticket_price as event_price
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.ticket_code = ?
      `, [ticket_code]);
    }

    // Send email notification to Admin asynchronously
    if (registration) {
      sendAdminPendingNotification({
        ticket_code: registration.ticket_code,
        attendee_name: registration.attendee_name,
        attendee_email: registration.attendee_email,
        attendee_phone: registration.attendee_phone,
        guest_count: registration.guest_count,
        payment_ref: registration.payment_ref,
        event_title: registration.event_title
      }).catch(e => console.error("Admin notification mail error:", e));
    }

    return NextResponse.json({ 
      success: true, 
      registration,
      message: 'Payment screenshot submitted! Our organizers will verify your payment and approve your ticket pass.' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    initDb();
    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');
    const user_id = searchParams.get('user_id');
    const email = searchParams.get('email');
    const payment_status = searchParams.get('payment_status');

    let query = `
      SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time, e.location as event_location, e.category as event_category, e.ticket_price as event_price, e.image_url as event_image
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (event_id) {
      query += ' AND r.event_id = ?';
      params.push(event_id);
    }
    if (user_id) {
      query += ' AND r.user_id = ?';
      params.push(user_id);
    }
    if (email) {
      query += ' AND r.attendee_email = ?';
      params.push(email);
    }
    if (payment_status) {
      query += ' AND r.payment_status = ?';
      params.push(payment_status);
    }

    query += ' ORDER BY r.id DESC';

    const registrations = await queryAll(query, params);
    return NextResponse.json({ success: true, registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH API endpoint for Admin Approval / Rejection
export async function PATCH(request: Request) {
  try {
    initDb();
    const body = await request.json();
    const { id, action } = body; // action = 'approve' | 'reject'

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Registration ID and action required' }, { status: 400 });
    }

    const reg = await queryOne('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!reg) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await execute(`
        UPDATE registrations 
        SET payment_status = 'approved', status = 'confirmed' 
        WHERE id = ?
      `, [id]);

      // Increment registered_count on event
      const event = await queryOne('SELECT * FROM events WHERE id = ?', [reg.event_id]);
      if (event) {
        const newCount = event.registered_count + reg.guest_count;
        const isFull = newCount >= event.capacity;
        await execute('UPDATE events SET registered_count = ?, status = ? WHERE id = ?', [
          newCount,
          isFull ? 'full' : event.status,
          reg.event_id
        ]);
      }

      // Send confirmation email to Attendee asynchronously
      sendAttendeeConfirmationNotification({
        ticket_code: reg.ticket_code,
        attendee_name: reg.attendee_name,
        attendee_email: reg.attendee_email,
        guest_count: reg.guest_count,
        event_title: event ? event.title : 'Outdoor Cinema & Photobooth Night',
        event_date: event ? event.date : 'Sunday, Aug 9, 2026',
        event_time: event ? event.time : '7:00 PM Onwards',
        event_location: event ? event.location : 'La Kofe Cafe, Citrus City'
      }).catch(e => console.error("Attendee confirmation mail error:", e));

      return NextResponse.json({ success: true, message: 'Payment approved! Ticket pass issued and confirmation email sent to attendee.' });
    } else if (action === 'reject') {
      await execute(`
        UPDATE registrations 
        SET payment_status = 'rejected', status = 'rejected' 
        WHERE id = ?
      `, [id]);

      return NextResponse.json({ success: true, message: 'Registration rejected.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

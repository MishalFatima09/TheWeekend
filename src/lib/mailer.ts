import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const adminNotifyEmail = process.env.ADMIN_EMAIL || 'shajiaazhar8@gmail.com';

let transporter: nodemailer.Transporter | null = null;

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Send 6-Digit Email Verification OTP Code
 */
export async function sendVerificationOtpEmail(toEmail: string, name: string, otpCode: string) {
  const subject = `🔐 ${otpCode} is your Verification Code - The Weekend Club`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #F2D8D5; padding: 24px; color: #342224;">
      <div style="max-width: 520px; margin: 0 auto; background: #FAF0EE; border: 3px solid #5A3B38; border-radius: 24px; padding: 32px; box-shadow: 4px 4px 0px #5A3B38; text-align: center;">
        
        <div style="width: 48px; h-48px; background: #5A3B38; color: #FAF0EE; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 12px; padding: 10px;">
          WKD
        </div>

        <h2 style="font-size: 24px; color: #5A3B38; margin: 8px 0 12px 0;">
          Verify Your Email Address
        </h2>

        <p style="font-size: 14px; color: #342224; line-height: 1.5; margin-bottom: 20px;">
          Hi <strong>${name}</strong>, thank you for joining The Weekend Club! Please enter the 6-digit verification code below to activate your member account:
        </p>

        <div style="background: #F2D8D5; border: 2px solid #5A3B38; border-radius: 16px; padding: 18px; margin: 20px auto; max-width: 280px; letter-spacing: 8px; font-family: monospace; font-size: 32px; font-weight: bold; color: #5A3B38;">
          ${otpCode}
        </div>

        <p style="font-size: 12px; color: #7B5A58; margin-top: 16px;">
          This code is valid for 15 minutes. If you did not request this code, please ignore this email.
        </p>

        <div style="border-top: 1px border #D7B4A8; margin-top: 28px; padding-top: 16px; font-size: 11px; color: #7B5A58;">
          The Weekend Club • Contact: shajiaazhar8@gmail.com / 03254204200
        </div>

      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"The Weekend Club" <${smtpUser}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✅ OTP email sent to ${toEmail}.`);
    } catch (err) {
      console.error('❌ Failed to send OTP email:', err);
    }
  } else {
    console.log(`[EMAIL DISPATCH MOCK - VERIFICATION CODE]\nTo: ${toEmail}\nOTP Code: ${otpCode}`);
  }
}

/**
 * Send email notification to Admin when a new SadaPay payment is submitted
 */
export async function sendAdminPendingNotification(registration: {
  ticket_code: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  guest_count: number;
  payment_ref?: string;
  event_title: string;
}) {
  const subject = `📥 New Payment Approval Needed: ${registration.attendee_name} (${registration.ticket_code})`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #F2D8D5; padding: 24px; color: #342224;">
      <div style="max-width: 560px; margin: 0 auto; background: #FAF0EE; border: 3px solid #5A3B38; border-radius: 24px; padding: 32px; box-shadow: 4px 4px 0px #5A3B38;">
        
        <div style="display: inline-block; background: #D97706; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px;">
          Action Required • SadaPay Verification
        </div>

        <h2 style="font-size: 24px; color: #5A3B38; margin: 0 0 16px 0;">
          New Ticket Payment Submitted!
        </h2>

        <p style="font-size: 14px; line-height: 1.5; color: #342224;">
          <strong>${registration.attendee_name}</strong> has submitted a SadaPay payment screenshot for <strong>${registration.event_title}</strong>.
        </p>

        <div style="background: #F2D8D5; border: 2px solid #5A3B38; border-radius: 16px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <div style="margin-bottom: 8px;"><strong>Ticket Code:</strong> <span style="font-family: monospace; background: #5A3B38; color: #FAF0EE; padding: 2px 8px; border-radius: 12px;">${registration.ticket_code}</span></div>
          <div style="margin-bottom: 8px;"><strong>Attendee Name:</strong> ${registration.attendee_name}</div>
          <div style="margin-bottom: 8px;"><strong>Attendee Email:</strong> ${registration.attendee_email}</div>
          <div style="margin-bottom: 8px;"><strong>Attendee Phone:</strong> ${registration.attendee_phone}</div>
          <div style="margin-bottom: 8px;"><strong>Seats Requested:</strong> ${registration.guest_count} spot(s)</div>
          <div style="margin-bottom: 8px;"><strong>Total Payable:</strong> Rs. ${1500 * registration.guest_count}</div>
          ${registration.payment_ref ? `<div><strong>Sender / Ref:</strong> ${registration.payment_ref}</div>` : ''}
        </div>

        <p style="font-size: 13px; color: #7B5A58;">
          Please log into your Admin Dashboard to preview the payment screenshot and approve the ticket pass.
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="display: inline-block; background: #5A3B38; color: #FAF0EE; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 14px;">
            Open Admin Dashboard
          </a>
        </div>

      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"The Weekend Club" <${smtpUser}>`,
        to: adminNotifyEmail,
        subject,
        html,
      });
      console.log('✅ Admin notification email sent successfully.');
    } catch (err) {
      console.error('❌ Failed to send admin email:', err);
    }
  } else {
    console.log(`[EMAIL DISPATCH MOCK - ADMIN PENDING]\nTo: ${adminNotifyEmail}\nSubject: ${subject}`);
  }
}

/**
 * Send email notification to Attendee when their ticket has been approved
 */
export async function sendAttendeeConfirmationNotification(registration: {
  ticket_code: string;
  attendee_name: string;
  attendee_email: string;
  guest_count: number;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
}) {
  const subject = `🎉 Ticket Pass Confirmed! - ${registration.event_title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #F2D8D5; padding: 24px; color: #342224;">
      <div style="max-width: 560px; margin: 0 auto; background: #FAF0EE; border: 3px solid #5A3B38; border-radius: 24px; padding: 32px; box-shadow: 4px 4px 0px #5A3B38;">
        
        <div style="display: inline-block; background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px;">
          ✓ Payment Verified • Ticket Pass Issued
        </div>

        <h2 style="font-size: 26px; color: #5A3B38; margin: 0 0 16px 0;">
          See You At The Cinema! 🍿
        </h2>

        <p style="font-size: 14px; line-height: 1.5; color: #342224;">
          Hi <strong>${registration.attendee_name}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.5; color: #342224;">
          Great news! Your SadaPay payment screenshot has been verified by our organizers, and your official collectible ticket pass is now active.
        </p>

        <div style="background: #F2D8D5; border: 2px dashed #5A3B38; border-radius: 16px; padding: 20px; margin: 20px 0; font-size: 13px;">
          <div style="font-size: 18px; font-weight: bold; color: #5A3B38; margin-bottom: 12px;">
            ${registration.event_title}
          </div>
          <div style="margin-bottom: 8px;">🎟️ <strong>Ticket Code:</strong> <span style="font-family: monospace; background: #5A3B38; color: #FAF0EE; padding: 3px 10px; border-radius: 12px; font-size: 14px;">${registration.ticket_code}</span></div>
          <div style="margin-bottom: 8px;">📅 <strong>Date & Time:</strong> ${registration.event_date} (${registration.event_time})</div>
          <div style="margin-bottom: 8px;">📍 <strong>Venue:</strong> ${registration.event_location}</div>
          <div>👤 <strong>Seats Reserved:</strong> ${registration.guest_count} spot(s)</div>
        </div>

        <p style="font-size: 13px; color: #7B5A58; line-height: 1.5;">
          You can view, print, or download your official ticket stub anytime on our website using your email address (<strong>${registration.attendee_email}</strong>).
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-tickets" style="display: inline-block; background: #5A3B38; color: #FAF0EE; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: bold; font-size: 14px;">
            View & Print Ticket Pass
          </a>
        </div>

        <div style="border-top: 1px border #D7B4A8; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 11px; color: #7B5A58;">
          The Weekend Club • Contact: shajiaazhar8@gmail.com / 03254204200
        </div>

      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"The Weekend Club" <${smtpUser}>`,
        to: registration.attendee_email,
        subject,
        html,
      });
      console.log(`✅ Attendee confirmation email sent to ${registration.attendee_email}.`);
    } catch (err) {
      console.error('❌ Failed to send attendee email:', err);
    }
  } else {
    console.log(`[EMAIL DISPATCH MOCK - ATTENDEE CONFIRMED]\nTo: ${registration.attendee_email}\nSubject: ${subject}`);
  }
}

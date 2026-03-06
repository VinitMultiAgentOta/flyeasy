import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import sql from 'mssql';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });
    }

    const db = await getDb();
    const request = new sql.Request(db);
    request.input('bookingId', sql.NVarChar, bookingId);

    // Fetch booking + passenger + flight details
    const result = await request.query(`
      SELECT
        b.Id AS bookingId,
        b.PNR,
        b.ContactEmail,
        b.ContactPhone,
        b.TotalFare,
        b.Currency,
        b.TripType,
        t.Id AS ticketId
      FROM Bookings b
      LEFT JOIN Tickets t ON t.BookingId = b.Id
      WHERE b.Id = @bookingId
    `);

    if (!result.recordset.length) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = result.recordset[0];

    // Send e-ticket email
    await transporter.sendMail({
      from: `"FlyEasy" <${process.env.SMTP_USER}>`,
      to: booking.ContactEmail,
      subject: `Your FlyEasy Booking Confirmed - PNR: ${booking.PNR}`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Dear Traveller,</p>
        <p>Your booking has been confirmed. Here are your details:</p>
        <table>
          <tr><td><strong>PNR</strong></td><td>${booking.PNR}</td></tr>
          <tr><td><strong>Booking ID</strong></td><td>${booking.bookingId}</td></tr>
          <tr><td><strong>Total Fare</strong></td><td>${booking.Currency} ${booking.TotalFare}</td></tr>
          <tr><td><strong>Trip Type</strong></td><td>${booking.TripType}</td></tr>
        </table>
        <p>Thank you for choosing FlyEasy!</p>
      `,
    });

    // Mark ticket email as sent
    const updateReq = new sql.Request(db);
    updateReq.input('bookingId', sql.NVarChar, bookingId);
    await updateReq.query(`
      UPDATE Tickets SET EmailSentAt = GETUTCDATE()
      WHERE BookingId = @bookingId AND EmailSentAt IS NULL
    `);

    return NextResponse.json({ success: true, pnr: booking.PNR }, { status: 200 });
  } catch (err: any) {
    console.error('[/api/notifications/ticket]', err?.message);
    return NextResponse.json({ error: 'Failed to send ticket notification' }, { status: 500 });
  }
}

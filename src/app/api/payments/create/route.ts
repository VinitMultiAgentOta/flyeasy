import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/db';
import sql from 'mssql';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { bookingId, amount, currency = 'INR' } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'bookingId and amount are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: bookingId,
      notes: { bookingId },
    });

    // Persist payment record
    const db = await getDb();
    const request = new sql.Request(db);
    request.input('orderId', sql.NVarChar, order.id);
    request.input('bookingId', sql.NVarChar, bookingId);
    request.input('amount', sql.Decimal(12, 2), amount);
    request.input('currency', sql.NVarChar, currency);
    await request.query(`
      INSERT INTO Payments (Id, BookingId, Amount, Currency, PaymentStatus)
      VALUES (@orderId, @bookingId, @amount, @currency, 'PENDING')
    `);

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[/api/payments/create]', err?.message);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

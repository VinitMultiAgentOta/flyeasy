// src/app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } =
      await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      return NextResponse.json(
        { error: 'razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId required' },
        { status: 400 }
      );
    }

    // HMAC SHA256 signature verification - never log card data
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpaySignature, 'hex')
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update payment status
    const db = await getDb();
    const request = new sql.Request(db);
    request.input('orderId', sql.NVarChar, razorpayOrderId);
    request.input('paymentId', sql.NVarChar, razorpayPaymentId);
    await request.query(`
      UPDATE Payments SET PaymentStatus = 'SUCCESS', RazorpayPaymentId = @paymentId
      WHERE Id = @orderId
    `);

    // Trigger ticket notification asynchronously
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    }).catch(console.error);

    return NextResponse.json(
      { paymentId: razorpayPaymentId, status: 'SUCCESS' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[/api/payments/verify]', err?.message);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}

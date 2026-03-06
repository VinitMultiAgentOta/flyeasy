// src/app/api/bookings/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/amadeus';
import { getDb } from '@/lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, passengers, contactEmail, contactPhone } = body;

    if (!offerId || !passengers?.length || !contactEmail) {
      return NextResponse.json(
        { error: 'offerId, passengers and contactEmail are required' },
        { status: 400 }
      );
    }

    // Create booking via Amadeus
    const amadeusPassengers = passengers.map((p: any, idx: number) => ({
      id: String(idx + 1),
      name: { firstName: p.firstName, lastName: p.lastName },
      dateOfBirth: p.dateOfBirth,
      gender: p.title === 'MRS' || p.title === 'MS' ? 'FEMALE' : 'MALE',
      contact: {
        emailAddress: contactEmail,
        phones: [{ number: contactPhone, deviceType: 'MOBILE', countryCallingCode: '91' }],
      },
      documents: [{
        number: p.passportNumber,
        issuanceCountry: p.nationality,
        nationality: p.nationality,
        expiryDate: '2030-01-01',
        documentType: 'PASSPORT' as const,
      }],
    }));

    const { pnr, bookingId } = await createOrder({ offerId, passengers: amadeusPassengers });

    // Persist to SQL Server
    const db = await getDb();
    const request = new sql.Request(db);
    request.input('bookingId', sql.NVarChar, bookingId);
    request.input('pnr', sql.NVarChar, pnr);
    request.input('offerId', sql.NVarChar, offerId);
    request.input('contactEmail', sql.NVarChar, contactEmail);
    request.input('contactPhone', sql.NVarChar, contactPhone);
    request.input('status', sql.NVarChar, 'CONFIRMED');
    await request.query(`
      INSERT INTO Bookings (Id, PNR, OfferId, ContactEmail, ContactPhone, BookingStatus)
      VALUES (@bookingId, @pnr, @offerId, @contactEmail, @contactPhone, @status)
    `);

    for (const p of passengers) {
      const pReq = new sql.Request(db);
      pReq.input('bookingId', sql.NVarChar, bookingId);
      pReq.input('name', sql.NVarChar, `${p.firstName} ${p.lastName}`);
      pReq.input('dob', sql.Date, p.dateOfBirth);
      pReq.input('nationality', sql.NVarChar, p.nationality);
      await pReq.query(`
        INSERT INTO Passengers (BookingId, Name, DateOfBirth, Nationality)
        VALUES (@bookingId, @name, @dob, @nationality)
      `);
    }

    return NextResponse.json({ pnr, bookingId }, { status: 201 });
  } catch (err: any) {
    console.error('[/api/bookings/create]', err?.message);
    if (err?.message?.includes('seat sold')) {
      return NextResponse.json({ error: 'Selected seat is no longer available' }, { status: 409 });
    }
    if (err?.message?.includes('fare changed')) {
      return NextResponse.json({ error: 'Fare has changed. Please re-search' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}

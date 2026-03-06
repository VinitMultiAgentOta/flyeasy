// src/app/api/flights/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';
import { FlightSearchParams } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: FlightSearchParams = await req.json();

    // Input validation
    if (!body.origin || !body.destination || !body.departDate) {
      return NextResponse.json(
        { error: 'origin, destination and departDate are required' },
        { status: 400 }
      );
    }

    if (!body.passengers || body.passengers.adult < 1) {
      return NextResponse.json(
        { error: 'At least 1 adult passenger required' },
        { status: 400 }
      );
    }

    const cabinMap: Record<string, 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'> = {
      economy: 'ECONOMY',
      premium_economy: 'PREMIUM_ECONOMY',
      business: 'BUSINESS',
      first: 'FIRST',
    };

    const results = await searchFlights({
      origin: body.origin.iataCode,
      destination: body.destination.iataCode,
      departDate: body.departDate,
      returnDate: body.returnDate ?? undefined,
      adults: body.passengers.adult,
      children: body.passengers.child,
      infants: body.passengers.infant,
      cabinClass: cabinMap[body.cabinClass] ?? 'ECONOMY',
      tripType: body.tripType,
    });

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (err: any) {
    console.error('[/api/flights/search]', err?.message);

    if (err?.message === 'Amadeus down') {
      return NextResponse.json({ error: 'Flight search service unavailable' }, { status: 503 });
    }
    if (err?.message === 'invalid airports') {
      return NextResponse.json({ error: 'Invalid origin or destination airport code' }, { status: 400 });
    }
    if (err?.message === 'no results') {
      return NextResponse.json({ error: 'No flights found for this route and date' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

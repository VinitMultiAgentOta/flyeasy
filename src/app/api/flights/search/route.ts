import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';

// Accepts BOTH flat format (from UI) and nested format (legacy)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Normalise field names ─────────────────────────────────────────
    // UI sends:  origin, destination, departureDate, returnDate, adults,
    //            children, infants, travelClass, tripType
    // Legacy sends: origin.iataCode, destination.iataCode, departDate,
    //               passengers.adult, cabinClass

    const originCode: string =
      typeof body.origin === 'string'
        ? body.origin.trim().toUpperCase()
        : (body.origin?.iataCode ?? '').trim().toUpperCase();

    const destCode: string =
      typeof body.destination === 'string'
        ? body.destination.trim().toUpperCase()
        : (body.destination?.iataCode ?? '').trim().toUpperCase();

    const departDate: string =
      body.departureDate ??
      body.departDate ??
      body.depart ??
      '';

    const returnDate: string | undefined =
      body.returnDate ??
      body.return ??
      undefined;

    const adults: number =
      body.adults ??
      body.passengers?.adult ??
      1;

    const children: number =
      body.children ??
      body.passengers?.child ??
      0;

    const infants: number =
      body.infants ??
      body.passengers?.infant ??
      0;

    const cabinRaw: string =
      body.travelClass ??
      body.cabinClass ??
      body.cabin ??
      'ECONOMY';

    const cabinMap: Record<string, 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'> = {
      economy:         'ECONOMY',
      ECONOMY:         'ECONOMY',
      premium_economy: 'PREMIUM_ECONOMY',
      PREMIUM_ECONOMY: 'PREMIUM_ECONOMY',
      business:        'BUSINESS',
      BUSINESS:        'BUSINESS',
      first:           'FIRST',
      FIRST:           'FIRST',
    };
    const cabinClass = cabinMap[cabinRaw] ?? 'ECONOMY';

      const tripType: 'round_trip' | 'one_way' | 'multi_city' = (body.tripType ?? 'one_way') as 'round_trip' | 'one_way' | 'multi_city';

    // ── Validation ───────────────────────────────────────────────────
    if (!originCode || !destCode || !departDate) {
      return NextResponse.json(
        { error: `origin, destination and departureDate are required. Received: origin=${originCode}, destination=${destCode}, departureDate=${departDate}` },
        { status: 400 }
      );
    }

    if (!adults || Number(adults) < 1) {
      return NextResponse.json(
        { error: 'At least 1 adult passenger required' },
        { status: 400 }
      );
    }

    // ── Call Amadeus ─────────────────────────────────────────────────
    const results = await searchFlights({
      origin:      originCode,
      destination: destCode,
      departDate,
      returnDate:  tripType === 'round_trip' ? returnDate : undefined,
      adults:      Number(adults),
      children:    Number(children),
      infants:     Number(infants),
      cabinClass,
      tripType,
    });

    return NextResponse.json({ offers: results }, { status: 200 });

  } catch (err: any) {
    console.error('[/api/flights/search]', err?.message);

    if (err?.message?.includes('Amadeus') || err?.message?.includes('down')) {
      return NextResponse.json(
        { error: 'Flight search service unavailable. Please try again.' },
        { status: 503 }
      );
    }
    if (err?.message === 'invalid airports') {
      return NextResponse.json(
        { error: 'Invalid origin or destination airport code' },
        { status: 400 }
      );
    }
    if (err?.message === 'no results') {
      return NextResponse.json(
        { offers: [], error: 'No flights found for this route and date' },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: `Internal server error: ${err?.message}` },
      { status: 500 }
    );
  }
}

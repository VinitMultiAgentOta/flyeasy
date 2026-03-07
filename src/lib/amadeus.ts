// src/lib/amadeus.ts
// Typed Amadeus SDK wrapper - server-side only
import Amadeus from 'amadeus-ts';
import { FlightOffer, FlightSegment, StopDetail, FareBreakdown, BaggageInfo } from '@/types';

const amadeusClient = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
  hostname: process.env.NODE_ENV === 'production' ? 'production' : 'test',
});

export interface AmadeusSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  tripType: 'one_way' | 'round_trip' | 'multi_city';
}

export interface AmadeusBookingParams {
  offerId: string;
  passengers: {
    id: string;
    name: { firstName: string; lastName: string };
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE';
    contact: { emailAddress: string; phones: { number: string }[] };
    documents: { number: string; issuanceCountry: string; nationality: string; expiryDate: string; documentType: 'PASSPORT' }[];
  }[];
}

// Search flights and return typed FlightOffer[]
export async function searchFlights(params: AmadeusSearchParams): Promise<FlightOffer[]> {
  try {
    const response = await amadeusClient.shopping.flightOffersSearch.get({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departDate,
      ...(params.returnDate && { returnDate: params.returnDate }),
      adults: params.adults,
      children: params.children ?? 0,
      infants: params.infants ?? 0,
      travelClass: params.cabinClass,
      max: 20,
      currencyCode: 'INR',
    });

    return (response.data as any[]).map(mapAmadeusOffer);
  } catch (err: any) {
    if (err?.response?.statusCode === 503) throw new Error('Amadeus down');
    if (err?.response?.result?.errors?.[0]?.code === 32171) throw new Error('invalid airports');
    throw err;
  }
}

// Confirm price still valid before booking
export async function priceFlightOffer(offerId: string): Promise<{ offer: FlightOffer; fareBreakdown: FareBreakdown; baggage: BaggageInfo }> {
  const response = await amadeusClient.shopping.flightOffers.pricing.post(
    { data: { type: 'flight-offers-pricing', flightOffers: [{ id: offerId }] } }  );
  const raw = response.data.flightOffers[0];
  return {
    offer: mapAmadeusOffer(raw),
    fareBreakdown: {
      baseFare: parseFloat(raw.price.base),
      taxes: parseFloat(raw.price.taxes?.reduce((a: number, t: any) => a + parseFloat(t.amount), 0) ?? 0),
      fees: parseFloat(raw.price.fees?.reduce((a: number, f: any) => a + parseFloat(f.amount), 0) ?? 0),
      total: parseFloat(raw.price.total),
    },
    baggage: {
      carryOn: raw.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity ?? 0,
      checked: raw.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight ?? 0,
    },
  };
}

// Create order and get PNR
export async function createOrder(params: AmadeusBookingParams): Promise<{ pnr: string; bookingId: string }> {
  const response = await amadeusClient.booking.flightOrders.post(
        {
      data: {
        type: 'flight-order',
        flightOffers: [{ id: params.offerId }],
        travelers: params.passengers,
      },
    }
  );
  const order = response.data;
  return {
    pnr: order.associatedRecords?.[0]?.reference ?? order.id,
    bookingId: order.id,
  };
}

// Map raw Amadeus offer to typed FlightOffer
function mapAmadeusOffer(raw: any): FlightOffer {
  const itinerary = raw.itineraries?.[0];
  const firstSeg = itinerary?.segments?.[0];
  const lastSeg = itinerary?.segments?.slice(-1)[0];

  const segments: FlightSegment[] = (itinerary?.segments ?? []).map((seg: any) => ({
    id: seg.id,
    departure: seg.departure.iataCode,
    arrival: seg.arrival.iataCode,
    departureTime: seg.departure.at,
    arrivalTime: seg.arrival.at,
    duration: seg.duration,
    stops: seg.stops?.map((stop: any): StopDetail => ({
      id: stop.iataCode,
      airport: stop.iataCode,
      arrivalTime: stop.arrivalAt,
      departureTime: stop.departureAt,
    })) ?? [],
  }));

  return {
    id: raw.id,
    airline: firstSeg?.carrierCode ?? '',
    departure: firstSeg?.departure?.iataCode ?? '',
    arrival: lastSeg?.arrival?.iataCode ?? '',
    departureTime: firstSeg?.departure?.at ?? '',
    arrivalTime: lastSeg?.arrival?.at ?? '',
    duration: itinerary?.duration ?? '',
    price: parseFloat(raw.price?.total ?? '0'),
    currency: raw.price?.currency ?? 'INR',
    availability: raw.numberOfBookableSeats?.toString() ?? '9',
    flightSegments: segments,
  };
}

export default amadeusClient;

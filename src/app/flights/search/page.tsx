'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ── FlightOffer matches the shape returned by src/lib/amadeus.ts mapAmadeusOffer
interface FlightSegment {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: { id: string; airport: string; arrivalTime: string; departureTime: string }[];
}

interface FlightOffer {
  id: string;
  airline: string;          // carrierCode of first segment
  departure: string;        // origin IATA
  arrival: string;          // destination IATA
  departureTime: string;    // ISO datetime
  arrivalTime: string;      // ISO datetime
  duration: string;         // ISO 8601 duration e.g. PT2H30M
  price: number;            // total fare as number
  currency: string;
  availability: string;     // seats left as string
  flightSegments: FlightSegment[];
}

// ── Helpers
function formatTime(dateStr: string) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function formatDuration(iso: string) {
  if (!iso) return '--';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const h = match?.[1] ?? '0';
  const m = match?.[2] ?? '0';
  return `${h}h ${m}m`;
}

// ── Flight Card
function FlightCard({ offer, onSelect }: { offer: FlightOffer; onSelect: () => void }) {
  const stops = Math.max(0, offer.flightSegments.length - 1);
  const currencySymbol = offer.currency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow">
      {/* Airline */}
      <div className="flex items-center gap-3 min-w-[130px]">
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
          {offer.airline || 'FL'}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{offer.airline}</p>
          <p className="text-xs text-gray-400">{offer.availability} seats left</p>
        </div>
      </div>

      {/* Route timeline */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{formatTime(offer.departureTime)}</p>
          <p className="text-sm font-medium text-gray-600">{offer.departure}</p>
        </div>
        <div className="text-center flex-1 min-w-[80px]">
          <p className="text-xs text-gray-400 mb-1">{formatDuration(offer.duration)}</p>
          <div className="flex items-center gap-1">
            <div className="h-px flex-1 bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{formatTime(offer.arrivalTime)}</p>
          <p className="text-sm font-medium text-gray-600">{offer.arrival}</p>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="text-center md:text-right min-w-[120px]">
        <p className="text-2xl font-bold text-blue-600">
          {currencySymbol}{Number(offer.price).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-400 mb-2">per person</p>
        <button
          onClick={onSelect}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors w-full"
        >
          Select
        </button>
      </div>
    </div>
  );
}

// ── Skeleton
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse flex gap-4">
      <div className="w-11 h-11 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-28 space-y-2">
        <div className="h-7 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ── Main Component
function SearchResults() {
  const params  = useSearchParams();
  const router  = useRouter();
  const [offers,  setOffers]  = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [sortBy,  setSortBy]  = useState<'price' | 'duration'>('price');

  const origin   = params.get('origin')   ?? '';
  const dest     = params.get('dest')     ?? '';
  const depart   = params.get('depart')   ?? '';
  const returnD  = params.get('return')   ?? '';
  const adults   = params.get('adults')   ?? '1';
  const children = params.get('children') ?? '0';
  const infants  = params.get('infants')  ?? '0';
  const cabin    = params.get('cabin')    ?? 'economy';
  const tripType = params.get('tripType') ?? 'one_way';

  useEffect(() => {
    if (!origin || !dest || !depart) {
      setError('Missing search parameters. Please search again.');
      setLoading(false);
      return;
    }

    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const body: Record<string, unknown> = {
          origin,
          destination: dest,           // API expects 'destination'
          departureDate: depart,       // API expects 'departureDate'
          adults:    Number(adults),
          children:  Number(children),
          infants:   Number(infants),
          travelClass: cabin.toUpperCase(),
          tripType,
        };
        if (tripType === 'round_trip' && returnD) {
          body.returnDate = returnD;
        }

        const res  = await fetch('/api/flights/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `API error ${res.status}`);
        setOffers(data.offers ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, dest, depart, returnD, adults, children, infants, cabin, tripType]);

  const sorted = [...offers].sort((a, b) => {
    if (sortBy === 'price') return Number(a.price) - Number(b.price);
    return (a.duration ?? '').localeCompare(b.duration ?? '');
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight">✈ FlyEasy</Link>
          <p className="text-sm opacity-80">
            {origin} → {dest}
            &nbsp;│&nbsp;{depart}{tripType === 'round_trip' && returnD ? ` – ${returnD}` : ''}
            &nbsp;│&nbsp;{adults} Adult{Number(adults) > 1 ? 's' : ''}
            &nbsp;│&nbsp;{cabin.charAt(0).toUpperCase() + cabin.slice(1)}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Sort controls */}
        {!loading && !error && offers.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-700 font-medium">
              {sorted.length} flight{sorted.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              {(['price', 'duration'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                    sortBy === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">Search Failed</p>
            <p className="text-red-500 text-sm mb-5">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
            >
              Back to Search
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && offers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-gray-700 font-semibold text-lg mb-1">No flights found</p>
            <p className="text-gray-400 text-sm mb-5">Try different dates or airports</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
            >
              Modify Search
            </button>
          </div>
        )}

        {/* Results list */}
        {!loading && !error && sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map(offer => (
              <FlightCard
                key={offer.id}
                offer={offer}
                onSelect={() =>
                  router.push(
                    `/flights/book?offerId=${offer.id}&origin=${origin}&dest=${dest}` +
                    `&depart=${depart}&adults=${adults}&cabin=${cabin}&price=${offer.price}&currency=${offer.currency}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlightSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">✈️</p>
          <p className="text-gray-500 text-lg">Searching for flights...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────
interface FlightOffer {
  id: string;
  price: { total: string; currency: string };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival:   { iataCode: string; at: string };
      carrierCode: string;
      number: string;
      numberOfStops: number;
    }>;
  }>;
  numberOfBookableSeats: number;
}

// ── Helpers ────────────────────────────────────────────────
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function formatDuration(iso: string) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const h = match?.[1] ?? '0';
  const m = match?.[2] ?? '0';
  return `${h}h ${m}m`;
}

// ── Flight Card ────────────────────────────────────────────
function FlightCard({ offer, onSelect }: { offer: FlightOffer; onSelect: () => void }) {
  const seg     = offer.itineraries[0].segments;
  const first   = seg[0];
  const last    = seg[seg.length - 1];
  const stops   = seg.length - 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow">
      {/* Airline */}
      <div className="flex items-center gap-3 min-w-[120px]">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
          {first.carrierCode}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{first.carrierCode} {first.number}</p>
          <p className="text-xs text-gray-400">{offer.numberOfBookableSeats} seats left</p>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{formatTime(first.departure.at)}</p>
          <p className="text-sm text-gray-500">{first.departure.iataCode}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-gray-400">{formatDuration(offer.itineraries[0].duration)}</p>
          <div className="flex items-center gap-1 my-1">
            <div className="h-px flex-1 bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <p className="text-xs text-gray-400">
            {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{formatTime(last.arrival.at)}</p>
          <p className="text-sm text-gray-500">{last.arrival.iataCode}</p>
        </div>
      </div>

      {/* Price */}
      <div className="text-center md:text-right">
        <p className="text-2xl font-bold text-blue-600">
          {offer.price.currency === 'INR' ? '₹' : '$'}
          {Number(offer.price.total).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-400 mb-2">per person</p>
        <button
          onClick={onSelect}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Select
        </button>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse flex gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-24 space-y-2">
        <div className="h-6 bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ── Main Search Results Page ───────────────────────────────
function SearchResults() {
  const params   = useSearchParams();
  const router   = useRouter();
  const [offers, setOffers]   = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [sortBy, setSortBy]   = useState<'price' | 'duration'>('price');

  const origin    = params.get('origin')    ?? '';
  const dest      = params.get('dest')      ?? '';
  const depart    = params.get('depart')    ?? '';
  const returnD   = params.get('return')    ?? '';
  const adults    = params.get('adults')    ?? '1';
  const children  = params.get('children')  ?? '0';
  const infants   = params.get('infants')   ?? '0';
  const cabin     = params.get('cabin')     ?? 'economy';
  const tripType  = params.get('tripType')  ?? 'one_way';

  useEffect(() => {
    if (!origin || !dest || !depart) {
      setError('Missing search parameters. Please go back and search again.');
      setLoading(false);
      return;
    }

    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const body: Record<string, unknown> = {
          origin, destination: dest, departureDate: depart,
          adults: Number(adults), children: Number(children),
          infants: Number(infants), travelClass: cabin.toUpperCase(),
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
        if (!res.ok) throw new Error(data.error ?? 'Search failed');
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
    if (sortBy === 'price') return Number(a.price.total) - Number(b.price.total);
    const da = a.itineraries[0].duration;
    const db = b.itineraries[0].duration;
    return da.localeCompare(db);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-blue-700 text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">✈ FlyEasy</Link>
          <div className="text-sm opacity-80">
            {origin} → {dest} &nbsp;|&nbsp; {depart}
            {tripType === 'round_trip' && returnD ? ` - ${returnD}` : ''}
            &nbsp;|&nbsp; {adults} Adult{Number(adults) > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Sort bar */}
        {!loading && !error && offers.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">
              {sorted.length} flight{sorted.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button
                onClick={() => setSortBy('price')}
                className={`text-sm px-3 py-1 rounded-full border ${
                  sortBy === 'price'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('duration')}
                className={`text-sm px-3 py-1 rounded-full border ${
                  sortBy === 'duration'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                Duration
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">Search Failed</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Back to Search
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && offers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-4xl mb-3">✈️</p>
            <p className="text-gray-700 font-semibold text-lg mb-1">No flights found</p>
            <p className="text-gray-400 text-sm mb-4">Try different dates or airports</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Modify Search
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map(offer => (
              <FlightCard
                key={offer.id}
                offer={offer}
                onSelect={() =>
                  router.push(`/flights/book?offerId=${offer.id}&origin=${origin}&dest=${dest}&depart=${depart}&adults=${adults}&cabin=${cabin}`)
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
        <p className="text-gray-500 text-lg">Loading search results...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}

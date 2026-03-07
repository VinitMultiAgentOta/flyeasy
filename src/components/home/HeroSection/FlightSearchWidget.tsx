'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, Search, Plane } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import { AirportInput } from '@/components/ui/AirportInput';
import { PassengerSelector } from '@/components/ui/PassengerSelector';
import type { TripType } from '@/types';
import { cn } from '@/lib/cn';

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: 'round_trip', label: 'Round Trip' },
  { value: 'one_way',    label: 'One Way'    },
  { value: 'multi_city', label: 'Multi-City' },
];

export function FlightSearchWidget() {
  const router = useRouter();
  const { flightSearch, updateFlightSearch, swapFlightLocations } = useSearchStore();

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const {
      origin,
      destination,
      departDate,
      returnDate,
      tripType,
      passengers,
      cabinClass,
    } = flightSearch;

    if (!origin || !destination) {
      alert('Please select origin and destination airports.');
      return;
    }
    if (!departDate) {
      alert('Please select a departure date.');
      return;
    }

    const params = new URLSearchParams({
      tripType,
      origin:   origin.iataCode,
      dest:     destination.iataCode,
      depart:   departDate,
      ...(tripType === 'round_trip' && returnDate ? { return: returnDate } : {}),
      adults:   String(passengers.adult),
      children: String(passengers.child),
      infants:  String(passengers.infant),
      cabin:    cabinClass,
    });

    router.push(`/flights/search?${params.toString()}`);
  }, [flightSearch, router]);

  return (
    <form onSubmit={handleSearch} noValidate>
      {/* Trip type tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {TRIP_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => updateFlightSearch({ tripType: t.value })}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border'
            )}
            style={
              flightSearch.tripType === t.value
                ? { backgroundColor: '#004D9F', color: '#FFFFFF', borderColor: '#004D9F' }
                : { backgroundColor: '#FFFFFF', color: '#4A5568', borderColor: '#DDE3ED' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Origin / Destination row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative mb-4 sm:items-end">
        <AirportInput
          label="From"
          placeholder="City or Airport"
          value={flightSearch.origin}
          onChange={(v) => updateFlightSearch({ origin: v })}
          icon={<Plane size={16} className="-rotate-45" aria-hidden />}
        />

        {/* Swap button */}
        <button
          type="button"
          onClick={swapFlightLocations}
          className="absolute hidden sm:flex w-8 h-8 rounded-full border-2 bg-white items-center justify-center hover:scale-110 transition-all shadow-md z-10"
          style={{
            borderColor: '#004D9F',
            color:       '#004D9F',
            left:        'calc(50% - 16px)',
            top:         '44px',
            transform:   'translateY(-40%)',
          }}  
          aria-label="Swap origin and destination"
        >
          <ArrowLeftRight size={13} aria-hidden />
        </button>


        <AirportInput
          label="To"
          placeholder="City or Airport"
          value={flightSearch.destination}
          onChange={(v) => updateFlightSearch({ destination: v })}
          icon={<Plane size={16} className="rotate-45" aria-hidden />}
        />
      </div>

      {/* Dates row */}
      <div
        className={cn(
          'grid gap-3 mb-4',
          flightSearch.tripType === 'round_trip'
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1'
        )}
      >
        {/* Departure */}
        <div>
          <label
            className="block text-xs font-semibold mb-1.5"
            style={{ color: '#4A5568' }}
          >
            Departure Date
          </label>
          <input
            type="date"
            min={today}
            value={flightSearch.departDate ?? ''}
            onChange={(e) =>
              updateFlightSearch({ departDate: e.target.value || null })
            }
            className="search-input text-sm"
            aria-label="Departure date"
          />
        </div>

        {/* Return — only round trip */}
        {flightSearch.tripType === 'round_trip' && (
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: '#4A5568' }}
            >
              Return Date
            </label>
            <input
              type="date"
              min={flightSearch.departDate ?? today}
              value={flightSearch.returnDate ?? ''}
              onChange={(e) =>
                updateFlightSearch({ returnDate: e.target.value || null })
              }
              className="search-input text-sm"
              aria-label="Return date"
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="mb-5">
        <PassengerSelector
          passengers={flightSearch.passengers}
          cabinClass={flightSearch.cabinClass}
          onPassengersChange={(p) => updateFlightSearch({ passengers: p })}
          onCabinChange={(c) => updateFlightSearch({ cabinClass: c })}
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className={cn(
          'w-full py-4 rounded-xl font-heading font-bold text-white text-lg',
          'flex items-center justify-center gap-3',
          'transition-all duration-200 hover:opacity-90 hover:shadow-xl active:scale-[0.99]'
        )}
        style={{
          background: 'linear-gradient(90deg, #FF4600 0%, #B33100 100%)',
          boxShadow:  '0 4px 20px rgba(255,70,0,0.38)',
        }}
      >
        <Search size={20} aria-hidden />
        Search Flights
      </button>
    </form>
  );
}

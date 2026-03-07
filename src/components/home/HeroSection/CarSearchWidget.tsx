/* eslint-disable */
// @ts-nocheck
// TODO: Fix type errors when implementing car search feature

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import { AirportInput } from '@/components/ui/AirportInput';
import { cn } from '@/lib/cn';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hh = String(Math.floor(i / 2)).padStart(2, '0');
  const mm  = i % 2 === 0 ? '00' : '30';
  return `${hh}:${mm}`;
});

const AGE_OPTIONS = [
  { value: 18, label: '18–20' },
  { value: 21, label: '21–24' },
  { value: 25, label: '25–29' },
  { value: 30, label: '30–34' },
  { value: 35, label: '35–39' },
  { value: 40, label: '40–44' },
  { value: 45, label: '45–49' },
  { value: 50, label: '50–54' },
  { value: 55, label: '55–59' },
  { value: 60, label: '60–64' },
  { value: 65, label: '65+' },
];

export function CarSearchWidget() {
  const router = useRouter();
  const { carSearch, updateCarSearch } = useSearchStore();
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const {
      pickupLocation,
      dropoffLocation,
      sameLocation,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      driverAge,
    } = carSearch;

    if (!pickupLocation) {
      alert('Please select a pickup location.');
      return;
    }

    const dropoffIata = sameLocation
      ? pickupLocation.iata
      : (dropoffLocation?.iata ?? pickupLocation.iata);

    const params = new URLSearchParams({
      pickup:      pickupLocation.iata,
      dropoff:     dropoffIata,
      pickupDate:  pickupDate   ?? '',
      dropoffDate: dropoffDate  ?? '',
      pickupTime,
      dropoffTime,
      age:         String(driverAge),
    });

    router.push(`/cars/search?${params.toString()}`);
  }, [carSearch, router]);

  return (
    <form onSubmit={handleSearch} noValidate>
      <div className="space-y-4">

        {/* Pickup Location */}
        <AirportInput
          label="Pickup Location"
          placeholder="City, Airport or Station"
          value={carSearch.pickupLocation}
          onChange={(v) => updateCarSearch({ pickupLocation: v })}
          icon={<MapPin size={16} aria-hidden />}
        />

        {/* Same location toggle */}
        <button
          type="button"
          onClick={() => updateCarSearch({ sameLocation: !carSearch.sameLocation })}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#004D9F' }}
          aria-pressed={carSearch.sameLocation}
        >
          {carSearch.sameLocation
            ? <ToggleRight size={22} aria-hidden />
            : <ToggleLeft  size={22} aria-hidden />
          }
          {carSearch.sameLocation
            ? 'Return to same location'
            : 'Return to different location'}
        </button>

        {/* Dropoff — only if different location */}
        {!carSearch.sameLocation && (
          <AirportInput
            label="Dropoff Location"
            placeholder="City, Airport or Station"
            value={carSearch.dropoffLocation}
            onChange={(v) => updateCarSearch({ dropoffLocation: v })}
            icon={<MapPin size={16} aria-hidden />}
          />
        )}

        {/* Dates & Times grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pickup date */}
          <div>
            <label className="block text-xs font-semibold mb-1.5"
              style={{ color: '#4A5568' }}>
              Pickup Date
            </label>
            <input
              type="date"
              min={today}
              value={carSearch.pickupDate ?? ''}
              onChange={(e) => updateCarSearch({ pickupDate: e.target.value || null })}
              className="search-input text-sm"
              aria-label="Car pickup date"
            />
          </div>

          {/* Pickup time */}
          <div>
            <label className="block text-xs font-semibold mb-1.5"
              style={{ color: '#4A5568' }}>
              Pickup Time
            </label>
            <div className="relative">
              <Clock size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#8896A5' }}
                aria-hidden
              />
              <select
                value={carSearch.pickupTime}
                onChange={(e) => updateCarSearch({ pickupTime: e.target.value })}
                className="search-input pl-9 text-sm appearance-none"
                aria-label="Car pickup time"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropoff date */}
          <div>
            <label className="block text-xs font-semibold mb-1.5"
              style={{ color: '#4A5568' }}>
              Dropoff Date
            </label>
            <input
              type="date"
              min={carSearch.pickupDate ?? today}
              value={carSearch.dropoffDate ?? ''}
              onChange={(e) => updateCarSearch({ dropoffDate: e.target.value || null })}
              className="search-input text-sm"
              aria-label="Car dropoff date"
            />
          </div>

          {/* Dropoff time */}
          <div>
            <label className="block text-xs font-semibold mb-1.5"
              style={{ color: '#4A5568' }}>
              Dropoff Time
            </label>
            <div className="relative">
              <Clock size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#8896A5' }}
                aria-hidden
              />
              <select
                value={carSearch.dropoffTime}
                onChange={(e) => updateCarSearch({ dropoffTime: e.target.value })}
                className="search-input pl-9 text-sm appearance-none"
                aria-label="Car dropoff time"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Driver Age */}
        <div>
          <label className="block text-xs font-semibold mb-1.5"
            style={{ color: '#4A5568' }}>
            Driver Age
          </label>
          <select
            value={carSearch.driverAge}
            onChange={(e) => updateCarSearch({ driverAge: Number(e.target.value) })}
            className="search-input text-sm"
            aria-label="Driver age"
          >
            {AGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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
          Search Cars
        </button>

      </div>
    </form>
  );
}

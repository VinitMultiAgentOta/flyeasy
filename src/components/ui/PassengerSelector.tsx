'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Plus, Minus } from 'lucide-react';
import { PASSENGER_LIMITS, CABIN_CLASSES } from '@/constants/site';
import type { PassengerCount, CabinClass } from '@/types';
import { cn } from '@/lib/cn';

interface PassengerSelectorProps {
  passengers:  PassengerCount;
  cabinClass:  CabinClass;
  onPassengersChange: (p: PassengerCount) => void;
  onCabinChange:      (c: CabinClass)    => void;
  className?:  string;
}

const CABIN_LABELS: Record<CabinClass, string> = {
  economy:         'Economy',
  premium_economy: 'Premium Economy',
  business:        'Business',
  first:           'First Class',
};

export function PassengerSelector({
  passengers,
  cabinClass,
  onPassengersChange,
  onCabinChange,
  className,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPax = passengers.adult + passengers.child + passengers.infant;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const update = (type: keyof PassengerCount, delta: number) => {
    const limits = PASSENGER_LIMITS[type];
    const next   = passengers[type] + delta;
    if (next < limits.min || next > limits.max) return;
    // Infants cannot exceed adults
    if (type === 'infant' && next > passengers.adult) return;
    onPassengersChange({ ...passengers, [type]: next });
  };

  const summaryText = `${totalPax} Traveler${totalPax !== 1 ? 's' : ''}, ${CABIN_LABELS[cabinClass]}`;

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <label className="block text-xs font-semibold mb-1.5"
        style={{ color: 'var(--color-text-secondary)' }}>
        Passengers & Class
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-3 bg-white rounded-lg border text-sm text-left transition-all duration-200"
        style={{
          borderColor: isOpen ? 'var(--color-brand-primary)' : 'var(--color-surface-border)',
          boxShadow:   isOpen ? '0 0 0 3px rgba(0,87,184,0.12)' : 'none',
          color:       'var(--color-text-primary)',
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Users size={16} style={{ color: 'var(--color-text-muted)' }} aria-hidden />
        <span className="flex-1 truncate font-medium">{summaryText}</span>
        <ChevronDown
          size={15}
          style={{ color: 'var(--color-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
          aria-hidden
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border shadow-xl z-50 p-4"
          style={{ borderColor: 'var(--color-surface-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', minWidth: '280px' }}
          role="dialog"
          aria-label="Passenger and cabin class selection"
        >
          {/* Passenger rows */}
          <div className="space-y-4 mb-4">
            {(Object.keys(PASSENGER_LIMITS) as (keyof PassengerCount)[]).map((type) => {
              const config = PASSENGER_LIMITS[type];
              const count  = passengers[type];
              const canDec = count > config.min;
              const canInc = count < config.max && !(type === 'infant' && count >= passengers.adult);

              return (
                <div key={type} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {config.sub}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => update(type, -1)}
                      disabled={!canDec}
                      className="w-8 h-8 rounded-full border flex items-center justify-center transition-all"
                      style={{
                        borderColor:      canDec ? 'var(--color-brand-primary)' : 'var(--color-surface-border)',
                        color:            canDec ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                        backgroundColor:  canDec ? 'var(--color-brand-light)'  : 'transparent',
                        cursor:           canDec ? 'pointer' : 'not-allowed',
                        opacity:          canDec ? 1 : 0.4,
                      }}
                      aria-label={`Decrease ${config.label}`}
                    >
                      <Minus size={13} aria-hidden />
                    </button>

                    <span className="w-5 text-center font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => update(type, 1)}
                      disabled={!canInc}
                      className="w-8 h-8 rounded-full border flex items-center justify-center transition-all"
                      style={{
                        borderColor:     canInc ? 'var(--color-brand-primary)' : 'var(--color-surface-border)',
                        color:           canInc ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                        backgroundColor: canInc ? 'var(--color-brand-light)'  : 'transparent',
                        cursor:          canInc ? 'pointer' : 'not-allowed',
                        opacity:         canInc ? 1 : 0.4,
                      }}
                      aria-label={`Increase ${config.label}`}
                    >
                      <Plus size={13} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t my-3" style={{ borderColor: 'var(--color-surface-border)' }} />

          {/* Cabin class */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Cabin Class
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CABIN_CLASSES.map((cabin) => (
                <button
                  key={cabin.value}
                  type="button"
                  onClick={() => onCabinChange(cabin.value as CabinClass)}
                  className="px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left"
                  style={
                    cabinClass === cabin.value
                      ? { backgroundColor: 'var(--color-brand-primary)', color: 'white', borderColor: 'var(--color-brand-primary)' }
                      : { backgroundColor: 'white', color: 'var(--color-text-secondary)', borderColor: 'var(--color-surface-border)' }
                  }
                >
                  {cabin.label}
                </button>
              ))}
            </div>
          </div>

          {/* Done button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

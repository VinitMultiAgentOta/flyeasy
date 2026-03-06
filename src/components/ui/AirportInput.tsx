'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { searchAirports } from '@/data/airports';
import type { AirportOption } from '@/types';
import { cn } from '@/lib/cn';

interface AirportInputProps {
  label:       string;
  placeholder: string;
  value:       AirportOption | null;
  onChange:    (value: AirportOption | null) => void;
  icon?:       React.ReactNode;
  className?:  string;
}

const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', NL: '🇳🇱',
  AE: '🇦🇪', SG: '🇸🇬', JP: '🇯🇵', AU: '🇦🇺', CA: '🇨🇦',
  MX: '🇲🇽', BR: '🇧🇷', IN: '🇮🇳', HK: '🇭🇰', KR: '🇰🇷',
  ES: '🇪🇸', IT: '🇮🇹',
};

export function AirportInput({
  label, placeholder, value, onChange, icon, className,
}: AirportInputProps) {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState<AirportOption[]>([]);
  const [isOpen,      setIsOpen]      = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      const found = searchAirports(val);
      setResults(found);
      setIsOpen(found.length > 0);
      setIsLoading(false);
    }, 200);
  }, []);

  const handleSelect = useCallback((airport: AirportOption) => {
    onChange(airport);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const displayValue = value
    ? `${value.city} (${value.iata})`
    : query;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Label */}
      <label className="block text-xs font-semibold mb-1.5"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div
        className="relative flex items-center rounded-lg border transition-all duration-200 bg-white"
        style={{ borderColor: isOpen ? 'var(--color-brand-primary)' : 'var(--color-surface-border)',
          boxShadow: isOpen ? '0 0 0 3px rgba(0,87,184,0.12)' : 'none' }}
      >
        {/* Left icon */}
        <span className="pl-3 shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          {icon ?? <MapPin size={16} aria-hidden />}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => {
            if (value) { onChange(null); setQuery(''); }
            if (results.length) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-3 py-3 text-sm bg-transparent outline-none"
          style={{ color: 'var(--color-text-primary)' }}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Right: clear or loader */}
        <span className="pr-3 shrink-0">
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-muted)' }} aria-hidden />
          ) : value ? (
            <button onClick={handleClear} className="p-0.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Clear selection" type="button">
              <X size={13} style={{ color: 'var(--color-text-muted)' }} aria-hidden />
            </button>
          ) : null}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border shadow-xl z-50 overflow-hidden"
          style={{ borderColor: 'var(--color-surface-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}
        >
          {results.map((airport, idx) => (
            <button
              key={airport.iata}
              role="option"
              aria-selected={idx === activeIndex}
              type="button"
              onMouseDown={() => handleSelect(airport)}
              onMouseEnter={() => setActiveIndex(idx)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                backgroundColor: idx === activeIndex ? 'var(--color-brand-light)' : 'transparent',
              }}
            >
              {/* IATA badge */}
              <span
                className="shrink-0 w-11 text-center text-xs font-bold rounded-md py-1"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {airport.iata}
              </span>

              {/* Airport details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {airport.city}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                  {airport.name}
                </p>
              </div>

              {/* Flag */}
              <span className="text-lg shrink-0" aria-hidden>
                {FLAG_MAP[airport.countryCode] ?? '🌍'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

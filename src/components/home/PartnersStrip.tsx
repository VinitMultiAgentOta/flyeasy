'use client';

import { AIRLINE_PARTNERS } from '@/data/homeData';

export function PartnersStrip() {
  // Duplicate for seamless loop
  const doubled = [...AIRLINE_PARTNERS, ...AIRLINE_PARTNERS];

  return (
    <section
      aria-label="Airline partners"
      className="py-10 border-y"
      style={{ backgroundColor: '#F5F7FA', borderColor: '#DDE3ED' }}
    >
      <div className="container-site mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: '#8896A5' }}>
          Trusted by 500+ Airlines Worldwide
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.code}-${i}`}
              className="flex-shrink-0 mx-6 flex items-center gap-2.5 group cursor-default"
              aria-label={partner.name}
            >
              {/* Airline IATA badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm text-white shadow-sm grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                style={{ backgroundColor: partner.color }}
                aria-hidden
              >
                {partner.code}
              </div>
              <span
                className="text-sm font-medium whitespace-nowrap transition-colors duration-200"
                style={{ color: '#8896A5' }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

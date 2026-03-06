'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Tag, Flame, Plane } from 'lucide-react';
import { FLIGHT_DEALS } from '@/data/homeData';
import { formatCurrency } from '@/lib/utils';

const TABS = ['All', 'Domestic', 'International'] as const;
type Tab = typeof TABS[number];

const INTL_CODES = ['LHR', 'CDG', 'NRT', 'DXB', 'SIN', 'AMS', 'FRA', 'FCO'];

export function DealsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const router = useRouter();

  const filtered = FLIGHT_DEALS.filter((d) => {
    if (activeTab === 'Domestic')      return !INTL_CODES.includes(d.destination);
    if (activeTab === 'International') return INTL_CODES.includes(d.destination);
    return true;
  }).slice(0, 6);

  const handleBook = (deal: typeof FLIGHT_DEALS[0]) => {
    router.push(
      `/flights/search?origin=${deal.origin}&dest=${deal.destination}&tripType=round_trip&adults=1&cabin=economy`
    );
  };

  return (
    <section aria-labelledby="deals-heading" className="py-14" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="container-site">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} style={{ color: '#FF4600' }} aria-hidden />
              <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#FF4600' }}>
                Hot Deals
              </span>
            </div>
            <h2 id="deals-heading" className="section-title">Today&apos;s Best Flight Deals</h2>
            <p className="section-subtitle">Prices updated in real-time. Book fast — these won&apos;t last.</p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#DDE3ED' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  activeTab === tab
                    ? { backgroundColor: '#004D9F', color: '#FFFFFF' }
                    : { backgroundColor: 'transparent', color: '#4A5568' }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((deal) => (
            <div
              key={deal.id}
              className="card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              onClick={() => handleBook(deal)}
              role="button"
              tabIndex={0}
              aria-label={`${deal.originCity} to ${deal.destCity} from ${formatCurrency(deal.price)}`}
              onKeyDown={(e) => e.key === 'Enter' && handleBook(deal)}
            >
              {/* Destination Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={deal.imageUrl}
                  alt={`${deal.destCity} destination`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}
                  aria-hidden
                />

                {/* Discount badge — top right */}
                {deal.discount && (
                  <div className="absolute top-3 right-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow"
                      style={{ backgroundColor: '#FF4600', color: '#FFFFFF' }}
                    >
                      <Tag size={10} aria-hidden />
                      Save {deal.discount}%
                    </span>
                  </div>
                )}

                {/* Destination name overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white font-heading font-bold text-xl leading-none drop-shadow">
                    {deal.destCity}
                  </p>
                  <p className="text-white/75 text-xs mt-0.5 drop-shadow">
                    {deal.airline}
                  </p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                {/* Route row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-lg" style={{ color: '#004D9F' }}>
                      {deal.origin}
                    </span>
                    <div className="flex items-center gap-1 px-2">
                      <div className="w-8 h-px" style={{ backgroundColor: '#DDE3ED' }} />
                      <Plane size={12} style={{ color: '#8896A5' }} aria-hidden />
                      <div className="w-8 h-px" style={{ backgroundColor: '#DDE3ED' }} />
                    </div>
                    <span className="font-heading font-bold text-lg" style={{ color: '#004D9F' }}>
                      {deal.destination}
                    </span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#DDE3ED' }}>
                  <div>
                    <span className="text-xs block" style={{ color: '#8896A5' }}>From</span>
                    <span className="font-heading font-bold text-2xl leading-none" style={{ color: '#FF4600' }}>
                      {formatCurrency(deal.price)}
                    </span>
                    <span className="text-xs block mt-0.5" style={{ color: '#8896A5' }}>per person</span>
                  </div>

                  <button
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all group-hover:gap-2.5"
                    style={{ backgroundColor: '#004D9F' }}
                    onClick={(e) => { e.stopPropagation(); handleBook(deal); }}
                  >
                    Book Now
                    <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/deals')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold border-2 transition-all hover:text-white"
            style={{ borderColor: '#004D9F', color: '#004D9F' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#004D9F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            View All Flight Deals
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

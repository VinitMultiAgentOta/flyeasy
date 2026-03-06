'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Shield, Star, Headphones, BadgeDollarSign } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import { FlightSearchWidget } from './FlightSearchWidget';
import { CarSearchWidget }    from './CarSearchWidget';
import { PHONE, TRUST_STATS }  from '@/constants/site';
import { generateBookingCount } from '@/lib/utils';
import { cn } from '@/lib/cn';

const TAB_ICONS = { flights: '✈️', cars: '🚗' } as const;

const TRUST_ICONS = [
  <Star        key="star"  size={20} aria-hidden />,
  <Shield      key="shield" size={20} aria-hidden />,
  <Headphones  key="head"  size={20} aria-hidden />,
  <BadgeDollarSign key="badge" size={20} aria-hidden />,
];

export function HeroSection() {
  const { activeTab, setActiveTab } = useSearchStore();
  const [bookingCount, setBookingCount] = useState(0);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookingCount(generateBookingCount());
  }, []);

  return (
    <section
      aria-label="Search flights and cars"
      className="relative overflow-hidden"
      style={{
        background:  'var(--bg-hero-gradient)',
        minHeight:   '600px',
        paddingTop:  '64px',
        paddingBottom: '80px',
      }}
    >
      {/* ── Decorative blobs ─────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      </div>

      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: Headlines + Trust ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-white pt-4 lg:pt-12"
          >
            {/* Social proof badge */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" aria-hidden />
                <span>{bookingCount} people booked a flight in the last hour</span>
              </motion.div>
            )}

            {/* Headline */}
            <h1
              className="font-heading font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: '1.15' }}
            >
              Fly Smarter.<br />
              <span style={{ color: '#FBBF24' }}>Save More.</span>
            </h1>

            <p className="text-blue-200 text-lg mb-8 leading-relaxed max-w-md">
              Search 500+ airlines worldwide. Find the best price — or call us for
              exclusive fares not listed anywhere online.
            </p>

            {/* Call CTA block */}
            <div
              className="rounded-2xl p-5 mb-8 border max-w-md"
              style={{
                backgroundColor: 'rgba(255,70,0,0.18)',
                borderColor:     '#FF4600',
                border:          '1.5px solid #FF4600',
              }}
              
            >
              <p className="text-sm font-medium text-red-300 mb-2">
                🔥 Can&apos;t find the price you want online?
              </p>
              <p className="text-white font-semibold mb-3 text-sm leading-relaxed">
                Our agents hold <span className="text-yellow-300 font-bold">unpublished &amp; negotiated fares</span> that
                aren&apos;t available on any website.
              </p>
              <a
                href={PHONE.href}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-heading font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-cta-call)', boxShadow: '0 4px 20px rgba(255,59,48,0.5)' }}
                aria-label={`Call for exclusive deals: ${PHONE.display}`}
              >
                <PhoneCall size={18} className="animate-pulse-slow" aria-hidden />
                <span className="text-base">{PHONE.display}</span>
                <span className="text-xs opacity-80 font-normal">— {PHONE.available}</span>
              </a>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TRUST_STATS.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FBBF24' }}
                    aria-hidden
                  >
                    {TRUST_ICONS[i]}
                  </div>
                  <div className="font-heading font-bold text-white text-lg leading-none">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-blue-300 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Search Widget Card ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface-muted)' }}
            >
              {/* Widget header — Flights / Cars tabs */}
              <div
                className="flex border-b"
                style={{ borderColor: 'var(--color-surface-border)' }}
                role="tablist"
                aria-label="Search type"
              >
                {(['flights', 'cars'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 capitalize border-b-2'
                    )}
                    style={
                      activeTab === tab
                        ? { color: 'var(--color-brand-primary)',   borderBottomColor: 'var(--color-brand-primary)',   backgroundColor: 'white' }
                        : { color: 'var(--color-text-secondary)', borderBottomColor: 'transparent', backgroundColor: 'transparent' }
                    }
                  >
                    <span className="text-lg" aria-hidden>{TAB_ICONS[tab]}</span>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Widget body */}
              <div className="p-5 sm:p-6 bg-white">
                {activeTab === 'flights'
                  ? <FlightSearchWidget />
                  : <CarSearchWidget />
                }
              </div>

              {/* Widget footer */}
              <div
                className="px-5 py-3 flex items-center justify-center gap-2 text-xs"
                style={{ backgroundColor: '#F8FAFC', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-surface-border)' }}
              >
                <Shield size={12} aria-hidden />
                <span>Secure booking · Best price guarantee · No hidden fees</span>
              </div>
            </div>

            {/* Below-widget call strip */}
            <div
              className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <p className="text-white text-sm">
                <span className="font-semibold">Better prices over the phone?</span>
                <span className="text-blue-200 text-xs ml-1">Our agents beat online rates daily.</span>
              </p>
              <a
                href={PHONE.href}
                className="shrink-0 flex items-center gap-1.5 font-bold text-sm whitespace-nowrap transition-colors"
                style={{ color: '#FF3B30' }}
                aria-label={`Call ${PHONE.display}`}
              >
                <PhoneCall size={14} className="animate-pulse-slow" aria-hidden />
                Call Now
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

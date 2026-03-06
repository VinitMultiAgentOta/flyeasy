'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, Clock, Zap } from 'lucide-react';
import { useCountdownToMidnight } from '@/hooks/useCountdown';
import { PHONE } from '@/constants/site';

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center font-heading font-bold text-2xl text-white shadow-inner"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      >
        {value}
      </div>
      <span className="text-xs mt-1.5 uppercase tracking-wider"
        style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { seconds } = useCountdownToMidnight();
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-3" role="timer" aria-label="Countdown to midnight">
      <TimeBlock value={hh} label="Hours"   />
      <span   className="text-white font-bold text-3xl leading-none self-center pb-6" aria-hidden>:</span>
      <TimeBlock value={mm} label="Minutes" />
      <span   className="text-white font-bold text-3xl leading-none self-center pb-6" aria-hidden>:</span>
      <TimeBlock value={ss} label="Seconds" />
    </div>
  );
}

export function LastMinuteBanner() {
  // ← mounted guard prevents SSR/client mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      aria-labelledby="lastminute-heading"
      className="py-14 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #001F5B 0%, #004D9F 60%, #FF4600 140%)' }}
    >
      {/* Decorative blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FF4600, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
      </div>

      <div className="container-site relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left */}
          <div className="text-white text-center lg:text-left max-w-lg">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: 'rgba(255,70,0,0.3)', color: '#FFB347', border: '1px solid rgba(255,70,0,0.5)' }}
            >
              <Zap size={14} aria-hidden />
              Last Minute Deals
            </div>

            <h2
              id="lastminute-heading"
              className="font-heading font-bold text-3xl sm:text-4xl leading-tight mb-4"
            >
              Deals Expire At Midnight!
            </h2>

            <p className="text-blue-200 text-lg mb-6 leading-relaxed">
              Our agents hold seats at prices that disappear after midnight.{' '}
              <strong className="text-white">Call now before they&apos;re gone.</strong>
            </p>

            <a
              href={PHONE.href}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-heading font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(90deg, #FF4600, #B33100)', boxShadow: '0 4px 24px rgba(255,70,0,0.5)' }}
            >
              <PhoneCall size={22} className="animate-pulse-slow" aria-hidden />
              {PHONE.display}
              <span className="text-sm font-normal opacity-80">— {PHONE.available}</span>
            </a>

            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              No hold times. Talk to an agent instantly.
            </p>
          </div>

          {/* Right — countdown, client-only */}
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Clock size={18} className="text-blue-300 animate-pulse-slow" aria-hidden />
              <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                Deals Reset In
              </span>
            </div>

            {/* Only render after mount to avoid hydration mismatch */}
            {mounted ? (
              <Countdown />
            ) : (
              <div className="flex items-end gap-3">
                {['--', '--', '--'].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center font-heading font-bold text-2xl text-white"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              ✓ Unpublished fares · ✓ Exclusive rates · ✓ No fees
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

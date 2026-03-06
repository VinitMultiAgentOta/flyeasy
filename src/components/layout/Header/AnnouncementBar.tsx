'use client';

import { useState, useEffect } from 'react';
import { X, PhoneCall, Zap } from 'lucide-react';
import { PHONE } from '@/constants/site';

const DISMISS_KEY    = 'ota_announcement_dismissed_at';
const REDISPLAY_MS   = 30 * 60 * 1000; // 30 minutes

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt) {
        setIsVisible(true);
        return;
      }
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed >= REDISPLAY_MS) {
        localStorage.removeItem(DISMISS_KEY);
        setIsVisible(true);
      }
    } catch {
      // localStorage blocked (incognito edge case)
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch { /* noop */ }
  };

  if (!isVisible) return null;

  return (
    <div
      role="banner"
      aria-label="Promotional announcement"
      style={{ backgroundColor: '#0A1628' }}
      className="relative z-50 text-white"
    >
      <div className="container-site">
        <div className="flex items-center justify-center gap-x-3 gap-y-1 flex-wrap py-2.5 pr-8 text-sm text-center">
          
          {/* Icon + Headline */}
          <span className="flex items-center gap-1.5 font-semibold text-yellow-400">
            <Zap size={14} aria-hidden />
            Exclusive Call-Only Deals!
          </span>

          {/* Divider — desktop only */}
          <span className="hidden sm:inline text-gray-500">·</span>

          {/* Body text */}
          <span className="hidden sm:inline text-gray-300">
            Unpublished fares our agents hold — not available online.
          </span>

          {/* Phone CTA */}
          <a
            href={PHONE.href}
            className="inline-flex items-center gap-1.5 font-bold transition-colors"
            style={{ color: '#FF3B30' }}
            aria-label={`Call us at ${PHONE.display}`}
          >
            <PhoneCall size={13} className="animate-pulse-slow" aria-hidden />
            <span className="underline underline-offset-2">
              Call {PHONE.display}
            </span>
          </a>

          {/* Availability */}
          <span className="text-gray-500 text-xs">
            — Available {PHONE.available}
          </span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={13} aria-hidden />
      </button>
    </div>
  );
}

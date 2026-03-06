'use client';

import { useState, useEffect } from 'react';
import { Phone, X, ChevronUp } from 'lucide-react';
import { PHONE } from '@/constants/site';
import { cn } from '@/lib/cn';

export function FloatingCallButton() {
  const [visible,   setVisible]   = useState(false);
  const [expanded,  setExpanded]  = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show after scrolling 400px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-expand once after 3 seconds of being visible
  useEffect(() => {
    if (!visible || dismissed) return;
    const t = setTimeout(() => setExpanded(true), 3000);
    return () => clearTimeout(t);
  }, [visible, dismissed]);

  // Auto-collapse after 6 seconds
  useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => setExpanded(false), 6000);
    return () => clearTimeout(t);
  }, [expanded]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      aria-label="Floating contact options"
    >
      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
        style={{ backgroundColor: '#004D9F', color: '#FFFFFF' }}
        aria-label="Scroll to top"
      >
        <ChevronUp size={18} aria-hidden />
      </button>

      {/* Floating call pill */}
      <div className="relative flex items-center">

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center z-10 shadow"
          style={{ backgroundColor: '#4A5568', color: '#FFFFFF' }}
          aria-label="Dismiss call button"
        >
          <X size={10} aria-hidden />
        </button>

        {/* Expanded label */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            expanded ? 'max-w-xs opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'
          )}
        >
          <div
            className="whitespace-nowrap px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(90deg, #001F5B, #004D9F)' }}
          >
            <span className="block text-xs font-normal opacity-75 mb-0.5">
              Better fares over the phone!
            </span>
            {PHONE.display}
          </div>
        </div>

        {/* Call button */}
        <a
          href={PHONE.href}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
          style={{
            background:  'linear-gradient(135deg, #FF4600, #B33100)',
            boxShadow:   '0 4px 24px rgba(255,70,0,0.55)',
          }}
          aria-label={`Call ${PHONE.display} for best deals`}
          onClick={() => setExpanded(false)}
        >
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: '#FF4600' }}
            aria-hidden
          />
          <Phone size={22} className="text-white relative z-10" aria-hidden />
        </a>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PhoneCall, Plane } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { generateAgentCount } from '@/lib/utils';
import { PHONE, SITE_CONFIG } from '@/constants/site';
import { DesktopNav } from './NavMenu';
import { MobileNav } from './NavMenu';
import { cn } from '@/lib/cn';

export function Header() {
  const { isScrolled } = useScrollPosition(80);
  const [agentCount, setAgentCount] = useState(42);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    setAgentCount(generateAgentCount());
    const interval = setInterval(
      () => setAgentCount(generateAgentCount()),
      45_000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white py-2'
          : 'bg-white/96 py-3 border-b border-surface-border'
      )}
      style={
        isScrolled
          ? { boxShadow: 'var(--shadow-header)' }
          : { backdropFilter: 'blur(12px)' }
      }
    >
      <div className="container-site">
        <div className="flex items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label={`${SITE_CONFIG.name} — Home`}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              <Plane size={18} className="text-white -rotate-45" aria-hidden />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-heading font-bold text-xl leading-none"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                {SITE_CONFIG.name}
              </span>
              <span
                className="text-[10px] mt-0.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {SITE_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav (center) ──────────────────────────── */}
          <DesktopNav />

          {/* ── Right Side ───────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Agents online pill — xl screens only */}
            {mounted && (
              <div
                className="hidden xl:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  borderColor: 'var(--color-surface-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse-slow shrink-0"
                  style={{ backgroundColor: 'var(--color-brand-accent)' }}
                  aria-hidden
                />
                <span className="font-medium">
                  {agentCount} agents online
                </span>
              </div>
            )}

            {/* Phone number block — md+ screens */}
            <a
              href={PHONE.href}
              className="hidden md:flex items-center gap-2 group transition-colors"
              style={{ color: 'var(--color-cta-call)' }}
              aria-label={`Call us at ${PHONE.display}, available ${PHONE.available}`}
            >
              {/* Phone icon with green dot */}
              <div className="relative shrink-0">
                <PhoneCall
                  size={20}
                  className="animate-pulse-slow"
                  aria-hidden
                />
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: 'var(--color-brand-accent)' }}
                  aria-hidden
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-[15px] group-hover:underline underline-offset-2">
                  {PHONE.display}
                </span>
                <span
                  className="text-[10px] font-normal mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {PHONE.available} Support
                </span>
              </div>
            </a>

            {/* "Call for Best Deal" button — lg+ */}
            <a
              href={PHONE.href}
              className="btn-call hidden lg:inline-flex text-sm px-4 py-2.5 rounded-lg"
              aria-label={`Call for exclusive deals: ${PHONE.display}`}
            >
              <PhoneCall size={15} aria-hidden />
              Call for Best Deal
            </a>

            {/* Mobile: phone icon button only */}
            <a
              href={PHONE.href}
              className="md:hidden p-2.5 rounded-lg text-white transition-colors"
              style={{ backgroundColor: 'var(--color-cta-call)' }}
              aria-label={`Call ${PHONE.display}`}
            >
              <PhoneCall size={20} aria-hidden />
            </a>

            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

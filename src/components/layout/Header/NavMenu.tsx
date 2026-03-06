'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PhoneCall, ChevronRight } from 'lucide-react';
import { NAV_LINKS, PHONE } from '@/constants/site';
import { cn } from '@/lib/cn';

/* ─── Desktop Horizontal Nav ─────────────────────────────── */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center gap-1"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + '/');

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'font-semibold'
                : 'text-text-secondary hover:text-brand-primary'
            )}
            style={
              isActive
                ? { color: 'var(--color-brand-primary)', backgroundColor: 'var(--color-brand-light)' }
                : undefined
            }
          >
            {link.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--color-brand-primary)' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Mobile Drawer Nav ───────────────────────────────────── */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-muted transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <Menu size={22} aria-hidden />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] lg:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
              onClick={close}
              aria-hidden
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-[100] flex flex-col shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'var(--color-surface-border)' }}
              >
                <span
                  className="font-heading font-bold text-lg"
                  style={{ color: 'var(--color-brand-primary)' }}
                >
                  ✈️ FlyEasy
                </span>
                <button
                  onClick={close}
                  className="p-2 rounded-lg hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <ul className="space-y-1" role="list">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'flex items-center justify-between px-4 py-3.5 rounded-lg font-medium transition-all duration-200'
                          )}
                          style={
                            isActive
                              ? {
                                  backgroundColor: 'var(--color-brand-light)',
                                  color: 'var(--color-brand-primary)',
                                  fontWeight: 600,
                                }
                              : {
                                  color: 'var(--color-text-primary)',
                                }
                          }
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-xl leading-none" aria-hidden>
                              {link.icon}
                            </span>
                            {link.label}
                          </span>
                          <ChevronRight
                            size={16}
                            style={{ color: 'var(--color-text-muted)' }}
                            aria-hidden
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer footer — Call CTA */}
              <div
                className="p-4 border-t"
                style={{
                  borderColor: 'var(--color-surface-border)',
                  backgroundColor: '#FFF5F5',
                }}
              >
                <p
                  className="text-xs text-center mb-2.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Talk to a travel expert right now
                </p>
                <a
                  href={PHONE.href}
                  onClick={close}
                  className="btn-call w-full justify-center py-3.5 rounded-lg text-base"
                  aria-label={`Call us at ${PHONE.display}`}
                >
                  <PhoneCall size={18} aria-hidden />
                  {PHONE.display}
                </a>
                <p
                  className="text-xs text-center mt-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {PHONE.available} · Unpublished fares available
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

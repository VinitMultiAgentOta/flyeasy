import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { FOOTER_LINKS, TRUST_BADGES } from './FooterLinks';
import { PHONE, SITE_NAME } from '@/constants/site';

const SOCIAL = [
  { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook'  },
  { Icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter'   },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube'   },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer aria-label="Site footer" style={{ backgroundColor: '#001F5B' }}>

      {/* ── Call CTA Banner ── */}
      <div
        className="py-8"
        style={{ background: 'linear-gradient(90deg, #FF4600 0%, #B33100 100%)' }}
      >
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <p className="font-heading font-bold text-xl">
              Better Prices Over The Phone!
            </p>
            <p className="text-orange-100 text-sm mt-1">
              Our agents hold unpublished fares not available online.
            </p>
          </div>
          <a
            href={PHONE.href}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg transition-all hover:scale-105 shadow-xl"
            style={{ backgroundColor: '#FFFFFF', color: '#FF4600' }}
            aria-label={`Call ${PHONE.display}`}
          >
            <Phone size={20} aria-hidden />
            {PHONE.display}
            <span className="text-sm font-normal text-gray-500">24/7</span>
          </a>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#FF4600' }}
                aria-hidden
              >
                ✈
              </div>
              <div>
                <span className="font-heading font-bold text-white text-lg">{SITE_NAME}</span>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Fly Smarter. Save More.
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Search 500+ airlines worldwide and find the best fares — or call us for
              exclusive unpublished deals.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              <a
                href={PHONE.href}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: '#FF4600' }}
              >
                <Phone size={14} aria-hidden />
                {PHONE.display}
              </a>
              <a
                href="mailto:support@flyeasy.com"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                <Mail size={14} aria-hidden />
                support@flyeasy.com
              </a>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                <MapPin size={14} aria-hidden />
                New York, NY 10001
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                >
                  <Icon size={15} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3
                className="font-heading font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust badges + Payment ── */}
      <div
        className="border-t py-6"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="container-site flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                <span aria-hidden>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-2">
            <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              We accept:
            </span>
            {['VISA', 'MC', 'AMEX', 'PP', 'APay', 'GPay'].map((p) => (
              <div
                key={p}
                className="px-2 py-1 rounded text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div
        className="py-4 border-t text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © {year} {SITE_NAME}. All rights reserved. |{' '}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          {' '}|{' '}
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          {' '}|{' '}
          <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Prices shown are estimates and subject to availability. Fares may change without notice.
        </p>
      </div>
    </footer>
  );
}

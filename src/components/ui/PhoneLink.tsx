'use client';

import { PhoneCall } from 'lucide-react';
import { PHONE } from '@/constants/site';
import { cn } from '@/lib/cn';

interface PhoneLinkProps {
  size?:      'hero' | 'lg' | 'md' | 'sm';
  showIcon?:  boolean;
  className?: string;
  label?:     string;
}

export function PhoneLink({
  size      = 'md',
  showIcon  = true,
  className,
  label,
}: PhoneLinkProps) {
  const sizeClass = {
    hero: 'phone-cta-hero',
    lg:   'phone-cta-lg',
    md:   'phone-cta-md',
    sm:   'text-base font-bold',
  }[size];

  const iconSize = { hero: 28, lg: 22, md: 18, sm: 15 }[size];

  return (
    <a
      href={PHONE.href}
      className={cn('phone-cta', sizeClass, className)}
      aria-label={`Call us at ${PHONE.display}`}
    >
      {showIcon && (
        <PhoneCall
          size={iconSize}
          className="animate-pulse-slow"
          aria-hidden
        />
      )}
      <span>{label ?? PHONE.display}</span>
    </a>
  );
}

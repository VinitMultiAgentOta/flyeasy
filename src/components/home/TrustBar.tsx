'use client';

import { useEffect, useRef, useState } from 'react';
import { Plane, Star, Phone, BadgeDollarSign } from 'lucide-react';

const STATS = [
  { icon: <Plane      size={28} aria-hidden />, end: 5000000,  suffix: '+',  label: 'Flights Booked',   prefix: '' },
  { icon: <Star       size={28} aria-hidden />, end: 4.8,      suffix: '/5', label: 'Customer Rating',  prefix: '' },
  { icon: <Phone      size={28} aria-hidden />, end: 24,       suffix: '/7', label: 'Agent Support',    prefix: '' },
  { icon: <BadgeDollarSign size={28} aria-hidden />, end: 100, suffix: '%',  label: 'Price Guarantee',  prefix: '' },
];

function AnimatedCounter({
  end, suffix, prefix, decimals = 0, duration = 2000,
}: {
  end: number; suffix: string; prefix: string; decimals?: number; duration?: number;
}) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps     = 60;
    const increment = end / steps;
    let current     = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); return; }
      setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  const display = decimals > 0
    ? count.toFixed(decimals)
    : count >= 1_000_000
      ? `${(count / 1_000_000).toFixed(1)}M`
      : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section
      aria-label="Trust statistics"
      className="py-10 border-b"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor:      '#DDE3ED',
      }}
    >
      <div className="container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:shadow-md group"
              style={{ backgroundColor: '#F5F7FA' }}
            >
              {/* Icon circle */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: i % 2 === 0 ? '#004D9F' : '#FF4600',
                  color: '#FFFFFF',
                }}
                aria-hidden
              >
                {stat.icon}
              </div>

              {/* Counter */}
              <div
                className="font-heading font-bold text-2xl sm:text-3xl"
                style={{ color: '#1A1A2E' }}
              >
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.end === 4.8 ? 1 : 0}
                />
              </div>

              {/* Label */}
              <p className="text-sm font-medium" style={{ color: '#4A5568' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

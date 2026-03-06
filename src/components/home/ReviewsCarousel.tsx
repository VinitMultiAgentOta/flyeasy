'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/data/homeData';
import { cn } from '@/lib/cn';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? '#FF4600' : 'transparent'}
          style={{ color: i < rating ? '#FF4600' : '#DDE3ED' }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const perPage = 3;
  const total   = Math.ceil(CUSTOMER_REVIEWS.length / perPage);

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % total), [total]);
  const prev = () =>
    setCurrent((c) => (c - 1 + total) % total);

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const visible = CUSTOMER_REVIEWS.slice(
    current * perPage,
    current * perPage + perPage
  );

  return (
    <section
      aria-labelledby="reviews-heading"
      className="py-14"
      style={{ backgroundColor: '#FFFFFF' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-site">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={16} fill="#FF4600" style={{ color: '#FF4600' }} aria-hidden />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: '#FF4600' }}>
                4.8 out of 5
              </span>
            </div>
            <h2 id="reviews-heading" className="section-title">
              What Our Travelers Say
            </h2>
            <p className="section-subtitle">
              Over 2 million verified reviews from real customers
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105"
              style={{ borderColor: '#DDE3ED', color: '#4A5568' }}
              aria-label="Previous reviews"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
              style={{ backgroundColor: '#004D9F' }}
              aria-label="Next reviews"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((review) => (
            <div
              key={review.id}
              className="card p-5 flex flex-col gap-4 hover:border-blue-200 transition-all duration-300"
              style={{ borderColor: '#DDE3ED' }}
            >
              {/* Top: rating + verified */}
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                {review.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: '#00A651' }}
                  >
                    <BadgeCheck size={13} aria-hidden />
                    Verified
                  </span>
                )}
              </div>

              {/* Comment */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: '#4A5568' }}
              >
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-3 border-t"
                style={{ borderColor: '#DDE3ED' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: '#004D9F' }}
                  aria-hidden
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                    {review.name}
                  </p>
                  <p className="text-xs" style={{ color: '#8896A5' }}>
                    {review.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Review pages">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:           i === current ? '24px' : '8px',
                height:          '8px',
                backgroundColor: i === current ? '#004D9F' : '#DDE3ED',
              }}
              aria-label={`Go to review page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

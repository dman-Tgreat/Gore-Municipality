'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { heroSlidesApi, type HeroSlide } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Hero() {
  const { t } = useLocale();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    heroSlidesApi.getActive()
      .then(setSlides)
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1));
  }, [slides.length]);

  useEffect(() => {
    if (isHovering || slides.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [isHovering, goNext, slides.length]);

  // Fallback when no slides
  if (!loading && slides.length === 0) {
    return (
      <section className="relative min-h-[500px] lg:min-h-[580px] w-full overflow-hidden bg-slate-800 flex items-center justify-center z-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
        <div className="relative text-center text-white px-6 max-w-3xl mx-auto">
          {/* Seal */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
            <span className="text-3xl font-black text-white/80">GW</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6">
            {t.header.home}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 tracking-tight leading-[1.1]">
            {t.hero.welcome}
          </h1>
          <Link
            href="/service"
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-7 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
          >
            {t.hero.exploreServices}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    );
  }

  if (loading || slides.length === 0) {
    return (
      <section className="relative min-h-[500px] lg:min-h-[580px] w-full bg-slate-800 animate-pulse flex items-center justify-center z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-6" />
          <div className="h-6 bg-slate-700 rounded w-72 mx-auto mb-3" />
          <div className="h-4 bg-slate-700 rounded w-48 mx-auto" />
        </div>
      </section>
    );
  }

  const imgSrc = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
    return url;
  };

  return (
    <section
      className="relative min-h-[500px] lg:min-h-[580px] w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <img
            src={imgSrc(slide.imageUrl)}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/60 to-primary-dark/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-primary/20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-dark to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            {/* Seal */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <span className="text-xl font-black text-white/80">GW</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
              {t.header.home}
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-[1.1]">
              {t.hero.welcome}
            </h1>

            {/* Description from API */}
            <p className="text-base md:text-lg max-w-2xl mx-auto font-light text-slate-200/90 mb-8 min-h-[1.5rem]">
              {slide.description}
            </p>

            {/* CTA Button */}
            <Link
              href="/service"
              className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-7 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            >
              {t.hero.exploreServices}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-20">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-10 h-2 bg-white rounded-full'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

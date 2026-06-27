'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';

export default function Hero() {
  const { t } = useLocale();

  const slides = [
    {
      image: 'https://www.connect4climate.org/sites/default/files/2024-11/EthiopiaBanner3.png',
      text: t.hero.slides[0],
    },
    {
      image: 'https://figures.academia-assets.com/65833206/figure_020.jpg',
      text: t.hero.slides[1],
    },
    {
      image: 'https://i0.wp.com/qbo-abo-wbo.org/wp-content/uploads/2024/07/IMG-20240714-WA0001.jpg?fit=1080%2C621&ssl=1&w=640',
      text: t.hero.slides[2],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[450px] w-full overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md tracking-tight max-w-4xl">
              {t.hero.welcome}
            </h2>
            <p className="text-xl max-w-2xl mx-auto drop-shadow-sm font-light h-16">
              {slide.text}
            </p>
            <button className="mt-4 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition shadow-lg">
              {t.hero.exploreServices}
            </button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-red-600 w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

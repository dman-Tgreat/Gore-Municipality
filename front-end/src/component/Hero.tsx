'use client';

import React, { useState, useEffect } from 'react';

export default function Hero() {
  const slides = [
    {
      image: 'https://www.connect4climate.org/sites/default/files/2024-11/EthiopiaBanner3.png',
      text: 'Empowering the Gore Woreda community through modern digital administration.',
    },
    {
      image: 'https://figures.academia-assets.com/65833206/figure_020.jpg',
      text: 'Promoting local agricultural development and sustainable resources.',
    },
    {
      image: '	https://i0.wp.com/qbo-abo-wbo.org/wp-content/uploa…MG-20240714-WA0001.jpg?fit=1080%2C621&ssl=1&w=640',
      text: 'Efficient and transparent civil registry and licensing services for everyone.',
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
              Welcome to the Official Portal of Gore Woreda
            </h2>
            <p className="text-xl max-w-2xl mx-auto drop-shadow-sm font-light h-16">
              {slide.text}
            </p>
            <button className="mt-4 bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition shadow-lg">
              Explore Services
            </button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-yellow-500 w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
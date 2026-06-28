'use client';

import React from 'react';
import Header from '@/component/Header';
import Hero from '@/component/Hero';
import StatsGrid from '@/component/StatsGrid'; 
import Services from '@/component/Services';
import QuickLinks from '@/component/QuickLinks';
import Footer from '@/component/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <Hero />
      <StatsGrid />
      <Services />
      <QuickLinks page="home" />
      <Footer />
    </div>
  );
}

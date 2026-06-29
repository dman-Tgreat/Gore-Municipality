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
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      <Header />
      <Hero />
      <StatsGrid />
      <Services />
      <QuickLinks page="home" />
      <Footer />
    </div>
  );
}

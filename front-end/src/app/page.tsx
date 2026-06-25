import React from 'react';
import Header from '@/component/Header';
import Hero from '@/component/Hero';
import StatsGrid from '@/component/StatsGrid'; 
import Services from '@/component/Services';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <Hero />
      <StatsGrid />
      <Services />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gore Woreda Administration. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
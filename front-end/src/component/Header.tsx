'use client'; // This must be a client component because it checks the active URL path dynamically

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 1. Import the hook to track the active route

export default function Header() {
  const pathname = usePathname(); // 2. Get the current active URL path (e.g., "/" or "/contact")

  // 3. Helper function to apply the red color only if the path matches exactly
  const linkStyle = (path: string) => {
    const isActive = pathname === path;
    return `transition font-medium text-sm ${
      isActive 
        ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1' // Active look: Red text with a clean underline
        : 'text-gray-600 hover:text-red-600'                     // Inactive look: Gray text turning red on hover
    }`;
  };

  return (
    <header className="bg-white text-gray-800 shadow-sm border-b border-gray-100 relative z-20 sticky top-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
          <img 
            src="https://via.placeholder.com/50/cc0000/ffffff?text=GW" 
            alt="Gore Woreda Emblem" 
            className="w-10 h-10 object-contain rounded-full bg-red-600 p-1"
          />
          <h1 className="text-2xl font-black tracking-wide text-red-600">Gore Woreda</h1>
        </Link>
        
        {/* Navigation Links with Dynamic Active Coloring */}
        <nav className="space-x-6 flex items-center">
          <Link href="/" className={linkStyle('/')}>Home</Link>
          <Link href="/news" className={linkStyle('/news')}>About</Link>
          <Link href="/#services" className={linkStyle('/services')}>Services</Link>
          <Link href="/news" className={linkStyle('/news')}>News</Link>
          <Link href="/contact" className={linkStyle('/contact')}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
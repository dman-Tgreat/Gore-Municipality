import React from 'react';
import Link from 'next/link'; // 1. Import the Next.js Link component

export default function Header() {
  return (
    <header className="bg-green-700 text-white shadow-md relative z-20 sticky top-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Clicking the Logo or Title also takes you Home */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
          <img 
            src="https://via.placeholder.com/50" 
            alt="Gore Woreda Emblem" 
            className="w-10 h-10 object-contain rounded-full bg-white p-1"
          />
          <h1 className="text-2xl font-bold tracking-wide">Gore Woreda Municipality</h1>
        </Link>
        
        {/* 2. Updated Navigation using <Link> */}
        <nav className="space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/#services" className="hover:underline">About</Link>
          <Link href="/#services" className="hover:underline">Services</Link>
          <Link href="/#services" className="hover:underline">News</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
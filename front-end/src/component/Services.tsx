import React from 'react';

export default function Services() {
  return (
    <main id="services" className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 scroll-mt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">Latest News</h3>
        <p className="text-gray-600 text-sm mb-4">Stay updated with the recent public notices and community announcements.</p>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">No recent updates</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">Municipal Services</h3>
        <p className="text-gray-600 text-sm mb-4">Apply for certificates, business licenses, and permit guidelines online.</p>
        <a href="#" className="text-emerald-600 font-medium hover:underline text-sm">View all services →</a>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">About Gore</h3>
        <p className="text-gray-600 text-sm mb-4">Discover the rich history and geographic beauty of our historic woreda.</p>
        <a href="#" className="text-emerald-600 font-medium hover:underline text-sm">Read History →</a>
      </div>
    </main>
  );
}
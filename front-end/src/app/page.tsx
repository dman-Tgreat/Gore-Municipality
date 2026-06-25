import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header / Navigation */}
      <header className="bg-green-700 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">Gore Woreda Municipality</h1>
          <nav className="space-x-6">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Services</a>
            <a href="#" className="hover:underline">News</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to the Official Portal of Gore Woreda</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Providing transparent digital services, community updates, and developmental insights for our citizens.
          </p>
          <button className="mt-6 bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition">
            Explore Services
          </button>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-green-700 mb-2">Latest News</h3>
          <p className="text-gray-600 text-sm mb-4">Stay updated with the recent public notices and community announcements from the administration.</p>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">No recent updates</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-green-700 mb-2">Municipal Services</h3>
          <p className="text-gray-600 text-sm mb-4">Apply for certificates, business licenses, land permits, and review community guidelines online.</p>
          <a href="#" className="text-emerald-600 font-medium hover:underline text-sm">View all services →</a>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-green-700 mb-2">About Gore</h3>
          <p className="text-gray-600 text-sm mb-4">Discover the rich history, geographic beauty, and investment opportunities within our historic woreda.</p>
          <a href="#" className="text-emerald-600 font-medium hover:underline text-sm">Read History →</a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gore Woreda Administration. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
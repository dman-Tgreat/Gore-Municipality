import React from 'react';
import Header from '@/component/Header';

export default function NewsPage() {
  const newsArticles = [
    {
      title: "Gummaro Tea Plantation Modernization Support Initiated",
      date: "June 2026",
      tag: "Economy",
      summary: "The woreda administration launched a joint infrastructure evaluation framework to upgrade rural roads routing to the historic 800-hectare Gummaro Estate—the largest tea plantation in the country—boosting local logistics."
    },
    {
      title: "Woreda Administration Announces New Honey Production Quality Incentives",
      date: "May 2026",
      tag: "Agriculture",
      summary: "Known throughout the region for its high-quality highland honey, the municipal administration is rolling out training packages and equipment subsidies for local Oromo apiculture cooperatives."
    },
    {
      title: "Preserving Historical Landmark Heritage Sites in Gore Town",
      date: "April 2026",
      tag: "Culture",
      summary: "A preservation committee has been assigned to safeguard architectural elements surrounding the early 20th-century palace compound of Ras Tessema Nadew, dating back to Gore's golden era as a premier western trade post."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">News, Notices & Woreda Profile</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              Stay fully informed on administrative developments, regional announcements, and the rich cultural landscape of Gore.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl grid md:grid-cols-3 gap-12">
          {/* Main Feed Column (Left 2/3) */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Latest Press Releases</h2>
            {newsArticles.map((article, idx) => (
              <article key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">{article.tag}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-green-800 hover:underline cursor-pointer">{article.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{article.summary}</p>
              </article>
            ))}
          </div>

          {/* Quick Profile Sidebar (Right 1/3) */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit space-y-6">
            <h2 className="text-lg font-bold text-green-800 border-b pb-2">Gore Quick Facts</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">Administrative Capital</span>
                <p className="text-gray-800 font-medium">Gore Town (Capital of Gore Woreda, Illubabor Zone, Oromia)</p>
              </div>
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">Historical Roots</span>
                <p className="text-gray-800 text-sm">Founded in the late 19th Century around Ras Tessema Nadew's historical administrative compound.</p>
              </div>
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">Primary Economics</span>
                <p className="text-gray-800 text-sm">Renowned for coffee trade legacy via historical Gambela Baro river channels, organic honey cultivation, and local tea manufacturing.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Gore Woreda Administration. All rights reserved.</p>
      </footer>
    </div>
  );
}
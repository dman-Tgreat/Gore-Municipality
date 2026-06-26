import React from 'react';

export default function StatsGrid() {
  const stats = [
    { label: "Total Population", value: "Over 90,000", detail: "Urban & rural settlements combined" },
    { label: "Total Area Coverage", value: "Approx. 650 km²", detail: "Rich highland forest geography" },
    { label: "Administrative Division", value: "22 Kebeles", detail: "Governed municipal sectors" },
    { label: "Primary Economic Engine", value: "Agriculture", detail: "Premium Tea, Coffee, & Apiculture" },
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-12 my-6">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold text-red-600 mb-2">Woreda Indicators</h2>
          <p className="text-2xl font-black text-gray-900">Gore At A Glance</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 text-center hover:border-red-100 hover:bg-white transition duration-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-red-600 tracking-tight my-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Header from '@/component/Header'; // Adjust path based on your folder structure

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you will eventually connect to your NestJS backend API!
    alert(`Thank you ${formData.name}! Your message has been submitted placeholder style.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Page Title Header */}
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">Contact Our Administration</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm md:text-base">
              Have questions, feedback, or need official assistance? Reach out to the Gore Woreda municipal offices.
            </p>
          </div>
        </section>

        {/* Main Content: Split Form & Info Split */}
        <main className="container mx-auto px-6 py-12 max-w-6xl grid md:grid-cols-5 gap-12">
          
          {/* Column 1: Contact details Info (Takes 2/5 columns) */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Get In Touch</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our administrative offices are open Monday through Friday, handling public inquiries, licensing registration, and civic services.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office Location</h3>
                  <p className="text-gray-600 text-sm">Main Municipal Building, Gore Woreda,</p>
                  <p className="text-gray-600 text-sm">Illubabor Zone, Oromia, Ethiopia</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">📞</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Directory</h3>
                  <p className="text-gray-600 text-sm">Main Office: +251 47 XXXXXXX</p>
                  <p className="text-gray-600 text-sm">Public Relations: +251 47 XXXXXXX</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">✉️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Electronic Mail</h3>
                  <p className="text-gray-600 text-sm">info@goreworeda.gov.et</p>
                  <p className="text-gray-600 text-sm">support@goreworeda.gov.et</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: The Interactive Contact Form (Takes 3/5 columns) */}
          <div className="md:col-span-3 bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Direct Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm transition"
                    placeholder="Abebe Kebede"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm transition"
                    placeholder="abebe@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm transition"
                  placeholder="Inquiry regarding business permits"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Message Content</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm transition resize-none"
                  placeholder="Write your message detailed here..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-green-700 text-white font-semibold py-3 px-4 rounded-md hover:bg-green-600 transition shadow-md"
              >
                Submit Form
              </button>
            </form>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gore Woreda Administration. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import Header from '@/component/Header';
import QuickLinks from '@/component/QuickLinks';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { contactApi } from '@/lib/api';

export default function ContactPage() {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to submit. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Page Title Header */}
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.contact.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm md:text-base">
              {t.contact.subtitle}
            </p>
          </div>
        </section>

        {/* Main Content: Split Form & Info Split */}
        <main className="container mx-auto px-6 py-12 max-w-6xl grid md:grid-cols-5 gap-12">
          
          {/* Column 1: Contact details Info (Takes 2/5 columns) */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">{t.contact.getInTouch}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.contact.description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.contact.officeLocation}</h3>
                  <p className="text-gray-600 text-sm">{t.contact.officeAddress1}</p>
                  <p className="text-gray-600 text-sm">{t.contact.officeAddress2}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">📞</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.contact.phone}</h3>
                  <p className="text-gray-600 text-sm">{t.contact.mainOffice}</p>
                  <p className="text-gray-600 text-sm">{t.contact.publicRelations}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">✉️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.contact.email}</h3>
                  <p className="text-gray-600 text-sm">info@goreworeda.gov.et</p>
                  <p className="text-gray-600 text-sm">support@goreworeda.gov.et</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: The Interactive Contact Form (Takes 3/5 columns) */}
          <div className="md:col-span-3 bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.contact.sendMessage}</h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <p className="text-xl font-semibold text-green-700">✓ {t.contact.thankYou}!</p>
                <p className="text-gray-600 mt-2">{t.contact.messageSent}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">{t.contact.fullName}</label>
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">{t.contact.emailAddress}</label>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">{t.contact.subject}</label>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">{t.contact.messageContent}</label>
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
                  {t.contact.submit}
                </button>
              </form>
            )}
          </div>

        </main>
      </div>

      <QuickLinks page="contact" />

      <Footer />
    </div>
  );
}

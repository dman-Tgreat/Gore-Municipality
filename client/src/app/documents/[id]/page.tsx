'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { documentsApi, type Document } from '@/lib/api';

const categoryIcons: Record<string, string> = {
  policy: '📋',
  report: '📊',
  form: '📝',
  regulation: '⚖️',
  minutes: '📑',
  budget: '💰',
  plan: '📐',
  notice: '📢',
};

function getFileTypeLabel(fileUrl: string): string {
  const ext = fileUrl.split('.').pop()?.toUpperCase() || '';
  if (ext === 'PDF') return 'PDF Document';
  if (['DOC', 'DOCX'].includes(ext)) return 'Word Document';
  if (['XLS', 'XLSX', 'CSV'].includes(ext)) return 'Spreadsheet';
  if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'].includes(ext)) return 'Image';
  return 'File';
}

function isImageFile(fileUrl: string): boolean {
  const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);
}

function isPdfFile(fileUrl: string): boolean {
  return fileUrl.toLowerCase().endsWith('.pdf');
}

export default function DocumentDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const id = Number(params.id);

  const [doc, setDoc] = useState<Document | null>(null);
  const [related, setRelated] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch the document
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    documentsApi.getOne(id)
      .then((document) => {
        setDoc(document);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch related documents once the current doc is loaded
  useEffect(() => {
    if (!doc) return;
    documentsApi.getAll()
      .then((allDocs) => {
        const sameCategory = allDocs
          .filter((d) => d.category === doc.category && d.id !== doc.id)
          .slice(0, 3);
        setRelated(sameCategory);
      })
      .catch(() => {});
  }, [doc]);

  const icon = categoryIcons[doc?.category || ''] || '📁';

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
        <Header />
        <div className="container mx-auto px-6 py-16 max-w-4xl animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !doc) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <p className="text-5xl mb-4">📂</p>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.documents.documentNotFound}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{t.documents.documentNotFoundDesc}</p>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-700 transition"
          >
            {t.documents.backToDocuments}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Category Hero Banner */}
        <div className="bg-slate-800 text-white">
          <div className="container mx-auto px-6 py-10 max-w-4xl">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium transition mb-4"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.documents.backToDocuments}
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-sm shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                  {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                </span>
                <h1 className="text-2xl md:text-3xl font-black leading-tight">{tField(doc, 'title', locale)}</h1>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-6 py-10 max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* File Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {isImageFile(doc.fileUrl) ? (
                  <img
                    src={doc.fileUrl}
                    alt={doc.title}
                    className="w-full max-h-[500px] object-contain bg-white dark:bg-slate-800"
                  />
                ) : isPdfFile(doc.fileUrl) ? (
                  <iframe
                    src={doc.fileUrl}
                    title={doc.title}
                    className="w-full h-[500px]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 dark:bg-slate-800">
                    <span className="text-6xl mb-4">{icon}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{getFileTypeLabel(doc.fileUrl)}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Preview not available for this file type</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{t.documents.documentDetail}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">{tField(doc, 'description', locale)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {t.documents.view}
                </a>
                <a
                  href={doc.fileUrl}
                  download
                  className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {t.documents.download}
                </a>
              </div>
            </div>

            {/* Sidebar - Metadata */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t.documents.documentDetail}</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">{t.documents.category}</span>
                    <span className="inline-block bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">{t.documents.fileType}</span>
                    <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-white text-xs font-medium">
                      <span className="text-base">{icon}</span>
                      {getFileTypeLabel(doc.fileUrl)}
                    </span>
                  </div>
                  {doc.createdBy && (
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">{t.documents.uploadedBy}</span>
                      <p className="text-slate-800 dark:text-white text-xs font-medium">{doc.createdBy.fullName}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">{t.documents.uploadedOn}</span>
                    <p className="text-slate-800 dark:text-white text-xs font-medium">{formatDate(doc.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">{t.documents.lastUpdated}</span>
                    <p className="text-slate-800 dark:text-white text-xs font-medium">{formatDate(doc.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              {related.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{t.documents.relatedDocuments}</h3>
                  <div className="space-y-3">
                    {related.map((relDoc) => {
                      const relIcon = categoryIcons[relDoc.category] || '📁';
                      return (
                        <Link
                          key={relDoc.id}
                          href={`/documents/${relDoc.id}`}
                          className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm shrink-0">
                            {relIcon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition truncate">
                              {tField(relDoc, 'title', locale)}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{tField(relDoc, 'description', locale)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

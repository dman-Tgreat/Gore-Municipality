'use client';

import React from 'react';
import FileUpload from '@/component/FileUpload';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function NewsTab() {
  const { t, news, newsForm, setNewsForm, handleSaveNews, handleDeleteNews, handleToggleNews, badge, emptyNewsForm } = useAdmin();
  if (newsForm.editing) return NewsForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{news.length} article{news.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setNewsForm({ editing: true, editingId: null, data: { ...emptyNewsForm } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {news.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.authorField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-4"><button onClick={() => handleToggleNews(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                    <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.createdBy?.fullName}</td>
                    <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setNewsForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', slug: item.slug, summary: item.summary, summaryAm: item.summaryAm || '', summaryOm: item.summaryOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', coverImage: item.coverImage || '', published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteNews(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function NewsForm() {
  const { t, newsForm, setNewsForm, handleSaveNews, newsSubmitting, formLang, setFormLang } = useAdmin();
  const d = newsForm.data;
  return (
    <form onSubmit={handleSaveNews} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{newsForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsNews}</h2>
        <button type="button" onClick={() => setNewsForm({ editing: false, editingId: null, data: { title: '', titleAm: '', titleOm: '', slug: '', summary: '', summaryAm: '', summaryOm: '', content: '', contentAm: '', contentOm: '', coverImage: '', published: true } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <LangBarInline formLang={formLang} setFormLang={setFormLang} />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
            onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.slugField}</label>
          <input type="text" value={d.slug} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, slug: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder="Auto-generated if empty" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea required={formLang === 'en'} value={formLang === 'en' ? d.summary : formLang === 'am' ? (d.summaryAm || '') : (d.summaryOm || '')}
            onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {summary: v} : formLang === 'am' ? {summaryAm: v} : {summaryOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea required={formLang === 'en'} value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
            onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.coverImageField}</label>
          <FileUpload existingUrl={d.coverImage} onUpload={(url) => setNewsForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Cover Image" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
          <select value={d.published ? 'true' : 'false'} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="true">{t.admin.publishedBadge}</option>
            <option value="false">{t.admin.draftBadge}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={newsSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {newsSubmitting && <Spinner className="w-4 h-4" />}
          {newsSubmitting ? t.admin.saving : t.admin.saveItem}
        </button>
      </div>
    </form>
  );
}

function LangBarInline({ formLang, setFormLang }: { formLang: 'en' | 'am' | 'om'; setFormLang: (v: 'en' | 'am' | 'om') => void }) {
  return (
    <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1 w-fit">
      {(['en', 'am', 'om'] as const).map((lang) => (
        <button key={lang} type="button" onClick={() => setFormLang(lang)}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
            formLang === lang
              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}>
          {lang === 'en' ? 'EN' : lang === 'am' ? 'AM' : 'OM'}
        </button>
      ))}
    </div>
  );
}

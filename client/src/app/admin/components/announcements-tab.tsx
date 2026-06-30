'use client';

import React from 'react';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function AnnouncementsTab() {
  const { t, announcements, annForm, setAnnForm, handleSaveAnn, handleDeleteAnn, handleToggleAnn, badge, emptyAnnouncementForm } = useAdmin();
  if (annForm.editing) return AnnouncementsForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setAnnForm({ editing: true, editingId: null, data: { ...emptyAnnouncementForm } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {announcements.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
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
                {announcements.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-4"><button onClick={() => handleToggleAnn(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                    <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.createdBy?.fullName}</td>
                    <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setAnnForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteAnn(item.id); }}
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

function AnnouncementsForm() {
  const { t, annForm, setAnnForm, handleSaveAnn, annSubmitting, formLang, setFormLang } = useAdmin();
  const d = annForm.data;
  return (
    <form onSubmit={handleSaveAnn} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{annForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsAnnouncements}</h2>
        <button type="button" onClick={() => setAnnForm({ editing: false, editingId: null, data: { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', published: true } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <LangBarInline formLang={formLang} setFormLang={setFormLang} />
      <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
        <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
          onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" /></div>
      <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
        <textarea required={formLang === 'en'} value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
          onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} /></div>
      <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
        <textarea required={formLang === 'en'} value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
          onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} /></div>
      <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
        <select value={d.published ? 'true' : 'false'} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
          <option value="true">{t.admin.publishedBadge}</option>
          <option value="false">{t.admin.draftBadge}</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={annSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {annSubmitting && <Spinner className="w-4 h-4" />}
          {annSubmitting ? t.admin.saving : t.admin.saveItem}
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

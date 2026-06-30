'use client';

import React from 'react';
import FileUpload from '@/component/FileUpload';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function InvestmentsTab() {
  const { t, investments, invForm, setInvForm, handleSaveInvestment, handleDeleteInvestment, handleToggleInvestment, badge, emptyInvestmentForm } = useAdmin();
  if (invForm.editing) return InvestmentsForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{investments.length} investment{investments.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setInvForm({ editing: true, editingId: null, data: { ...emptyInvestmentForm } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {investments.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Category</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {investments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-4"><button onClick={() => handleToggleInvestment(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                    <td className="p-4 text-xs text-slate-500 hidden md:table-cell dark:text-slate-400">{item.category}</td>
                    <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setInvForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', category: item.category, coverImage: item.coverImage || '', location: item.location || '', contactPhone: item.contactPhone || '', contactEmail: item.contactEmail || '', published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteInvestment(item.id); }}
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

function InvestmentsForm() {
  const { t, invForm, setInvForm, handleSaveInvestment, invSubmitting, formLang, setFormLang } = useAdmin();
  const d = invForm.data;
  return (
    <form onSubmit={handleSaveInvestment} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{invForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsInvestments}</h2>
        <button type="button" onClick={() => setInvForm({ editing: false, editingId: null, data: { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', category: 'opportunity', coverImage: '', location: '', contactPhone: '', contactEmail: '', published: true } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <LangBarInline formLang={formLang} setFormLang={setFormLang} />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
            onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
          <select value={d.category} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="opportunity">Opportunity</option>
            <option value="attraction">Attraction</option>
            <option value="incentive">Incentive</option>
            <option value="accommodation">Accommodation</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
            onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
            onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={6} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
          <input type="text" value={d.location} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cover Image</label>
          <FileUpload existingUrl={d.coverImage} onUpload={(url) => setInvForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Image" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
          <input type="text" value={d.contactPhone} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactPhone: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Email</label>
          <input type="email" value={d.contactEmail} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactEmail: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
          <select value={d.published ? 'true' : 'false'} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="true">{t.admin.publishedBadge}</option>
            <option value="false">{t.admin.draftBadge}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={invSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {invSubmitting && <Spinner className="w-4 h-4" />}
          {invSubmitting ? t.admin.saving : t.admin.saveItem}
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

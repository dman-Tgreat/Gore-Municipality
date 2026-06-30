'use client';

import React from 'react';
import FileUpload from '@/component/FileUpload';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function ProjectsTab() {
  const { t, projects, projForm, setProjForm, handleSaveProject, handleDeleteProject, badge, emptyProjectForm } = useAdmin();
  if (projForm.editing) return ProjectsForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setProjForm({ editing: true, editingId: null, data: { ...emptyProjectForm } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {projects.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.nameField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.budgetField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Date</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {projects.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.name}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' :
                        item.status === 'ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>{item.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.budget ? `ETB ${Number(item.budget).toLocaleString()}` : '-'}</td>
                    <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setProjForm({ editing: true, editingId: item.id, data: { name: item.name, nameAm: item.nameAm || '', nameOm: item.nameOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', budget: Number(item.budget) || 0, status: item.status, startDate: item.startDate || '', endDate: item.endDate || '', location: item.location || '', coverImage: item.coverImage || '', fundingSource: item.fundingSource || '', contractor: item.contractor || '', category: item.category || '' } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteProject(item.id); }}
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

function ProjectsForm() {
  const { t, projForm, setProjForm, handleSaveProject, projSubmitting, formLang, setFormLang } = useAdmin();
  const d = projForm.data;
  return (
    <form onSubmit={handleSaveProject} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{projForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsProjects}</h2>
        <button type="button" onClick={() => setProjForm({ editing: false, editingId: null, data: { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', budget: 0, status: 'planned' as const, startDate: '', endDate: '', location: '', coverImage: '', fundingSource: '', contractor: '', category: '' } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <LangBarInline formLang={formLang} setFormLang={setFormLang} />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.name : formLang === 'am' ? (d.nameAm || '') : (d.nameOm || '')}
            onChange={(e) => { const v = e.target.value; setProjForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {name: v} : formLang === 'am' ? {nameAm: v} : {nameOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
          <select value={d.status} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, status: e.target.value as 'planned' | 'ongoing' | 'completed' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
            onChange={(e) => { const v = e.target.value; setProjForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.budgetField}</label>
          <input type="number" value={d.budget} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, budget: Number(e.target.value) } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
          <input type="text" value={d.location} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
          <input type="date" value={d.startDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, startDate: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
          <input type="date" value={d.endDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, endDate: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Funding Source</label>
          <input type="text" value={d.fundingSource} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, fundingSource: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contractor</label>
          <input type="text" value={d.contractor} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, contractor: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
          <input type="text" value={d.category} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cover Image</label>
          <FileUpload existingUrl={d.coverImage} onUpload={(url) => setProjForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Cover Image" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={projSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {projSubmitting && <Spinner className="w-4 h-4" />}
          {projSubmitting ? t.admin.saving : t.admin.saveItem}
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

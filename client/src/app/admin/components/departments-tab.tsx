'use client';

import React from 'react';
import FileUpload from '@/component/FileUpload';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function DepartmentsTab() {
  const { t, departments, deptForm, setDeptForm, handleSaveDept, handleDeleteDept, badge, emptyDeptForm } = useAdmin();
  if (deptForm.editing) return DepartmentsForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setDeptForm({ editing: true, editingId: null, data: { ...emptyDeptForm } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {departments.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.nameField}</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Head</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Contact</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {departments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.name}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{item.head || '-'}</td>
                    <td className="p-4 text-xs text-slate-500 hidden md:table-cell dark:text-slate-400">{item.email || item.phone || '-'}</td>
                    <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setDeptForm({ editing: true, editingId: item.id, data: { name: item.name, nameAm: item.nameAm || '', nameOm: item.nameOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', head: item.head || '', phone: item.phone || '', email: item.email || '', office: item.office || '', image: item.image || '' } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteDept(item.id); }}
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

function DepartmentsForm() {
  const { t, deptForm, setDeptForm, handleSaveDept, deptSubmitting, formLang, setFormLang } = useAdmin();
  const d = deptForm.data;
  return (
    <form onSubmit={handleSaveDept} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{deptForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsDepartments}</h2>
        <button type="button" onClick={() => setDeptForm({ editing: false, editingId: null, data: { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', head: '', phone: '', email: '', office: '', image: '' } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <LangBarInline formLang={formLang} setFormLang={setFormLang} />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.name : formLang === 'am' ? (d.nameAm || '') : (d.nameOm || '')}
            onChange={(e) => { const v = e.target.value; setDeptForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {name: v} : formLang === 'am' ? {nameAm: v} : {nameOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Head</label>
          <input type="text" value={d.head} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, head: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
            onChange={(e) => { const v = e.target.value; setDeptForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone</label>
          <input type="text" value={d.phone} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, phone: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
          <input type="email" value={d.email} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, email: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Office</label>
          <input type="text" value={d.office} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, office: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image</label>
          <FileUpload existingUrl={d.image} onUpload={(url) => setDeptForm((p) => ({ ...p, data: { ...p.data, image: url } }))} label="Upload Image" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={deptSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {deptSubmitting && <Spinner className="w-4 h-4" />}
          {deptSubmitting ? t.admin.saving : t.admin.saveItem}
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

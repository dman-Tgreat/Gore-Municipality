'use client';

import React from 'react';
import FileUpload from '@/component/FileUpload';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function HeroSlidesTab() {
  const { t, heroSlides, slideForm, setSlideForm, handleSaveSlide, handleDeleteSlide, badge } = useAdmin();
  if (slideForm.editing) return HeroSlidesForm();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setSlideForm({ editing: true, editingId: null, data: { imageUrl: '', description: '', sortOrder: heroSlides.length, isActive: true } })}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
      </div>
      {heroSlides.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Image</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Description</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Order</th>
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Active</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {heroSlides.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-16 h-10 object-cover rounded border border-slate-200 dark:border-slate-600" />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">{item.description || '-'}</td>
                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{item.sortOrder}</td>
                    <td className="p-4">{badge(item.isActive)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSlideForm({ editing: true, editingId: item.id, data: { imageUrl: item.imageUrl || '', description: item.description || '', sortOrder: item.sortOrder, isActive: item.isActive } })}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteSlide(item.id); }}
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

function HeroSlidesForm() {
  const { t, slideForm, setSlideForm, handleSaveSlide, slideSubmitting } = useAdmin();
  const d = slideForm.data;
  return (
    <form onSubmit={handleSaveSlide} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{slideForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsHeroSlides}</h2>
        <button type="button" onClick={() => setSlideForm({ editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true } })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL</label>
          <FileUpload existingUrl={d.imageUrl} onUpload={(url) => setSlideForm((p) => ({ ...p, data: { ...p.data, imageUrl: url } }))} label="Upload Slide Image" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
          <textarea value={d.description} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Sort Order</label>
          <input type="number" value={d.sortOrder} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, sortOrder: Number(e.target.value) } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Active</label>
          <select value={d.isActive ? 'true' : 'false'} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, isActive: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={slideSubmitting}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {slideSubmitting && <Spinner className="w-4 h-4" />}
          {slideSubmitting ? t.admin.saving : t.admin.saveItem}
        </button>
      </div>
    </form>
  );
}

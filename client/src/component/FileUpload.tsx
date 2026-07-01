'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FileText } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  existingUrl?: string;
  accept?: string;
  label?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function FileUpload({
  onUpload,
  existingUrl,
  accept = 'image/*,.pdf,.doc,.docx',
  label = 'Upload File',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingUrl || '');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Show local preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Read JWT token from localStorage (set by admin login)
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

      // IMPORTANT: Do NOT pass a headers object at all when using FormData.
      // The browser MUST auto-set Content-Type: multipart/form-data; boundary=...
      // Passing any custom headers object can prevent this in some environments.
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Upload failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        setPreview(data.url);
        onUpload(data.url);
      }
    } catch (err) {
      if (file.type.startsWith('image/')) setPreview('');
      console.error('Upload error:', err);
      const message = err instanceof Error ? err.message : 'Upload failed';
      alert(message);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const isImage = preview && (preview.startsWith('/uploads/') || preview.startsWith('data:image'));

  return (
    <div>
      {preview ? (
        <div className="relative group">
          {isImage ? (
            <img
              src={preview.startsWith('/uploads/') ? `${API_BASE}${preview}` : preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-12 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 truncate">
              <FileText className="w-4 h-4 inline-block mr-1" /> {preview.split('/').pop()}
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition ${
            dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </div>
          ) : (
            <>
              <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-xs text-gray-400 mt-0.5">Click or drag & drop</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

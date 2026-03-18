'use client';

import { useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'event-covers',
}: ImageUploadProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setError('');

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, WebP, GIF).');
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        setError('Image must be under 8 MB.');
        return;
      }

      setUploading(true);

      const ext = file.name.split('.').pop() ?? 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: false, cacheControl: '3600' });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
      setUploading(false);
    },
    [supabase, bucket, onChange],
  );

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) upload(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = () => {
    onChange('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // Preview state
  if (value) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted">Cover Image</p>
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={value}
            alt="Event cover"
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
            <span className="text-xs text-white/70 truncate max-w-[70%]">
              {value.split('/').pop()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-md bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-muted">Cover Image</p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragging
            ? 'border-accent bg-accent/5'
            : 'border-border bg-surface/50 hover:border-accent/50 hover:bg-surface'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-muted">Uploading…</p>
          </div>
        ) : (
          <>
            {/* Upload icon */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition-colors ${dragging ? 'border-accent' : ''}`}>
              <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
              </p>
              <p className="mt-1 text-xs text-muted">JPG, PNG, WebP, GIF — max 8 MB</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

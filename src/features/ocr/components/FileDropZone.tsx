'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileCheck, ImagePlus } from 'lucide-react';

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  icon?: 'upload' | 'image';
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FileDropZone({
  accept,
  multiple = false,
  files,
  onFilesSelected,
  icon = 'upload',
  title,
  subtitle,
  className = '',
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const acceptedExts = accept.split(',').map(ext => ext.trim().toLowerCase());
    const mimeMap: Record<string, string[]> = {
      '.jpg': ['image/jpeg'], '.jpeg': ['image/jpeg'], '.png': ['image/png'],
      '.webp': ['image/webp'], '.pdf': ['application/pdf'],
      '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      '.csv': ['text/csv'],
    };
    const expectedMimes = acceptedExts.flatMap(e => mimeMap[e] || []);
    const validFiles = droppedFiles.filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return acceptedExts.includes(ext) || (expectedMimes.length > 0 && expectedMimes.includes(f.type));
    });
    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }
  }, [accept, multiple, onFilesSelected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  const hasFiles = files.length > 0;
  const IconComponent = icon === 'image' ? ImagePlus : (hasFiles ? FileCheck : Upload);

  const defaultTitle = hasFiles
    ? `${files.length} file: ${files.map(f => f.name).join(', ')}`
    : 'Click để chọn file hoặc kéo thả vào đây';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={hasFiles ? `${files.length} file đã chọn` : 'Chọn file để upload'}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
        isDragging
          ? 'border-[#059669] bg-[#f0fdf9] scale-[1.01]'
          : hasFiles
            ? 'border-[#059669] bg-[#f0fdf9]'
            : 'border-[#d1fae5] hover:border-[#059669] hover:bg-[#f0fdf9]'
      } ${className}`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
      />
      <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 ${
        hasFiles || isDragging ? 'text-[#059669]' : 'text-[#94a3b8]'
      }`}>
        <IconComponent size={32} />
      </div>
      <p className="text-[#0f172a] font-bold mb-1 text-center">{title || defaultTitle}</p>
      <p className="text-[#94a3b8] text-[11px] text-center">{subtitle || `Hỗ trợ ${accept}`}</p>
    </div>
  );
}

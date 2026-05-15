'use client';

import React, { useRef, useEffect, useState } from 'react';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  image?: string | null;
  onImageSelect?: (base64: string | null) => void;
  disabled?: boolean;
}

const MAX_IMAGE_SIZE_MB = 4;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const FORMULA_PALETTE = [
  { label: 'Phân số', tex: '\\frac{ }{ }', icon: 'a/b' },
  { label: 'Căn bậc 2', tex: '\\sqrt{ }', icon: '√x' },
  { label: 'Lũy thừa', tex: '^{ }', icon: 'xⁿ' },
  { label: 'Tích phân', tex: '\\int_{ }^{ }', icon: '∫' },
  { label: 'Tổng (Sigma)', tex: '\\sum_{ }^{ }', icon: 'Σ' },
];

export default function MathInput({ value, onChange, onEnter, image, onImageSelect, disabled }: MathInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPalette, setShowPalette] = useState(false);

  // Sync value from props & auto-resize
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value;
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    } else if (e.key === '/') {
      // Optional: open palette on '/'
      // e.preventDefault();
      // setShowPalette((prev) => !prev);
    } else if (e.key === 'Escape') {
      setShowPalette(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const insertFormula = (tex: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    // Wrap in $ $ for KaTeX rendering in MessageBubble
    const insertString = `$${tex}$`;

    // Place cursor inside the first { } placeholder
    const firstBraceContent = tex.indexOf('{ }');
    const cursorOffset = firstBraceContent !== -1
      ? firstBraceContent + 2 // position after "{ " → inside braces
      : tex.length; // fallback: end of formula
    const finalOffset = cursorOffset + 1; // +1 for the opening $

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    const newValue = value.substring(0, start) + insertString + value.substring(end);
    onChange(newValue);

    const newCursorPos = start + finalOffset;

    // Reset cursor position after React re-renders
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    setShowPalette(false);
  };

  const compressImage = (dataUrl: string, maxWidth = 1024): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  };

  const readFileAsBase64 = (file: File) => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert(`Ảnh quá lớn (tối đa ${MAX_IMAGE_SIZE_MB}MB). Vui lòng chọn ảnh nhỏ hơn.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const raw = event.target?.result as string;
      const compressed = await compressImage(raw);
      if (onImageSelect) onImageSelect(compressed);
    };
    reader.onerror = () => {
      console.error('Failed to read image file');
      alert('Không thể đọc file ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFileAsBase64(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          readFileAsBase64(file);
        }
        e.preventDefault();
        break;
      }
    }
  };

  const removeImage = () => {
    if (onImageSelect) onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative flex-1 flex flex-col gap-2">
      {/* Image Preview inside input area */}
      {image && (
        <div className="relative inline-block w-20 h-20 ml-2 mt-2">
          <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        {/* Formula Palette Popup */}
      {showPalette && (
        <div 
          className="absolute bottom-[calc(100%+12px)] left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-2 z-50 animate-in fade-in zoom-in-95 duration-200"
          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
        >
          {FORMULA_PALETTE.map((formula, i) => (
            <button
              key={i}
              type="button"
              onClick={() => insertFormula(formula.tex)}
              className="h-9 min-w-[40px] px-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-gray-700 rounded-lg text-sm font-semibold transition-all border border-gray-200 flex items-center justify-center"
              title={formula.label}
            >
              {formula.icon}
            </button>
          ))}
        </div>
      )}

        <button
          type="button"
          onClick={() => setShowPalette(!showPalette)}
          className={`flex-shrink-0 w-8 h-8 mb-[4px] rounded-lg flex items-center justify-center transition-all font-serif italic font-bold text-sm ${
            showPalette ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500 hover:bg-gray-200'
          }`}
          title="Mở bảng công thức"
        >
          ƒx
        </button>

        {/* Attachment Button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange} 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-8 h-8 mb-[4px] rounded-lg flex items-center justify-center transition-all text-gray-500 hover:bg-gray-200"
          title="Đính kèm ảnh"
        >
          📎
        </button>

        {/* Textarea Input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={disabled}
        placeholder="Nhập câu hỏi Toán học của bạn..."
          className={`flex-1 resize-none outline-none bg-transparent p-2 text-[15px] ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ color: '#0f172a', lineHeight: '1.5', minHeight: '40px', maxHeight: '120px' }}
          rows={1}
        />
      </div>
    </div>
  );
}

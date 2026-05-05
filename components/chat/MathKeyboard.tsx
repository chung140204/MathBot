import React from 'react';

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
}

const MATH_SYMBOLS = [
  { label: '√x', value: '\\sqrt{#?}' },
  { label: 'x²', value: '^2' },
  { label: 'x³', value: '^3' },
  { label: 'xⁿ', value: '^{#?}' },
  { label: 'a/b', value: '\\frac{#?}{#?}' },
  { label: '∫', value: '\\int_{#?}^{#?}' },
  { label: 'π', value: '\\pi' },
  { label: '∞', value: '\\infty' },
  { label: 'Σ', value: '\\sum_{#?}^{#?}' },
  { label: 'lim', value: '\\lim_{x \\to #?}' },
  { label: '|x|', value: '|#?|' },
  { label: 'log', value: '\\log_{#?}(#?)' },
  { label: 'ln', value: '\\ln(#?)' },
  { label: 'sin', value: '\\sin(#?)' },
  { label: 'cos', value: '\\cos(#?)' },
  { label: 'tan', value: '\\tan(#?)' },
  { label: '≠', value: '\\neq' },
  { label: '≤', value: '\\le' },
  { label: '≥', value: '\\ge' },
  { label: '±', value: '\\pm' },
  { label: 'θ', value: '\\theta' },
  { label: 'e', value: 'e' },
];

export default function MathKeyboard({ onInsert }: MathKeyboardProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-3 mb-3 grid grid-cols-6 sm:grid-cols-11 gap-2 w-full mx-auto">
      {MATH_SYMBOLS.map((sym, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onInsert(sym.value)}
          className="h-10 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors border border-gray-200 flex items-center justify-center"
          title={sym.value}
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
}

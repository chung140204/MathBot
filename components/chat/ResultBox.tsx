'use client';

import { BlockMath } from 'react-katex';

interface ResultBoxProps {
  label?: string;
  latex: string;
}

export default function ResultBox({ label = 'KẾT QUẢ', latex }: ResultBoxProps) {
  return (
    <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-[#f0fdf9] to-[#ecfeff] border border-[#059669]/10 text-center shadow-sm">
      <p className="text-[10px] font-black tracking-widest text-[#059669] mb-2 uppercase">
        {label}
      </p>
      <div className="text-[#059669] text-xl font-bold">
        <BlockMath math={latex} />
      </div>
    </div>
  );
}

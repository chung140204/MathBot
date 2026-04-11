'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathBlockProps {
  latex: string;
  block?: boolean;
}

export default function MathBlock({ latex, block = true }: MathBlockProps) {
  return (
    <div className="my-4 pl-4 border-l-4 border-[#059669] bg-gray-50/50 py-3 rounded-r-xl font-mono">
      {block ? (
        <div className="overflow-x-auto">
          <BlockMath math={latex} />
        </div>
      ) : (
        <InlineMath math={latex} />
      )}
    </div>
  );
}

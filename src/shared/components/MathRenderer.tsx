'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders mixed text + LaTeX content.
 * Detects $$...$$ for block math and $...$ for inline math.
 */
export default function MathRenderer({ content, className = '' }: MathRendererProps) {
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2).trim();
          return (
            <span key={i} className="block my-3">
              <BlockMath math={latex} />
            </span>
          );
        }

        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const latex = part.slice(1, -1).trim();
          return <InlineMath key={i} math={latex} />;
        }

        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

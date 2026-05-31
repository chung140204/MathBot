'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function wrapRawLatexInLine(line: string): string {
  const match = line.match(/^(.*?)(\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln|partial)\{.*)$/);
  if (!match) return line;
  const before = match[1];
  const mathAndAfter = match[2];
  const boundary = mathAndAfter.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) return before + '$' + boundary[1] + '$' + boundary[2] + boundary[3];
  const trailing = mathAndAfter.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1]) return before + '$' + trailing[1] + '$' + trailing[2] + trailing[3];
  return before + '$' + mathAndAfter + '$';
}

function balanceSingleDollars(line: string): string {
  const PH = '\x00\x00';
  const temp = line.replace(/\$\$/g, PH);
  const singleCount = (temp.match(/\$/g) || []).length;
  if (singleCount % 2 === 0) return line;
  const lastDollar = line.lastIndexOf('$');
  if (lastDollar === -1) return line;
  if (lastDollar > 0 && line[lastDollar - 1] === '$') return line;
  if (lastDollar < line.length - 1 && line[lastDollar + 1] === '$') return line;
  const afterDollar = line.slice(lastDollar + 1);
  const boundary = afterDollar.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) {
    const closePos = lastDollar + 1 + boundary[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }
  const trailing = afterDollar.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1].length > 0) {
    const closePos = lastDollar + 1 + trailing[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }
  return line + '$';
}

// LaTeX multi-line environments KaTeX can render inside $$ (align/align* → aligned).
const MATH_ENVS = 'aligned|align\\*?|cases|gathered|array|matrix|bmatrix|pmatrix|vmatrix';

// Relational / arrow commands that may end up between two adjacent inline-math spans.
const REL_CMDS = 'Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|longrightarrow|longleftarrow|leftrightarrow|rightarrow|leftarrow|implies|iff|mapsto|to|leq|geq|neq|approx|equiv|sim|cong|propto|in|notin|subseteq|supseteq|subset|supset|cup|cap|pm|mp|times|div|cdot|le|ge|ne|gg|ll';

// Merge two adjacent inline-math spans separated only by a bare relational/arrow
// command: `$A$\Rightarrow$B$` → `$A \Rightarrow B$`. Weaker models emit chains of
// glued spans; the command wedged between a closing `$` and an opening `$` is NOT
// inside math mode, so KaTeX never sees it and it renders as literal text (e.g.
// "\Rightarrow"). Looped to collapse chains ($A$\to$B$\to$C$). Runs before the
// $$-block protection so it only touches single-`$` inline spans.
function mergeAdjacentMathSpans(s: string): string {
  const re = new RegExp(`\\$([^$\\n]+?)\\$\\s*(\\\\(?:${REL_CMDS}))\\s*\\$([^$\\n]+?)\\$`, 'g');
  let prev: string;
  do { prev = s; s = s.replace(re, '$$$1 $2 $3$$'); } while (s !== prev);
  return s;
}

// LaTeX command names (used to tell a bare-math line from Vietnamese prose).
const LATEX_WORDS = new Set([
  'cdot','times','div','pm','mp','frac','dfrac','tfrac','sqrt','left','right','geq','leq','neq',
  'approx','equiv','Rightarrow','Leftrightarrow','Leftarrow','rightarrow','leftarrow','to','infty',
  'cap','cup','setminus','in','notin','subset','supset','bar','hat','vec','overrightarrow','overline',
  'sum','prod','int','oint','lim','sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan',
  'log','ln','exp','alpha','beta','gamma','delta','epsilon','varepsilon','zeta','eta','theta','vartheta',
  'iota','kappa','lambda','mu','nu','xi','rho','varphi','phi','chi','psi','omega','pi','sigma','tau',
  'Delta','Omega','Gamma','Sigma','Lambda','Phi','Pi','Theta','angle','perp','parallel','mathbb','mathrm',
  'mathcal','text','begin','end','cases','aligned','binom','quad','qquad','cdots','ldots','dots','vdots',
  'forall','exists','partial','nabla','circ','prime','pm','mp','land','lor','neg','Big','big','Bigg',
]);

// True when a line is essentially a bare LaTeX equation (a LaTeX command sits
// OUTSIDE any $...$ span, and there are no real Vietnamese prose words). Weaker
// models emit these half-delimited, e.g. "a \cdot b = 0 $\Rightarrow$ ...".
function isPureMathLine(line: string): boolean {
  const hadMathSpan = /\$[^$\n]+\$/.test(line);
  const outside = line
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{[^}]*\}/g, ' '); // Vietnamese inside \text{} is not prose
  const hasBareCmd = /\\[a-zA-Z]/.test(outside);
  const hasMathOps = /[=<>≤≥]|[A-Za-z0-9]\^|[A-Za-z0-9]_|\|[^|]+\|/.test(outside);
  // Treat as math only if there's bare LaTeX, or a $-span alongside bare math operators.
  if (!hasBareCmd && !(hadMathSpan && hasMathOps)) return false;
  const words = (outside.match(/[A-Za-zÀ-ỹ]{3,}/g) || []).filter((w) => !LATEX_WORDS.has(w));
  return words.length === 0; // pure math: no Vietnamese prose words left
}

export function normalizeContent(content: string): string {
  if (!content) return '';
  let result = content;

  // Pass 0: normalize multi-line LaTeX environments. Weaker models emit
  // \begin{aligned}...\end{aligned} unwrapped (no $$) and/or with stray $ inside,
  // which breaks remark-math (rendered as raw text). Convert each to a clean
  // $$-wrapped block (strip inner $, map align→aligned) and protect it with a
  // placeholder so the line-based fixes below don't mangle it.
  const blocks: string[] = [];
  result = result.replace(
    new RegExp(`\\s*\\$\{0,2}\\s*\\\\begin\\{(${MATH_ENVS})\\}([\\s\\S]*?)\\\\end\\{\\1\\}\\s*\\$\{0,2}\\s*`, 'g'),
    (_m, env: string, body: string) => {
      const e = /^align/.test(env) ? 'aligned' : env;
      const inner = body.replace(/\$/g, '');
      blocks.push(`$$\n\\begin{${e}}${inner}\n\\end{${e}}\n$$`);
      return `\n\n\x01MB${blocks.length - 1}\x01\n\n`;
    },
  );

  result = result
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/(?<!\$)\\boxed\{([^}]+)\}/g, '$$\\boxed{$1}$$')
    .replace(/\\tag\{[^}]*\}/g, '')
    .replace(/(?<!\$)\\(Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|implies|iff)/g, '$\\$1$')
    .replace(/\bundefined\b/g, '');

  // Fuse glued inline-math spans (`$A$\Rightarrow$B$`) before block protection so the
  // operator ends up inside math mode instead of rendering as literal "\Rightarrow".
  result = mergeAdjacentMathSpans(result);

  // Protect display-math blocks ($$...$$, possibly multi-line) BEFORE the per-line
  // fixes below — otherwise the bare-math-line wrapper would re-wrap their inner
  // content and break the fences. Also trims fence trailing spaces and isolates
  // each block as its own paragraph (blank lines) so remark-math parses it.
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner: string) => {
    // Strip stray single `$` inside the block. Weaker models sometimes nest an
    // inline `$...$` (e.g. around \boxed) inside the $$ Kết quả block; the literal
    // `$` is illegal in KaTeX math mode and makes it render the whole source in
    // red (errorColor). Mirrors the inner-`$` strip done for \begin{} environments.
    blocks.push(`$$\n${String(inner).replace(/\$/g, '').trim()}\n$$`);
    return `\n\n\x01MB${blocks.length - 1}\x01\n\n`;
  });

  result = result.split('\n').map(line => {
    const trimmed = line.trim();
    // Bare equation line (LaTeX command outside $, no prose words) → wrap whole line in $$.
    if (trimmed && !trimmed.includes('\x01') && isPureMathLine(trimmed)) {
      return '$$' + trimmed.replace(/\$/g, ' ').replace(/[ \t]+/g, ' ').trim() + '$$';
    }
    if (!line.includes('$') && /\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln)\{/.test(line)) {
      line = wrapRawLatexInLine(line);
    }
    return balanceSingleDollars(line);
  }).join('\n');
  const doubleDollarCount = (result.match(/\$\$/g) || []).length;
  if (doubleDollarCount % 2 === 1) result += '\n$$';

  // Re-insert the protected environment blocks (already clean $$-wrapped).
  result = result.replace(/\x01MB(\d+)\x01/g, (_m, i) => blocks[Number(i)] ?? '');
  return result;
}

export function ImageWithLightbox({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="my-4 cursor-pointer group" onClick={() => setOpen(true)}>
        <img src={src} className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96 transition-transform group-hover:scale-[1.02]" alt="Chat image" />
        <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click để phóng to</p>
      </div>
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setOpen(false)}>
          <img src={src} className="max-w-full max-h-full object-contain rounded-lg" alt="Zoomed image" />
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition-colors">×</button>
        </div>
      )}
    </>
  );
}

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const imageMatch = content.match(/^!\[.*?\]\((data:image\/[^)]+)\)\n\n?/);
  const imageSrc = imageMatch ? imageMatch[1] : null;
  const textContent = imageMatch ? content.slice(imageMatch[0].length) : content;
  return (
    <div className="markdown">
      {imageSrc && <ImageWithLightbox src={imageSrc} />}
      {textContent && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[[rehypeKatex, { throwOnError: false, errorColor: '#dc2626' }]]}
          components={{
            img: ({ node, ...props }) => {
              if (!props.src) return null;
              return (
                <div className="my-4">
                  <img {...props} className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96" alt={props.alt || 'Chat image'} />
                </div>
              );
            },
          }}
        >
          {normalizeContent(textContent)}
        </ReactMarkdown>
      )}
    </div>
  );
};

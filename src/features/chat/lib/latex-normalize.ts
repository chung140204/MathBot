/**
 * LaTeX normalization for chat messages (pure, no UI imports → unit-testable).
 *
 * Weaker models emit half-delimited / malformed LaTeX. These passes coerce the
 * output into something remark-math + KaTeX can render: wrap bare equations,
 * balance `$`, protect `$$` blocks, and normalize multi-line environments.
 */

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
const MATH_ENVS = 'aligned|align\\*?|cases|gathered|gather\\*?|array|matrix|bmatrix|pmatrix|vmatrix|Vmatrix|Bmatrix|eqnarray\\*?';

const REL_CMDS = 'Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|longrightarrow|longleftarrow|leftrightarrow|rightarrow|leftarrow|implies|iff|mapsto|to|leq|geq|neq|approx|equiv|sim|cong|propto|in|notin|subseteq|supseteq|subset|supset|cup|cap|pm|mp|times|div|cdot|le|ge|ne|gg|ll';

function mergeAdjacentMathSpans(s: string): string {
  const re = new RegExp(`\\$([^$\\n]+?)\\$\\s*(\\\\(?:${REL_CMDS}))\\s*\\$([^$\\n]+?)\\$`, 'g');
  let prev: string;
  do { prev = s; s = s.replace(re, '$$$1 $2 $3$$'); } while (s !== prev);
  return s;
}

const LATEX_WORDS = new Set([
  'cdot','times','div','pm','mp','frac','dfrac','tfrac','sqrt','left','right','geq','leq','neq',
  'approx','equiv','Rightarrow','Leftrightarrow','Leftarrow','rightarrow','leftarrow','to','infty',
  'cap','cup','setminus','in','notin','subset','supset','bar','hat','vec','overrightarrow','overline',
  'sum','prod','int','oint','lim','sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan',
  'log','ln','exp','alpha','beta','gamma','delta','epsilon','varepsilon','zeta','eta','theta','vartheta',
  'iota','kappa','lambda','mu','nu','xi','rho','varphi','phi','chi','psi','omega','pi','sigma','tau',
  'Delta','Omega','Gamma','Sigma','Lambda','Phi','Pi','Theta','angle','perp','parallel','mathbb','mathrm',
  'mathcal','text','begin','end','cases','aligned','binom','quad','qquad','cdots','ldots','dots','vdots',
  'forall','exists','partial','nabla','circ','prime','land','lor','neg','Big','big','Bigg',
]);

function isPureMathLine(line: string): boolean {
  const hadMathSpan = /\$[^$\n]+\$/.test(line);
  const outside = line
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{[^}]*\}/g, ' ');
  const hasBareCmd = /\\[a-zA-Z]/.test(outside);
  const hasMathOps = /[=<>≤≥]|[A-Za-z0-9]\^|[A-Za-z0-9]_|\|[^|]+\|/.test(outside);
  if (!hasBareCmd && !(hadMathSpan && hasMathOps)) return false;
  const words = (outside.match(/[A-Za-zÀ-ỹ]{3,}/g) || []).filter((w) => !LATEX_WORDS.has(w));
  return words.length === 0;
}

/** Map LaTeX env names to the KaTeX-supported variant usable inside $$. */
function mapEnvName(env: string): string {
  if (/^align|^eqnarray/.test(env)) return 'aligned';
  if (/^gather/.test(env)) return 'gathered';
  return env;
}

export function normalizeContent(content: string): string {
  if (!content) return '';
  let result = content;
  const blocks: string[] = [];

  // Pass A: convert TeX delimiters to $-form FIRST so the resulting $$/$ get
  // protected by the $$ pass below.
  result = result
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/(?<!\$)\\boxed\{([^}]+)\}/g, '$$\\boxed{$1}$$')
    .replace(/\\tag\{[^}]*\}/g, '')
    .replace(/(?<!\$)\\(Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|implies|iff)/g, '$\\$1$')
    .replace(/\bundefined\b/g, '');

  result = mergeAdjacentMathSpans(result);

  // Pass B: protect $$...$$ blocks BEFORE extracting environments. This is the key
  // ordering fix: an env (e.g. \begin{vmatrix}) sitting INSIDE a $$ block is now
  // protected here and is NOT re-extracted into a nested block (which previously
  // leaked a placeholder and broke KaTeX). Strip stray inner `$`, and map
  // align/gather → aligned/gathered so those envs render inside $$.
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner: string) => {
    let body = String(inner).replace(/\$/g, '');
    body = body.replace(
      /\\(begin|end)\{(align\*?|gather\*?|eqnarray\*?)\}/g,
      (_x, be: string, env: string) => `\\${be}{${mapEnvName(env)}}`,
    );
    blocks.push(`$$\n${body.trim()}\n$$`);
    return `\n\n\x01MB${blocks.length - 1}\x01\n\n`;
  });

  // Pass C: any REMAINING unwrapped \begin{env}...\end{env} (i.e. NOT inside a $$
  // block — those are placeholders now). Wrap in a clean $$ block.
  result = result.replace(
    new RegExp(`\\\\begin\\{(${MATH_ENVS})\\}([\\s\\S]*?)\\\\end\\{\\1\\}`, 'g'),
    (_m, env: string, body: string) => {
      const e = mapEnvName(env);
      const innerBody = body.replace(/\$/g, '');
      blocks.push(`$$\n\\begin{${e}}${innerBody}\n\\end{${e}}\n$$`);
      return `\n\n\x01MB${blocks.length - 1}\x01\n\n`;
    },
  );

  // Per-line fixes for half-delimited inline math.
  result = result.split('\n').map((line) => {
    const trimmed = line.trim();
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

  // Re-insert protected blocks. LOOP until none remain so any nested placeholder
  // (a block whose content references another block) is fully resolved.
  let guard = 0;
  while (/\x01MB\d+\x01/.test(result) && guard++ < 50) {
    result = result.replace(/\x01MB(\d+)\x01/g, (_m, i: string) => blocks[Number(i)] ?? '');
  }
  return result;
}

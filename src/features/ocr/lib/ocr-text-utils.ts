/**
 * Pure text utility functions for OCR pipeline.
 * Extracted from route.ts for modularity and testability.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuestionPosition {
  label: string;
  type: 'question' | 'figure' | 'table';
  yStart: number;
  yEnd: number;
  xStart?: number; // optional horizontal crop (0.0-1.0), defaults to 0.0
  xEnd?: number;   // optional horizontal crop (0.0-1.0), defaults to 1.0
  questionLabel?: string; // only for figure/table — which question this belongs to
}

// ---------------------------------------------------------------------------
// Position extraction
// ---------------------------------------------------------------------------

/**
 * Parse the __positions__ JSON block appended at the end of each stage-1 page output.
 * Returns the clean text (without the JSON line) and the parsed positions array.
 */
export function extractPositions(rawText: string): { text: string; positions: QuestionPosition[] } {
  const lines = rawText.split('\n');
  // Search from the end for the positions JSON line (expand window to 10 lines for safety)
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 10); i--) {
    // Strip markdown code-fence backticks the model sometimes wraps around JSON
    const line = lines[i].trim().replace(/^```(?:json)?|```$/g, '').trim();
    if (line.startsWith('{"__positions__":')) {
      try {
        const parsed = JSON.parse(line);
        const positions: QuestionPosition[] = (parsed.__positions__ ?? [])
          // Clamp yStart/yEnd to [0,1] in case model outputs values > 1
          .map((p: QuestionPosition) => ({
            ...p,
            yStart: Math.max(0, Math.min(1, p.yStart ?? 0)),
            yEnd: Math.max(0, Math.min(1, p.yEnd ?? 1)),
          }))
          // Drop degenerate entries where yStart >= yEnd after clamping
          .filter((p: QuestionPosition) => p.yEnd > p.yStart);
        return {
          text: lines.slice(0, i).join('\n'),
          positions,
        };
      } catch {
        // ignore malformed JSON
      }
    }
  }
  return { text: rawText, positions: [] };
}

// ---------------------------------------------------------------------------
// LaTeX escape fixing
// ---------------------------------------------------------------------------

/**
 * Fix unescaped LaTeX backslashes in raw model JSON output.
 *
 * Models often output \frac, \sqrt etc. with a single backslash, but JSON.parse
 * treats \f as a form-feed char (0x0C) and \b as backspace, silently corrupting
 * the LaTeX. This replaces single \X (where X is a letter) with \\X so
 * JSON.parse produces the literal backslash needed for LaTeX rendering.
 *
 * Example: '"\frac{1}{2}"' → '"\\frac{1}{2}"' → JSON.parse → '\frac{1}{2}' ✓
 */
export function fixLatexEscapes(raw: string): string {
  // Pass 1: Replace \X (letter) that is NOT already preceded by a backslash.
  // EXCEPTIONS — do NOT double these JSON-standard escape sequences:
  //   \uXXXX  — JSON unicode codepoint (Vietnamese chars like \u00e0 = 'à')
  //   \n \r \t \b \f  — BUT only when standalone (not followed by more letters).
  //     e.g. \f alone = form-feed (JSON escape) → keep
  //          \frac    = LaTeX command (\f + rac) → must double the backslash
  //          \t alone = tab → keep; \theta, \text, \tan → LaTeX → double
  //          \b alone = backspace → keep; \binom, \bar → LaTeX → double
  let result = raw.replace(/(?<!\\)\\([a-zA-Z])/g, (match, letter, offset) => {
    if ('nrtbf'.includes(letter)) {
      // Only treat as JSON control escape if NOT followed by more letters
      const nextChar = raw[offset + 2];
      if (!nextChar || !/[a-zA-Z]/.test(nextChar)) return match;
      // Followed by letters → LaTeX command starting with this letter → fall through to double
    }
    if (letter === 'u' && /^[0-9a-fA-F]{4}/.test(raw.slice(offset + 2))) return match;
    return `\\\\${letter}`;
  });

  // Pass 2: Fix ALL \X where X is a non-letter char that is NOT a valid JSON escape.
  // Valid JSON escapes after \: " \ / (and b f n r t u — handled by Pass 1 as letters).
  // Everything else (\{ \} \% \, \^ \_ \# \& \~ \( \) \| \; \: \! \  etc.) is invalid
  // in JSON and must be doubled. Catch-all: [^"\\\/a-zA-Z] = any char except " \ / letters.
  result = result.replace(/(?<!\\)\\([^"\\\/a-zA-Z])/g, '\\\\$1');

  return result;
}

// ---------------------------------------------------------------------------
// LaTeX delimiter wrapping
// ---------------------------------------------------------------------------

/**
 * Wrap bare LaTeX commands (e.g. \sqrt{21}) in $...$ if they are not already
 * inside a math delimiter. This is a safety net for models that output correct
 * LaTeX commands but forget to add the surrounding $...$.
 *
 * Only wraps: \command{...} and \command (without braces) in common math contexts.
 * Does NOT touch text that is already inside $...$ or $$...$$.
 */
export function ensureLatexDelimiters(text: string): string {
  // Split by existing $...$ regions to avoid double-processing
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]+?\$)/g);
  return parts.map((part, i) => {
    // Odd-indexed parts are already inside $...$ or $$...$$
    if (i % 2 === 1) return part;
    // In plain text segments, wrap \command patterns in $...$
    // Greedily capture the full LaTeX expression: \cmd, \cmd{}, \cmd{}\cmd{}...
    let result = part.replace(
      /\\(?:frac|sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|cot|vec|overrightarrow|overline|hat|bar|infty|pm|mp|cdot|times|div|leq|geq|neq|approx|in|notin|subset|mathbb|binom|begin|end|left|right|alpha|beta|gamma|delta|epsilon|theta|pi|sigma|omega|lambda|mu|phi|psi|rho|xi|eta|zeta|tau|nu|kappa|iota)(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}|\[[^\]]*\])*/g,
      (match) => `$${match}$`
    );
    // Wrap probability expressions: P(A), P(A|B), P(A ∩ B) etc.
    // Only wrap when content inside P() is math-like — skip if it contains Vietnamese diacritics
    const hasVietDiacritics = /[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹ]/i;
    result = result.replace(
      /P\([^)]+\)\s*=\s*[\d,.\s]+|P\([^)]+\)/g,
      (match) => hasVietDiacritics.test(match) ? match : `$${match}$`,
    );
    // Re-split to avoid touching freshly added $...$ from steps above,
    // then apply additional math-wrapping patterns on remaining plain text
    result = result.split(/(\$[^$\n]+?\$)/g).map((sp, si) => {
      if (si % 2 === 1) return sp; // inside $...$
      let s = sp;
      // Subscript/superscript: u_1, u_n, a_{n+1}, x^2
      s = s.replace(
        /(?<![\\$])([A-Za-z])([_^])(\{[^{}]+\}|[0-9]+|[a-zA-Z])(?![A-Za-z0-9_^{])/g,
        (m) => `$${m}$`,
      );
      // Coordinate points: M(6;20;0), A'(-3;-4;12), O(0,0)
      s = s.replace(
        /([A-Z]['']?)\(([-\d;,.\s]+)\)/g,
        (m) => `$${m}$`,
      );
      // Single-letter function calls: v(t), S(t), f(x) — skip if preceded by word char
      s = s.replace(
        /(?<![A-Za-zàáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹ])([a-zA-Z])\(([a-zA-Z])\)/g,
        (m) => `$${m}$`,
      );
      return s;
    }).join('');
    return result;
  }).join('');
}

// ---------------------------------------------------------------------------
// Unicode math → LaTeX conversion
// ---------------------------------------------------------------------------

/**
 * Convert stray Unicode math symbols to LaTeX equivalents.
 * Safety net for when Stage 1 vision model ignores the "no Unicode math" rule.
 * Only converts when the symbol appears outside an existing $...$ block.
 */
export function fixUnicodeMath(text: string): string {
  // Split into $...$ / $$...$$ regions and plain-text regions
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) return part; // already inside math delimiters — leave untouched
    return part
      .replace(/∫/g, '$\\int$')
      .replace(/∞/g, '$\\infty$')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/√/g, '$\\sqrt{}$')
      .replace(/×/g, '$\\times$')
      .replace(/÷/g, '$\\div$')
      .replace(/±/g, '$\\pm$')
      .replace(/≤/g, '$\\leq$')
      .replace(/≥/g, '$\\geq$')
      .replace(/≠/g, '$\\neq$')
      .replace(/≈/g, '$\\approx$')
      .replace(/→/g, '$\\to$')
      .replace(/α/g, '$\\alpha$')
      .replace(/β/g, '$\\beta$')
      .replace(/γ/g, '$\\gamma$')
      .replace(/δ/g, '$\\delta$')
      .replace(/θ/g, '$\\theta$')
      .replace(/π/g, '$\\pi$')
      .replace(/σ/g, '$\\sigma$')
      .replace(/ω/g, '$\\omega$')
      .replace(/λ/g, '$\\lambda$')
      .replace(/μ/g, '$\\mu$');
  }).join('');
}

// ---------------------------------------------------------------------------
// Apply LaTeX delimiters to question fields
// ---------------------------------------------------------------------------

/**
 * Apply ensureLatexDelimiters to all user-visible text fields of a parsed question.
 */
// Question fields are dynamically keyed (content, options, statementA-D, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyLatexDelimiters(q: Record<string, any>): Record<string, any> {
  const stringFields = ['content', 'statementA', 'statementB', 'statementC', 'statementD'];
  const result = { ...q };
  for (const field of stringFields) {
    if (typeof result[field] === 'string') {
      result[field] = ensureLatexDelimiters(fixUnicodeMath(result[field]));
    }
  }
  // Fix line breaks: definition lists should start on new lines
  // Stage 2 prompt has these rules but NVIDIA 70b often ignores them
  if (typeof result.content === 'string') {
    // First: normalize literal \n sequences (LLM sometimes outputs "\\n" in JSON value)
    result.content = result.content.replace(/\\n/g, '\n');
    // Dạng 1: "Gọi X là ..." → newline before each "Gọi"
    result.content = result.content.replace(/([.""')\]%])\s+(Gọi\s)/g, '$1\n$2');
    // Dạng 2: "Xét các biến cố: A: "..." ; B: "...""
    // → newline after "biến cố:" and before each event label
    result.content = result.content.replace(/(biến cố\s*:)\s+/gi, '$1\n');
    result.content = result.content.replace(/([;.])\s+(\$?[A-Z]\$?\s*:\s*[""\u201c])/g, '$1\n$2');
  }
  // Fix TRUE_FALSE: LLM sometimes puts statements a) b) c) d) inside content
  // instead of statementA/B/C/D fields. Extract and move them.
  if (result.format === 'TRUE_FALSE' && typeof result.content === 'string') {
    const hasEmptyStatements = !result.statementA && !result.statementB && !result.statementC && !result.statementD;
    if (hasEmptyStatements) {
      // Try to extract "a) ...", "b) ...", "c) ...", "d) ..." from content
      // They may be separated by \n, literal \n, or just spaces
      const stmtMatch = result.content.match(
        /(?:^|[\n\\n])\s*a\)\s*([\s\S]*?)(?:[\n\\n])\s*b\)\s*([\s\S]*?)(?:[\n\\n])\s*c\)\s*([\s\S]*?)(?:[\n\\n])\s*d\)\s*([\s\S]*?)$/i,
      );
      if (stmtMatch) {
        result.statementA = stmtMatch[1].trim().replace(/[.;,]$/, '');
        result.statementB = stmtMatch[2].trim().replace(/[.;,]$/, '');
        result.statementC = stmtMatch[3].trim().replace(/[.;,]$/, '');
        result.statementD = stmtMatch[4].trim().replace(/[.;,]$/, '');
        // Remove statements from content — keep everything before "a)"
        const aIdx = result.content.search(/(?:^|[\n\\n])\s*a\)/i);
        if (aIdx >= 0) result.content = result.content.slice(0, aIdx).replace(/[\s\\n]+$/, '');
        console.log('[OCR_API] TRUE_FALSE fix: extracted statements from content →', {
          a: result.statementA?.slice(0, 50),
          b: result.statementB?.slice(0, 50),
          c: result.statementC?.slice(0, 50),
          d: result.statementD?.slice(0, 50),
        });
      }
    }
  }

  if (result.options && typeof result.options === 'object') {
    result.options = Object.fromEntries(
      Object.entries(result.options).map(([k, v]) => [
        k,
        typeof v === 'string' ? ensureLatexDelimiters(fixUnicodeMath(v)) : v,
      ])
    );
  }
  return result;
}

// ---------------------------------------------------------------------------
// Section splitting
// ---------------------------------------------------------------------------

/**
 * Tách combinedText thành 3 phần theo section header (PHẦN I / II / III).
 * Nếu không tìm thấy header, toàn bộ text nằm trong phan1, phan2/phan3 rỗng.
 */
export function splitBySection(combinedText: string): { phan1: string; phan2: string; phan3: string } {
  // Match "PHẦN I" (not followed by another I → not PHẦN II or III)
  const idx1 = combinedText.search(/PHẦN\s+I(?!I)/i);
  const idx2 = combinedText.search(/PHẦN\s+II(?!I)/i);
  const idx3 = combinedText.search(/PHẦN\s+III/i);
  const len = combinedText.length;

  const s1 = idx1 >= 0 ? idx1 : 0;
  const s2 = idx2 >= 0 ? idx2 : len;
  const s3 = idx3 >= 0 ? idx3 : len;

  return {
    phan1: combinedText.slice(s1, Math.min(s2, s3)),
    phan2: idx2 >= 0 ? combinedText.slice(s2, s3) : '',
    phan3: idx3 >= 0 ? combinedText.slice(s3) : '',
  };
}

// ---------------------------------------------------------------------------
// OCR typo fixing
// ---------------------------------------------------------------------------

/**
 * Normalize common NVIDIA Vision OCR typos in Vietnamese.
 */
export function fixOcrTypos(text: string): string {
  return text.replace(/Cảu/g, 'Câu').replace(/cảu/g, 'câu');
}

/**
 * Map roman numeral section to the previous section.
 */
export function prevSection(sect: string): string {
  if (sect === 'PHẦN III') return 'PHẦN II';
  if (sect === 'PHẦN II') return 'PHẦN I';
  return 'PHẦN I';
}


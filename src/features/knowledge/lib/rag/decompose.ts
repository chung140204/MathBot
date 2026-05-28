import { DecomposedQuery } from './types';

const SPLIT_PATTERN =
  /\s+(?:rồi|sau đó|tiếp theo)\s+|\s+và\s+(?=(?:tìm|tính|xác định|chứng minh|giải))/gi;

const MATH_VERBS = [
  'tính', 'tìm', 'giải', 'chứng minh', 'xác định',
  'khảo sát', 'so sánh', 'biện luận',
];

const MAX_SUB_QUERIES = 3;

function hasMathVerb(text: string): boolean {
  const lower = text.toLowerCase();
  return MATH_VERBS.some((verb) => lower.includes(verb));
}

function mergeShortFragments(fragments: string[]): string[] {
  const merged: string[] = [];

  for (const fragment of fragments) {
    const trimmed = fragment.trim();
    if (trimmed.length === 0) continue;

    if (merged.length > 0 && !hasMathVerb(trimmed)) {
      merged[merged.length - 1] += ' ' + trimmed;
    } else {
      merged.push(trimmed);
    }
  }

  return merged;
}

export function decomposeQuery(message: string): DecomposedQuery {
  const trimmed = message.trim();
  const fragments = trimmed
    .split(SPLIT_PATTERN)
    .filter((f) => f.trim().length > 0);

  if (fragments.length <= 1) {
    return { original: trimmed, subQueries: [trimmed] };
  }

  let merged = mergeShortFragments(fragments);

  if (merged.length > MAX_SUB_QUERIES) {
    merged = merged.slice(0, MAX_SUB_QUERIES);
  }

  if (merged.length <= 1) {
    return { original: trimmed, subQueries: [trimmed] };
  }

  return { original: trimmed, subQueries: merged };
}

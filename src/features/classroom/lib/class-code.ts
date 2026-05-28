const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateClassCode(): string {
  const prefix = 'MATH';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return `${prefix}-${suffix}`;
}

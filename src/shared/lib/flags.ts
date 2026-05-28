function flag(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export const flags = {
  enableChat: flag('ENABLE_CHAT', true),
  enableAnalytics: flag('ENABLE_ANALYTICS', true),
  enableClassroom: flag('ENABLE_CLASSROOM', true),
} as const;

export type FeatureFlag = keyof typeof flags;

import { Topic } from '@prisma/client';

/** THPT exam frequency weight (0–100). Higher = more questions in real THPT exam. */
export const THPT_WEIGHT: Record<Topic, number> = {
  FUNCTIONS: 100,
  DERIVATIVES: 85,
  EXPONENTIAL_LOG: 80,
  INTEGRALS: 75,
  SOLID_GEOMETRY: 70,
  ANALYTIC_GEOMETRY: 70,
  PROBABILITY: 65,
  VOLUME: 60,
  COMPLEX_NUMBERS: 50,
  SEQUENCES: 45,
  LIMITS: 40,
};

export type TopicCategory = 'calculus' | 'geometry' | 'discrete';

export const TOPIC_CATEGORY: Record<Topic, TopicCategory> = {
  DERIVATIVES: 'calculus',
  INTEGRALS: 'calculus',
  FUNCTIONS: 'calculus',
  LIMITS: 'calculus',
  EXPONENTIAL_LOG: 'calculus',
  SOLID_GEOMETRY: 'geometry',
  ANALYTIC_GEOMETRY: 'geometry',
  VOLUME: 'geometry',
  PROBABILITY: 'discrete',
  SEQUENCES: 'discrete',
  COMPLEX_NUMBERS: 'discrete',
};

export const TOPIC_DISPLAY: Record<Topic, { icon: string; accent: string }> = {
  DERIVATIVES: { icon: '📐', accent: '#059669' },
  INTEGRALS: { icon: '∫', accent: '#2563eb' },
  FUNCTIONS: { icon: '📈', accent: '#d97706' },
  LIMITS: { icon: '∞', accent: '#7c3aed' },
  COMPLEX_NUMBERS: { icon: '🔮', accent: '#dc2626' },
  PROBABILITY: { icon: '🎲', accent: '#dc2626' },
  SEQUENCES: { icon: '🔢', accent: '#059669' },
  EXPONENTIAL_LOG: { icon: '📊', accent: '#2563eb' },
  VOLUME: { icon: '📦', accent: '#059669' },
  ANALYTIC_GEOMETRY: { icon: '📍', accent: '#d97706' },
  SOLID_GEOMETRY: { icon: '🔷', accent: '#7c3aed' },
};

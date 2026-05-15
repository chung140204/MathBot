import { Topic, Difficulty, Prisma } from '@prisma/client';

export interface MCQuestion {
  content: string;
  format: 'MULTIPLE_CHOICE';
  options: Prisma.JsonObject;
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: Topic;
  difficulty: Difficulty;
}

export interface TFQuestion {
  content: string;
  format: 'TRUE_FALSE';
  statementA: string;
  answerA: boolean;
  statementB: string;
  answerB: boolean;
  statementC: string;
  answerC: boolean;
  statementD: string;
  answerD: boolean;
  explanation: string;
  topic: Topic;
  difficulty: Difficulty;
  options: Prisma.JsonObject;
  answer: string;
}

export interface SAQuestion {
  content: string;
  format: 'SHORT_ANSWER';
  correctAnswer: string;
  explanation: string;
  topic: Topic;
  difficulty: Difficulty;
  options: Prisma.JsonObject;
  answer: string;
}

export type SeedQuestion = MCQuestion | TFQuestion | SAQuestion;

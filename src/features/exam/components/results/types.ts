export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  content: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  explanation: string;
  topic: string;
  format: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: { A: string; B: string; C: string; D: string };
  statements?: {
    A: string; B: string; C: string; D: string;
    ansA: boolean; ansB: boolean; ansC: boolean; ansD: boolean;
  };
}

export interface TopicStat {
  topic: string;
  label: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface ExamResultData {
  attemptId: string;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSecs: number;
  examTitle: string;
  results: QuestionResult[];
  topicStats: TopicStat[];
  previousAttempt: { percentage: number } | null;
}

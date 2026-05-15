// ─── Scoring constants per mode ─────────────────────────────────────────────

export const THPT_SCORING = {
  pointPerMC: 0.25,
  pointPerTFItem: 0.25,  // used only in linear mode; THPT uses step scoring
  pointPerSA: 0.5,
};

const DEFAULT_SCORING = {
  pointPerMC: 1,
  pointPerTFItem: 0.25,
  pointPerSA: 1,
};

// ─── THPT True/False step scoring ───────────────────────────────────────────
// Real THPT 2025: 0-1 correct = 0, 2 correct = 0.25, 3 correct = 0.5, 4 correct = 1.0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreTrueFalseThpt(answer: any, question: any): number {
  let correct = 0;
  if (answer.tfAnswerA === question.answerA) correct++;
  if (answer.tfAnswerB === question.answerB) correct++;
  if (answer.tfAnswerC === question.answerC) correct++;
  if (answer.tfAnswerD === question.answerD) correct++;

  if (correct <= 1) return 0;
  if (correct === 2) return 0.25;
  if (correct === 3) return 0.5;
  return 1.0;
}

// ─── Score a single question ────────────────────────────────────────────────

/**
 * Calculates the score for a single question.
 * @param mode - 'THPT' uses THPT-specific scoring; others use examSet or defaults.
 */
export function scoreQuestion(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examSet: any | null,
  mode?: string
): number {
  const isThpt = mode === 'THPT';
  const scoring = isThpt ? THPT_SCORING : DEFAULT_SCORING;

  const mcPoint = examSet?.pointPerMC ?? scoring.pointPerMC;
  const tfPoint = examSet?.pointPerTFItem ?? scoring.pointPerTFItem;
  const saPoint = examSet?.pointPerSA ?? scoring.pointPerSA;

  switch (question.format) {

    case 'MULTIPLE_CHOICE':
      return (answer.userAnswer || answer.selectedOpt) === question.answer ? mcPoint : 0;

    case 'TRUE_FALSE':
      if (isThpt) {
        return scoreTrueFalseThpt(answer, question);
      }
      // Linear scoring for non-THPT modes
      {
        let score = 0;
        if (answer.tfAnswerA === question.answerA) score += tfPoint;
        if (answer.tfAnswerB === question.answerB) score += tfPoint;
        if (answer.tfAnswerC === question.answerC) score += tfPoint;
        if (answer.tfAnswerD === question.answerD) score += tfPoint;
        return score;
      }

    case 'SHORT_ANSWER': {
      const user = parseFloat(answer.shortAnswer || '');
      const correct = parseFloat(question.correctAnswer || '');
      if (isNaN(user) || isNaN(correct)) return 0;
      return Math.abs(user - correct) < 0.001 ? saPoint : 0;
    }

    default:
      return 0;
  }
}

// ─── Total score calculation ────────────────────────────────────────────────

export function calculateTotalScore(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examSet: any | null,
  mode?: string
): number {
  return questions.reduce((total, q) => {
    const answer = answers.find((a: { questionId: string }) => a.questionId === q.id);
    if (!answer) return total;
    return total + scoreQuestion(q, answer, examSet, mode);
  }, 0);
}

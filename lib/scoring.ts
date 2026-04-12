// Using any for parameters to bypass potential stale Prisma type definitions

/**
 * Calculates the score for a single question based on the user's answer and exam set rules.
 * Uses 'any' for parameters to bypass potential stale Prisma type definitions during rapid schema changes.
 */
export function scoreQuestion(
  question: any,
  answer: any,
  examSet: any | null
): number {
  const mcPoint = examSet?.pointPerMC ?? 0.2
  const tfPoint = examSet?.pointPerTFItem ?? 0.25
  const saPoint = examSet?.pointPerSA ?? 0.5

  switch (question.format) {

    case 'MULTIPLE_CHOICE':
      // Compare userAnswer (mapped from ABCD) to correct question.answer
      return (answer.userAnswer || answer.selectedOpt) === question.answer ? mcPoint : 0

    case 'TRUE_FALSE':
      // Each correct item contributes a fraction of the total score (e.g., 0.25 each)
      let score = 0
      if (answer.tfAnswerA === question.answerA) score += tfPoint
      if (answer.tfAnswerB === question.answerB) score += tfPoint
      if (answer.tfAnswerC === question.answerC) score += tfPoint
      if (answer.tfAnswerD === question.answerD) score += tfPoint
      return score

    case 'SHORT_ANSWER':
      // Numeric comparison with precision tolerance (0.001)
      const user = parseFloat(answer.shortAnswer || '')
      const correct = parseFloat(question.correctAnswer || '')
      if (isNaN(user) || isNaN(correct)) return 0
      return Math.abs(user - correct) < 0.001 ? saPoint : 0

    default:
      return 0
  }
}

/**
 * Calculates the total score for a set of questions and answers.
 */
export function calculateTotalScore(
  questions: any[],
  answers: any[],
  examSet: any | null
): number {
  return questions.reduce((total, q) => {
    const answer = answers.find(a => a.questionId === q.id)
    if (!answer) return total
    return total + scoreQuestion(q, answer, examSet)
  }, 0)
}

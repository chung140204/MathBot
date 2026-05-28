/**
 * Returns a question object with answer fields stripped out.
 * Used when sending questions to students (e.g., /start endpoint).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripQuestionAnswers(q: any) {
  return {
    id: q.id,
    content: q.content,
    options: q.options,
    topic: q.topic,
    difficulty: q.difficulty,
    format: q.format,
    imageUrl: q.imageUrl,
    optionAImageUrl: q.optionAImageUrl,
    optionBImageUrl: q.optionBImageUrl,
    optionCImageUrl: q.optionCImageUrl,
    optionDImageUrl: q.optionDImageUrl,
    statementA: q.statementA,
    statementB: q.statementB,
    statementC: q.statementC,
    statementD: q.statementD,
    statementAImageUrl: q.statementAImageUrl,
    statementBImageUrl: q.statementBImageUrl,
    statementCImageUrl: q.statementCImageUrl,
    statementDImageUrl: q.statementDImageUrl,
  };
}

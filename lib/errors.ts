export enum ErrorCode {
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXAM_NOT_FOUND = 'EXAM_NOT_FOUND',
  EXAM_ALREADY_SUBMITTED = 'EXAM_ALREADY_SUBMITTED',
  EXAM_QUESTION_NOT_FOUND = 'EXAM_QUESTION_NOT_FOUND',
  EXAM_INSUFFICIENT_QUESTIONS = 'EXAM_INSUFFICIENT_QUESTIONS'
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: ErrorCode,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

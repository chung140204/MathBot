import { Difficulty } from '@prisma/client';

/** Nhãn tiếng Việt cho 4 mức độ nhận thức (thang Bloom rút gọn). */
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  RECOGNITION: 'Nhận biết',
  COMPREHENSION: 'Thông hiểu',
  APPLICATION: 'Vận dụng',
  ADVANCED: 'Vận dụng cao',
};

/** Trả nhãn tiếng Việt cho một mức độ; mức độ lạ thì trả về nguyên giá trị. */
export function difficultyLabel(value: string): string {
  return DIFFICULTY_LABEL[value as Difficulty] ?? value;
}

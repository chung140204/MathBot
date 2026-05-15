import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const functionsQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Tìm tập xác định của hàm số $y = \\dfrac{2x + 1}{x - 3}$.',
    options: { A: '$\\mathbb{R} \\setminus \\{3\\}$', B: '$\\mathbb{R} \\setminus \\{-3\\}$', C: '$\\mathbb{R}$', D: '$(-\\infty; 3)$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'Mẫu số $\\neq 0 \\Rightarrow x \\neq 3$. TXĐ: $\\mathbb{R} \\setminus \\{3\\}$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = -x^3 + 3x^2 - 1$ đồng biến trên khoảng nào?',
    options: { A: '$(0; 2)$', B: '$(-\\infty; 0)$', C: '$(2; +\\infty)$', D: '$\\mathbb{R}$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = -3x^2 + 6x = -3x(x-2)$. $y' > 0$ khi $0 < x < 2$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tìm tập xác định của hàm số $y = \\sqrt{4 - x^2}$.',
    options: { A: '$[-2; 2]$', B: '$(-2; 2)$', C: '$\\mathbb{R}$', D: '$[0; 2]$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$4 - x^2 \\geq 0 \\Rightarrow x^2 \\leq 4 \\Rightarrow x \\in [-2; 2]$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = x^4 - 2x^2 + 3$ nghịch biến trên khoảng nào?',
    options: { A: '$(-\\infty; -1)$', B: '$(-1; 0)$', C: '$(0; 1)$', D: '$(1; +\\infty)$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = 4x^3 - 4x = 4x(x-1)(x+1)$. $y' < 0$ khi $x \\in (-\\infty;-1) \\cup (0;1)$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đồ thị hàm số $y = \\dfrac{x + 2}{x - 1}$ có tiệm cận đứng là:',
    options: { A: '$x = 1$', B: '$x = -2$', C: '$x = -1$', D: '$x = 2$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'Mẫu $= 0$ tại $x = 1$, tử $= 3 \\neq 0$. TCĐ: $x = 1$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số nào sau đây đồng biến trên $\\mathbb{R}$?',
    options: { A: '$y = x^3 + x$', B: '$y = x^3 - x$', C: '$y = -x^3 + x$', D: '$y = x^4 + x^2$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = 3x^2 + 1 > 0$ với mọi $x$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đồ thị hàm số $y = \\dfrac{3x - 1}{x + 2}$ có tiệm cận ngang là:',
    options: { A: '$y = 3$', B: '$y = -2$', C: '$y = \\dfrac{1}{3}$', D: '$y = -\\dfrac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$\\lim_{x \\to \\pm\\infty} \\frac{3x-1}{x+2} = 3$. TCN: $y = 3$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = 2x^3 - 6x + 1$ có giá trị cực đại bằng:',
    options: { A: '$5$', B: '$-3$', C: '$1$', D: '$7$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = 6x^2 - 6 = 0 \\Rightarrow x = \\pm 1$. Cực đại tại $x = -1$: $y(-1) = -2 + 6 + 1 = 5$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = x^3 - 3x + 2$ có bao nhiêu điểm cực trị?',
    options: { A: '$2$', B: '$1$', C: '$0$', D: '$3$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$. Có 2 cực trị.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = x^3 - 3x^2 + 4$ đạt cực đại tại:',
    options: { A: '$x = 0$', B: '$x = 2$', C: '$x = -1$', D: '$x = 4$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y' = 3x^2 - 6x = 3x(x-2) = 0 \\Rightarrow x = 0$ hoặc $x = 2$. $y''(0) = -6 < 0$: cực đại tại $x = 0$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  // RECOGNITION - TF (2)
  {
    content: 'Cho hàm số $y = x^3 - 3x^2 + 4$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Hàm số đồng biến trên $(-\\infty; 0)$.', answerA: true,
    statementB: 'Hàm số có cực tiểu tại $x = 0$.', answerB: false,
    statementC: 'Hàm số đạt cực tiểu tại $x = 2$.', answerC: true,
    statementD: 'Giá trị cực đại bằng $0$.', answerD: false,
    explanation: "$y'=3x(x-2)$. $y'>0$ khi $x<0$: đồng biến✓. $x=0$ là CĐ không phải CT✗. $x=2$ là CT✓. $y(0)=4$ là CĐ không phải $0$✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, answer: '', options: {} as Prisma.JsonObject,
  },
  {
    content: 'Cho hàm số $y = \\dfrac{2x + 1}{x - 1}$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'TXĐ là $\\mathbb{R} \\setminus \\{1\\}$.', answerA: true,
    statementB: 'TCĐ là $x = -1$.', answerB: false,
    statementC: 'TCN là $y = 2$.', answerC: true,
    statementD: 'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{1\\}$.', answerD: false,
    explanation: "TXĐ: $x \\neq 1$✓. TCĐ: $x=1$ không phải $x=-1$✗. TCN: $y=2$✓. $y'=\\frac{-3}{(x-1)^2}<0$: nghịch biến✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, answer: '', options: {} as Prisma.JsonObject,
  },
  // RECOGNITION - SA (2)
  {
    content: 'Hàm số $y = x^3 - 6x^2 + 9x + 1$ có bao nhiêu cực trị?',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '2', explanation: "$y'=3(x-1)(x-3)=0 \\Rightarrow x=1, x=3$. Có 2 cực trị.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, options: {} as Prisma.JsonObject, answer: '2',
  },
  {
    content: 'Đồ thị hàm số $y = \\dfrac{5x - 3}{x + 4}$ có TCĐ $x = a$. Tìm $a$.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '-4', explanation: '$x + 4 = 0 \\Rightarrow x = -4$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.RECOGNITION, options: {} as Prisma.JsonObject, answer: '-4',
  },
  // COMPREHENSION - MC (8)
  {
    content: 'Tìm khoảng đồng biến của hàm số $y = x^3 - 3x^2 - 9x + 5$.',
    options: { A: '$(-\\infty; -1)$ và $(3; +\\infty)$', B: '$(-1; 3)$', C: '$(-\\infty; 1)$', D: '$(1; 3)$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=3(x-3)(x+1)$. $y'>0$ khi $x<-1$ hoặc $x>3$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giá trị cực tiểu của hàm số $y = x^4 - 8x^2 + 16$ bằng:',
    options: { A: '$0$', B: '$16$', C: '$-16$', D: '$8$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$y = (x^2-4)^2 \\geq 0$. Min $= 0$ tại $x = \\pm 2$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hàm số $y = x^3 + 3x^2 - 9x + 5$. Tọa độ điểm cực đại là:',
    options: { A: '$(-3; 32)$', B: '$(1; 0)$', C: '$(-3; -22)$', D: '$(3; 32)$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=3(x+3)(x-1)=0 \\Rightarrow x=-3$ (CĐ), $x=1$ (CT). $y(-3)=32$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = -x^4 + 2x^2 + 3$ có bao nhiêu điểm cực trị?',
    options: { A: '$3$', B: '$2$', C: '$1$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=-4x(x-1)(x+1)=0 \\Rightarrow x \\in \\{-1,0,1\\}$. Có 3 cực trị.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tọa độ điểm uốn của đồ thị $y = x^3 - 3x^2 + 3$ là:',
    options: { A: '$(1; 1)$', B: '$(1; 3)$', C: '$(0; 3)$', D: '$(2; -1)$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y''=6x-6=0 \\Rightarrow x=1$. $y(1)=1$. Điểm uốn $(1;1)$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giá trị lớn nhất của $y = -x^3 + 3x$ trên $[-2; 2]$ là:',
    options: { A: '$2$', B: '$3$', C: '$4$', D: '$-2$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=0 \\Rightarrow x=\\pm 1$. $y(-2)=2, y(-1)=-2, y(1)=2, y(2)=-2$. GTLN $= 2$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = x^3 - 3x + 2$ nghịch biến trên khoảng nào?',
    options: { A: '$(-1; 1)$', B: '$(-\\infty; -1)$', C: '$(1; +\\infty)$', D: '$\\mathbb{R}$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=3(x-1)(x+1)<0$ khi $-1<x<1$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = \\dfrac{x^2-3x+2}{x-2}$ có bao nhiêu tiệm cận?',
    options: { A: '$0$', B: '$1$', C: '$2$', D: '$3$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$y = \\frac{(x-1)(x-2)}{x-2} = x-1$ ($x \\neq 2$). Không có tiệm cận.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  // COMPREHENSION - TF (2)
  {
    content: 'Cho hàm số $y = x^4 - 4x^2 + 3$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Hàm số có 3 cực trị.', answerA: true,
    statementB: 'Giá trị cực đại bằng $3$.', answerB: true,
    statementC: 'Hàm số đạt cực tiểu tại $x = 0$.', answerC: false,
    statementD: 'Giá trị cực tiểu bằng $0$.', answerD: false,
    explanation: "$y'=4x(x^2-2)=0 \\Rightarrow x \\in \\{-\\sqrt{2},0,\\sqrt{2}\\}$. $y(0)=3$ CĐ✓. $x=\\pm\\sqrt{2}$ CT: $y=4-8+3=-1 \\neq 0$✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, answer: '', options: {} as Prisma.JsonObject,
  },
  {
    content: 'Cho hàm số $y = 2x^3 - 3x^2 - 12x + 1$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Hàm số đồng biến trên $(-1; 2)$.', answerA: false,
    statementB: "$y'=0$ có hai nghiệm phân biệt.", answerB: true,
    statementC: 'Giá trị cực đại bằng $8$.', answerC: true,
    statementD: 'Hàm số nghịch biến trên $(2; +\\infty)$.', answerD: false,
    explanation: "$y'=6(x-2)(x+1)=0 \\Rightarrow x=-1, x=2$✓. $y'<0$ trên $(-1;2)$: nghịch biến✗. $y(-1)=8$ CĐ✓. $y'>0$ khi $x>2$: đồng biến✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, answer: '', options: {} as Prisma.JsonObject,
  },
  // COMPREHENSION - SA (1)
  {
    content: 'Cho hàm số $y = x^4 - 2x^2 + 1$. Tính tổng các giá trị cực trị.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '1', explanation: "$y'=4x(x-1)(x+1)=0 \\Rightarrow x \\in \\{-1,0,1\\}$. $y(-1)=0, y(0)=1, y(1)=0$. Tổng $= 1$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.COMPREHENSION, options: {} as Prisma.JsonObject, answer: '1',
  },
  // APPLICATION - MC (5)
  {
    content: 'Phương trình tiếp tuyến của $y = x^3 - 3x + 2$ tại điểm có $x = 1$ là:',
    options: { A: '$y = 0$', B: '$y = -3x + 3$', C: '$y = 3x - 3$', D: '$y = x$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y(1)=0$, $y'(1)=0$. Tiếp tuyến: $y = 0$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đường thẳng $y = m$ cắt đồ thị $y = x^3 - 3x$ tại $3$ điểm phân biệt khi:',
    options: { A: '$-2 < m < 2$', B: '$-2 \\leq m \\leq 2$', C: '$m < -2$ hoặc $m > 2$', D: '$m = \\pm 2$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'CĐ tại $x=-1$: $y=2$; CT tại $x=1$: $y=-2$. Cắt 3 điểm khi $-2 < m < 2$.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình tiếp tuyến của $y = \\dfrac{2x+1}{x-1}$ tại điểm $x = 2$ là:',
    options: { A: '$y = -3x + 11$', B: '$y = 3x - 1$', C: '$y = -3x + 1$', D: '$y = 3x + 11$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y(2)=5$, $y'=\\frac{-3}{(x-1)^2}$, $y'(2)=-3$. TT: $y-5=-3(x-2) \\Rightarrow y=-3x+11$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình $x^4 - 2x^2 = m$ có đúng $4$ nghiệm phân biệt khi:',
    options: { A: '$-1 < m < 0$', B: '$m > 0$', C: '$m = -1$', D: '$-1 \\leq m \\leq 0$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=4x(x-1)(x+1)=0$. CĐ: $y(0)=0$; CT: $y(\\pm 1)=-1$. Đường $y=m$ cắt $4$ điểm khi $-1 < m < 0$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đồ thị hàm số $y = x^3 - 3x^2 + 4$ có bao nhiêu giao điểm với trục hoành?',
    options: { A: '$2$', B: '$1$', C: '$3$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$x^3-3x^2+4=0$. Thử $x=-1$: đúng. $(x+1)(x-2)^2=0 \\Rightarrow 2$ giao điểm.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  // APPLICATION - TF (1)
  {
    content: 'Cho hàm số $y = \\dfrac{x+3}{x-1}$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Tâm đối xứng của đồ thị là $I(1; 1)$.', answerA: true,
    statementB: 'Tiếp tuyến tại $(3; 3)$: $y = -x + 6$.', answerB: true,
    statementC: 'Đồ thị cắt trục hoành tại $(3; 0)$.', answerC: false,
    statementD: 'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{1\\}$.', answerD: false,
    explanation: "$y=1+\\frac{4}{x-1}$: tâm $I(1;1)$✓. $y'=\\frac{-4}{(x-1)^2}$, $y'(3)=-1$: TT $y=-x+6$✓. Cắt Ox: $y=0 \\Rightarrow x=-3$: điểm $(-3;0)$✗. $y'<0$ nên nghịch biến✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, answer: '', options: {} as Prisma.JsonObject,
  },
  // APPLICATION - SA (1)
  {
    content: 'Hàm số $y = x^3 - 3x^2 + 4$ có bao nhiêu giao điểm với trục hoành?',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '2', explanation: '$(x+1)(x-2)^2=0 \\Rightarrow x=-1$ và $x=2$ (bội 2). Có 2 giao điểm.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.APPLICATION, options: {} as Prisma.JsonObject, answer: '2',
  },
  // ADVANCED - MC (2)
  {
    content: 'Có bao nhiêu giá trị nguyên của $m$ để phương trình $x^3 - 3x - m = 0$ có $3$ nghiệm thực phân biệt?',
    options: { A: '$3$', B: '$2$', C: '$4$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$f(x)=x^3-3x$. CĐ: $f(-1)=2$; CT: $f(1)=-2$. $3$ nghiệm khi $-2<m<2$. Giá trị nguyên: $\\{-1,0,1\\}$, tức $3$ giá trị.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tìm $m$ để hàm số $y = \\dfrac{1}{3}x^3 - mx^2 + (m+2)x - 1$ đồng biến trên $\\mathbb{R}$.',
    options: { A: '$-1 \\leq m \\leq 2$', B: '$m > 2$', C: '$m < -1$', D: '$m = 1$' } as Prisma.JsonObject,
    answer: 'A', explanation: "$y'=x^2-2mx+(m+2) \\geq 0$ với mọi $x \\Leftrightarrow \\Delta'=m^2-m-2 \\leq 0 \\Leftrightarrow (m-2)(m+1) \\leq 0 \\Leftrightarrow -1 \\leq m \\leq 2$.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  // ADVANCED - TF (1)
  {
    content: 'Cho hàm số $y = x^4 - 2mx^2 + m^2 - 1$ ($m$ là tham số). Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Khi $m \\leq 0$, hàm số có đúng một cực trị.', answerA: true,
    statementB: 'Khi $m > 0$, hàm số có $3$ cực trị.', answerB: true,
    statementC: 'Khi $m = 1$, giá trị cực tiểu bằng $0$.', answerC: false,
    statementD: 'Tồn tại $m$ để giá trị cực tiểu bằng $-2$.', answerD: false,
    explanation: "$y'=4x(x^2-m)$. $m \\leq 0$: 1 cực trị tại $x=0$✓. $m>0$: 3 cực trị✓. $m=1$: CT tại $x=\\pm 1$, $y=1-2+0=-1 \\neq 0$✗. CT $= m^2-m-1=-2 \\Rightarrow m^2-m+1=0$, $\\Delta<0$: vô nghiệm✗.",
    topic: Topic.FUNCTIONS, difficulty: Difficulty.ADVANCED, answer: '', options: {} as Prisma.JsonObject,
  },
  // ADVANCED - SA (1)
  {
    content: 'Số giá trị nguyên $m \\in [-10; 10]$ để phương trình $x^4 - 2x^2 = m$ có đúng $2$ nghiệm thực là bao nhiêu?',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '11',
    explanation: 'CĐ: $y(0)=0$; CT: $y(\\pm 1)=-1$. $y=m$ có đúng 2 nghiệm khi $m=-1$ hoặc $m>0$. Giá trị nguyên trong $[-10;10]$: $m=-1$ và $m \\in \\{1,...,10\\}$: tổng $11$ giá trị.',
    topic: Topic.FUNCTIONS, difficulty: Difficulty.ADVANCED, options: {} as Prisma.JsonObject, answer: '11',
  },
];

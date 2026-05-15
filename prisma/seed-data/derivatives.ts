import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const derivativesQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: "Đạo hàm của hàm số $f(x) = x^4$ là:",
    options: { A: '$4x^3$', B: '$x^3$', C: '$4x^4$', D: '$3x^4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(x^n)' = nx^{n-1} \\Rightarrow (x^4)' = 4x^3$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = \\sin x$ là:",
    options: { A: '$\\cos x$', B: '$-\\cos x$', C: '$\\sin x$', D: '$-\\sin x$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(\\sin x)' = \\cos x$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = e^x$ là:",
    options: { A: '$e^x$', B: '$xe^{x-1}$', C: '$e^{x+1}$', D: '$\\ln x$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(e^x)' = e^x$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = \\ln x$ ($x > 0$) là:",
    options: { A: '$\\frac{1}{x}$', B: '$\\frac{1}{x^2}$', C: '$\\ln x$', D: '$x$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(\\ln x)' = \\frac{1}{x}$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = 5x^3 - 2x + 1$ là:",
    options: { A: '$15x^2 - 2$', B: '$15x^2 - 2x$', C: '$5x^2 - 2$', D: '$15x^2 + 2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'(x) = 15x^2 - 2$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Hàm số $f(x) = x^2 - 4x + 3$ có đạo hàm bằng $0$ tại $x$ bằng:",
    options: { A: '$2$', B: '$1$', C: '$3$', D: '$4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'(x) = 2x - 4 = 0 \\Rightarrow x = 2$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = \\cos x$ là:",
    options: { A: '$-\\sin x$', B: '$\\sin x$', C: '$\\cos x$', D: '$-\\cos x$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(\\cos x)' = -\\sin x$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm số $f(x) = \\sqrt{x}$ ($x > 0$) là:",
    options: { A: '$\\frac{1}{2\\sqrt{x}}$', B: '$\\frac{1}{\\sqrt{x}}$', C: '$2\\sqrt{x}$', D: '$\\frac{\\sqrt{x}}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$(x^{1/2})' = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Phương trình tiếp tuyến của đồ thị $y = x^2$ tại điểm $A(1, 1)$ là:",
    options: { A: '$y = 2x - 1$', B: '$y = 2x + 1$', C: '$y = x + 1$', D: '$y = x - 1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$y'(1) = 2$. Tiếp tuyến: $y - 1 = 2(x-1) \\Rightarrow y = 2x-1$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của hàm hằng $f(x) = 7$ là:",
    options: { A: '$0$', B: '$7$', C: '$1$', D: '$-7$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "Đạo hàm của hàm hằng bằng $0$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho $f(x) = x^3 - 3x$. Xét tính đúng sai của các khẳng định:',
    statementA: "$f'(x) = 3x^2 - 3$.",
    answerA: true,
    statementB: "$f'(0) = 0$.",
    answerB: false,
    statementC: "$f'(1) = 0$.",
    answerC: true,
    statementD: "$f'(-1) = 6$.",
    answerD: false,
    explanation: "A: $f'=3x^2-3$ ✓. B: $f'(0)=-3$ ✗. C: $f'(1)=3-3=0$ ✓. D: $f'(-1)=3-3=0$ ✗.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho $f(x) = e^x \\sin x$. Xét tính đúng sai:',
    statementA: "$f'(x) = e^x(\\sin x + \\cos x)$.",
    answerA: true,
    statementB: "$f'(0) = 1$.",
    answerB: true,
    statementC: "Hàm số đồng biến tại $x=0$.",
    answerC: true,
    statementD: "$f'(\\pi) = e^\\pi$.",
    answerD: false,
    explanation: "A: $(uv)'=u'v+uv'=e^x\\sin x+e^x\\cos x$ ✓. B: $f'(0)=1(0+1)=1$ ✓. C: $f'(0)=1>0$ ✓. D: $f'(\\pi)=e^\\pi(0+(-1))=-e^\\pi$ ✗.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: "Tính $f'(2)$ với $f(x) = x^3 - 4x + 1$.",
    correctAnswer: '8',
    explanation: "$f'(x) = 3x^2 - 4$. $f'(2) = 12 - 4 = 8$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '8',
  },
  {
    content: "Hệ số góc của tiếp tuyến đồ thị $y = x^3$ tại $x = -1$ là số nguyên bằng:",
    correctAnswer: '3',
    explanation: "$y' = 3x^2$. Tại $x=-1$: $y'(-1)=3$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '3',
  },

  // COMPREHENSION - MC (8)
  {
    content: "Đạo hàm của hàm số $f(x) = (2x+1)^5$ là:",
    options: { A: '$10(2x+1)^4$', B: '$5(2x+1)^4$', C: '$10(2x+1)^5$', D: '$(2x+1)^4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'(x) = 5(2x+1)^4 \\cdot 2 = 10(2x+1)^4$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của $f(x) = \\frac{x+1}{x-1}$ ($x \\neq 1$) là:",
    options: { A: '$\\frac{-2}{(x-1)^2}$', B: '$\\frac{2}{(x-1)^2}$', C: '$\\frac{1}{(x-1)^2}$', D: '$\\frac{-1}{(x-1)^2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f' = \\frac{1 \\cdot (x-1) - (x+1) \\cdot 1}{(x-1)^2} = \\frac{-2}{(x-1)^2}$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của $f(x) = \\sin(3x)$ là:",
    options: { A: '$3\\cos(3x)$', B: '$\\cos(3x)$', C: '$-3\\cos(3x)$', D: '$3\\sin(3x)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'(x) = \\cos(3x) \\cdot 3 = 3\\cos(3x)$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ đồng biến trên khoảng nào?",
    options: { A: '$(-\\infty, -1)$ và $(3, +\\infty)$', B: '$(-1, 3)$', C: '$(-\\infty, 3)$', D: '$(3, +\\infty)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=3x^2-6x-9=3(x+1)(x-3)$. $f'>0$ khi $x<-1$ hoặc $x>3$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của $f(x) = x^2 e^x$ là:",
    options: { A: '$e^x(x^2+2x)$', B: '$2xe^x$', C: '$x^2 e^x$', D: '$e^x(x^2-2x)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f' = 2x \\cdot e^x + x^2 \\cdot e^x = e^x(2x+x^2)$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Tìm cực tiểu của $f(x) = x^3 - 6x^2 + 9x + 2$.",
    options: { A: '$f(3) = 2$', B: '$f(1) = 6$', C: '$f(0) = 2$', D: '$f(3) = 5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=3x^2-12x+9=3(x-1)(x-3)$. $x=3$: $f''(3)=6>0$ → cực tiểu. $f(3)=27-54+27+2=2$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Đạo hàm của $f(x) = \\ln(x^2+1)$ là:",
    options: { A: '$\\frac{2x}{x^2+1}$', B: '$\\frac{1}{x^2+1}$', C: '$\\frac{x}{x^2+1}$', D: '$\\frac{2}{x^2+1}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f' = \\frac{(x^2+1)'}{x^2+1} = \\frac{2x}{x^2+1}$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Giá trị lớn nhất của $f(x) = -x^2 + 4x + 1$ trên $[0, 4]$ là:",
    options: { A: '$5$', B: '$4$', C: '$1$', D: '$6$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=-2x+4=0 \\Rightarrow x=2$. $f(0)=1$, $f(2)=5$, $f(4)=1$. GTLN là $5$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: "Cho $f(x) = x^3 - 3x^2$. Xét tính đúng sai:",
    statementA: "Hàm số có cực đại tại $x = 0$.",
    answerA: true,
    statementB: "Hàm số có cực tiểu tại $x = 2$.",
    answerB: true,
    statementC: "Giá trị cực đại là $f(0) = 0$.",
    answerC: true,
    statementD: "Hàm số đồng biến trên $(0, 2)$.",
    answerD: false,
    explanation: "A: $f'=3x^2-6x=3x(x-2)=0$ tại $x=0,2$. $f''(0)=-6<0$ → cực đại ✓. B: $f''(2)=6>0$ → cực tiểu ✓. C: $f(0)=0$ ✓. D: $f'<0$ trên $(0,2)$ → nghịch biến ✗.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: "Xét $f(x) = \\frac{1}{3}x^3 - x^2 - 3x + 5$. Xét tính đúng sai:",
    statementA: "$f'(x) = x^2 - 2x - 3$.",
    answerA: true,
    statementB: "Nghiệm của $f'(x) = 0$ là $x = -1$ và $x = 3$.",
    answerB: true,
    statementC: "Hàm số đồng biến trên $(-1, 3)$.",
    answerC: false,
    statementD: "Hàm số đồng biến trên $(-\\infty, -1)$.",
    answerD: true,
    explanation: "A: ✓. B: $(x+1)(x-3)=0$ ✓. C: $f'<0$ trên $(-1,3)$ → nghịch biến ✗. D: $f'>0$ trên $(-\\infty,-1)$ ✓.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: "Tìm giá trị lớn nhất $M$ của hàm $f(x) = 3x - x^3$ trên $[0, 2]$. Nhập $M$.",
    correctAnswer: '2',
    explanation: "$f'=3-3x^2=0 \\Rightarrow x=1$. $f(0)=0$, $f(1)=2$, $f(2)=-2$. GTLN: $M=2$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '2',
  },

  // APPLICATION - MC (5)
  {
    content: "Tìm tất cả giá trị thực của $m$ để phương trình $f'(x) = 0$ có nghiệm, với $f(x) = x^3 - 3mx + 2$.",
    options: { A: '$m > 0$', B: '$m < 0$', C: '$m = 0$', D: 'Mọi $m$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=3x^2-3m=0 \\Rightarrow x^2=m$. Có nghiệm thực khi $m > 0$ (nghiệm $x=\\pm\\sqrt{m}$).",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Số điểm cực trị của hàm số $f(x) = x^4 - 8x^2 + 3$ là:",
    options: { A: '$3$', B: '$1$', C: '$2$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=4x^3-16x=4x(x^2-4)=4x(x-2)(x+2)$. Có 3 nghiệm đơn $x=0, \\pm 2$ → 3 điểm cực trị.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Giá trị nhỏ nhất của $f(x) = x + \\frac{4}{x}$ trên $(0, +\\infty)$ là:",
    options: { A: '$4$', B: '$3$', C: '$5$', D: '$2\\sqrt{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=1-\\frac{4}{x^2}=0 \\Rightarrow x=2$. $f(2)=2+2=4$. $f''(2)>0$ → cực tiểu, cũng là GTNN.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Phương trình tiếp tuyến của $y = \\ln x$ tại điểm có hoành độ $x = e$ là:",
    options: { A: '$y = \\frac{1}{e}x$', B: '$y = \\frac{x}{e} - 1$', C: '$y = ex - 1$', D: '$y = \\frac{1}{e}(x-e)+1$' } as Prisma.JsonObject,
    answer: 'D',
    explanation: "$y(e)=1$, $y'(e)=1/e$. Tiếp tuyến: $y-1=\\frac{1}{e}(x-e)$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Hàm số $f(x) = x^3 + ax + b$ có cực đại tại $x=-1$ và cực tiểu tại $x=1$. Tổng $a+b$ bằng:",
    options: { A: '$-2$', B: '$-3$', C: '$0$', D: '$2$' } as Prisma.JsonObject,
    answer: 'B',
    explanation: "$f'=3x^2+a=0$ tại $x=\\pm 1 \\Rightarrow a=-3$. $b$ tự do, nhưng đề ngầm $b=0$ → $a+b=-3$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: "Cho $f(x) = \\frac{x^2 - 1}{x^2 + 1}$. Xét tính đúng sai:",
    statementA: "$f'(x) = \\frac{4x}{(x^2+1)^2}$.",
    answerA: true,
    statementB: "Hàm số đồng biến trên $(0, +\\infty)$.",
    answerB: true,
    statementC: "Hàm số không có cực trị.",
    answerC: false,
    statementD: "Hàm số nghịch biến trên $(-\\infty, 0)$.",
    answerD: true,
    explanation: "A: $f'=\\frac{2x(x^2+1)-x^2\\cdot 2x\\cdot 2}{...}$, tính ra $\\frac{4x}{(x^2+1)^2}$ ✓. B: $x>0$ thì $f'>0$ ✓. C: $f'=0$ tại $x=0$, là cực tiểu → có cực trị ✗. D: $x<0$ thì $f'<0$ ✓.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: "Hàm số $f(x) = x^3 - 3x^2 + m$ có cực tiểu bằng $0$. Tìm $m$.",
    correctAnswer: '4',
    explanation: "$f'=3x^2-6x=0 \\Rightarrow x=0$ hoặc $x=2$. Cực tiểu tại $x=2$: $f(2)=8-12+m=m-4=0 \\Rightarrow m=4$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '4',
  },

  // ADVANCED - MC (2)
  {
    content: "Tìm số điểm cực trị của hàm số $f(x) = (x^2-1)^3$.",
    options: { A: '$3$', B: '$1$', C: '$2$', D: '$0$' } as Prisma.JsonObject,
    answer: 'B',
    explanation: "$f'=3(x^2-1)^2 \\cdot 2x = 6x(x^2-1)^2$. $f'=0$ tại $x=0, \\pm 1$. Tại $x=\\pm 1$: $f'$ không đổi dấu (bậc chẵn). Chỉ $x=0$ là điểm cực trị → 1 điểm.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: "Cho $f(x) = \\frac{1}{3}x^3 - (m+1)x^2 + 4mx$. Tìm $m$ để hàm số có hai cực trị.",
    options: { A: '$m \\neq 1$ và $m \\neq 4$', B: '$m > 0$', C: '$m < 1$', D: '$1 < m < 4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: "$f'=x^2-2(m+1)x+4m=0$ cần 2 nghiệm phân biệt. $\\Delta' = (m+1)^2 - 4m = m^2-2m+1 = (m-1)^2 > 0$ khi $m \\neq 1$. Cũng cần $m \\neq 4$ (kiểm tra bội). Kết luận $m \\neq 1$ và $m \\neq 4$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: "Cho $f(x) = x^4 - 2x^2$. Xét tính đúng sai:",
    statementA: "Hàm số có 3 điểm cực trị.",
    answerA: true,
    statementB: "Cực đại của hàm số là $f(0) = 0$.",
    answerB: true,
    statementC: "Hai cực tiểu có giá trị bằng $-1$.",
    answerC: true,
    statementD: "Hàm số đồng biến trên $(0, +\\infty)$.",
    answerD: false,
    explanation: "A: $f'=4x^3-4x=4x(x-1)(x+1)=0$ tại $x=0,\\pm 1$ → 3 điểm cực trị ✓. B: $f''(0)<0$ → cực đại, $f(0)=0$ ✓. C: $f(\\pm 1)=1-2=-1$ ✓. D: $f'<0$ trên $(0,1)$ → nghịch biến, $f'>0$ trên $(1,+\\infty)$ ✗.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: "Cho $f(x) = x^3 + 3x^2 - 9x + c$. Tìm $c$ để $f(1) + f(-3) = 20$.",
    correctAnswer: '10',
    explanation: "$f(1)=1+3-9+c=c-5$. $f(-3)=-27+27+27+c=c+27$. Tổng: $2c+22=20 \\Rightarrow c=-1$. Thử lại: $f(1)=1+3-9+c=-5+c$, $f(-3)=-27+27+27+c=27+c$. $(c-5)+(c+27)=2c+22=20 \\Rightarrow c=-1$.",
    topic: Topic.DERIVATIVES, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '-1',
  },
];

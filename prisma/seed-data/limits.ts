import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const limitsQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Tính $\\lim_{x \\to 2} (3x - 1)$.',
    options: { A: '$5$', B: '$6$', C: '$4$', D: '$7$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thế trực tiếp: $3(2)-1=5$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{\\sin x}{x}$.',
    options: { A: '$1$', B: '$0$', C: '$+\\infty$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Giới hạn cơ bản: $\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} \\frac{1}{x}$.',
    options: { A: '$0$', B: '$1$', C: '$+\\infty$', D: '$-\\infty$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Khi $x \\to +\\infty$, $\\frac{1}{x} \\to 0$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 3} x^2$.',
    options: { A: '$9$', B: '$6$', C: '$3$', D: '$27$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thế trực tiếp: $3^2=9$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{n \\to \\infty} \\frac{1}{n^2}$.',
    options: { A: '$0$', B: '$1$', C: '$+\\infty$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{1}{n^2} \\to 0$ khi $n \\to \\infty$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.',
    options: { A: '$2$', B: '$0$', C: '$1$', D: 'Không tồn tại' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{x^2-1}{x-1} = x+1 \\to 2$ khi $x\\to 1$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} \\frac{2x+1}{x}$.',
    options: { A: '$2$', B: '$1$', C: '$+\\infty$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{2x+1}{x} = 2 + \\frac{1}{x} \\to 2$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Dãy số nào sau đây hội tụ?',
    options: { A: '$u_n = \\frac{1}{n}$', B: '$u_n = n^2$', C: '$u_n = (-1)^n$', D: '$u_n = n$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$u_n = 1/n \\to 0$. Các dãy còn lại phân kỳ.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{\\tan x}{x}$.',
    options: { A: '$1$', B: '$0$', C: '$+\\infty$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\lim_{x\\to 0}\\frac{\\tan x}{x} = 1$ (giới hạn cơ bản).',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} (1 + \\frac{1}{x})^x$.',
    options: { A: '$e$', B: '$1$', C: '$+\\infty$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\lim_{x\\to+\\infty}(1+1/x)^x = e$ (định nghĩa số $e$).',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho dãy số $u_n = \\frac{2n+1}{n+1}$. Xét tính đúng sai:',
    statementA: '$u_n < 2$ với mọi $n$.',
    answerA: true,
    statementB: '$\\lim_{n\\to\\infty} u_n = 2$.',
    answerB: true,
    statementC: 'Dãy $(u_n)$ đơn điệu tăng.',
    answerC: true,
    statementD: '$u_1 = \\frac{3}{2} > u_2 = \\frac{5}{3}$.',
    answerD: false,
    explanation: 'A: $\\frac{2n+1}{n+1}=2-\\frac{1}{n+1}<2$ ✓. B: ✓. C: $u_n=2-\\frac{1}{n+1}$ tăng ✓. D: $u_1=3/2<5/3=u_2$ ✗.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Xét $\\lim_{x\\to 0^+} \\sqrt{x}$. Tính đúng sai:',
    statementA: 'Giới hạn bằng $0$.',
    answerA: true,
    statementB: '$\\sqrt{x}$ xác định với $x>0$.',
    answerB: true,
    statementC: '$\\lim_{x\\to 0^-}\\sqrt{x}$ không tồn tại trong $\\mathbb{R}$.',
    answerC: true,
    statementD: '$\\lim_{x\\to 0}\\sqrt{x}$ tồn tại và bằng $0$.',
    answerD: false,
    explanation: 'A: ✓. B: ✓. C: $\\sqrt{x}$ không xác định với $x<0$ ✓. D: Giới hạn hai phía phải bằng nhau; $x\\to 0^-$ không xác định → giới hạn hai chiều không tồn tại ✗.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Tính $\\lim_{x \\to 2} (x^2 + 3x - 1)$. Kết quả là số nguyên.',
    correctAnswer: '9',
    explanation: 'Thế trực tiếp: $4+6-1=9$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '9',
  },
  {
    content: 'Tính $\\lim_{n \\to \\infty} \\frac{3n}{n+1}$. Kết quả là số nguyên.',
    correctAnswer: '3',
    explanation: '$\\frac{3n}{n+1} = \\frac{3}{1+1/n} \\to 3$.',
    topic: Topic.LIMITS, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '3',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{x^2 - x}{x}$.',
    options: { A: '$-1$', B: '$0$', C: '$1$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{x^2-x}{x} = x-1 \\to -1$ khi $x\\to 0$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 1} \\frac{x^3 - 1}{x - 1}$.',
    options: { A: '$3$', B: '$1$', C: '$2$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{x^3-1}{x-1} = x^2+x+1 \\to 3$ khi $x\\to 1$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} \\frac{3x^2 + x}{x^2 - 1}$.',
    options: { A: '$3$', B: '$1$', C: '$+\\infty$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Chia cả tử mẫu cho $x^2$: $\\frac{3+1/x}{1-1/x^2} \\to 3$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}$.',
    options: { A: '$\\frac{1}{4}$', B: '$\\frac{1}{2}$', C: '$0$', D: '$4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{\\sqrt{x}-2}{x-4} = \\frac{1}{\\sqrt{x}+2} \\to \\frac{1}{4}$ khi $x\\to 4$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$.',
    options: { A: '$\\frac{1}{2}$', B: '$1$', C: '$0$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$1-\\cos x \\approx \\frac{x^2}{2}$ khi $x\\to 0$. Nên $\\frac{1-\\cos x}{x^2} \\to \\frac{1}{2}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{n \\to \\infty} \\frac{n^2 + n + 1}{2n^2 - 3}$.',
    options: { A: '$\\frac{1}{2}$', B: '$1$', C: '$+\\infty$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Chia cả tử mẫu cho $n^2$: $\\frac{1+1/n+1/n^2}{2-3/n^2} \\to \\frac{1}{2}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$.',
    options: { A: '$1$', B: '$0$', C: '$e$', D: '$+\\infty$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\lim_{x\\to 0}\\frac{e^x-1}{x} = 1$ (giới hạn cơ bản).',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} (\\sqrt{x^2+x} - x)$.',
    options: { A: '$\\frac{1}{2}$', B: '$0$', C: '$1$', D: '$+\\infty$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\sqrt{x^2+x}-x = \\frac{x}{\\sqrt{x^2+x}+x} = \\frac{1}{\\sqrt{1+1/x}+1} \\to \\frac{1}{2}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Cho $\\lim_{x\\to 0} \\frac{\\sin(kx)}{x} = k$. Xét tính đúng sai:',
    statementA: '$\\lim_{x\\to 0} \\frac{\\sin(2x)}{x} = 2$.',
    answerA: true,
    statementB: '$\\lim_{x\\to 0} \\frac{\\sin(3x)}{\\sin(2x)} = \\frac{3}{2}$.',
    answerB: true,
    statementC: '$\\lim_{x\\to 0} \\frac{x}{\\sin x} = 1$.',
    answerC: true,
    statementD: '$\\lim_{x\\to 0} \\frac{\\sin(x^2)}{x} = 0$.',
    answerD: true,
    explanation: 'A: ✓. B: $\\frac{\\sin 3x}{\\sin 2x}=\\frac{3x}{2x}\\cdot\\frac{\\sin 3x/3x}{\\sin 2x/2x}\\to 3/2$ ✓. C: ✓. D: $\\sin(x^2)/x=x\\cdot\\frac{\\sin x^2}{x^2}\\to 0\\cdot 1=0$ ✓.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Xét hàm $f(x) = \\begin{cases}2x+1 & x>0\\\\ 1 & x=0\\\\ x+1 & x<0\\end{cases}$. Tính đúng sai:',
    statementA: '$\\lim_{x\\to 0^+}f(x) = 1$.',
    answerA: true,
    statementB: '$\\lim_{x\\to 0^-}f(x) = 1$.',
    answerB: true,
    statementC: '$\\lim_{x\\to 0}f(x) = 1$.',
    answerC: true,
    statementD: '$f$ liên tục tại $x=0$.',
    answerD: true,
    explanation: 'A: $2(0)+1=1$ ✓. B: $0+1=1$ ✓. C: Hai giới hạn bên bằng nhau = 1 ✓. D: $\\lim=f(0)=1$ → liên tục ✓.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Tính $\\lim_{x \\to 2} \\frac{x^2 - 4}{x^2 - 3x + 2}$. Kết quả là số nguyên.',
    correctAnswer: '4',
    explanation: '$\\frac{(x-2)(x+2)}{(x-2)(x-1)} = \\frac{x+2}{x-1} \\to \\frac{4}{1} = 4$.',
    topic: Topic.LIMITS, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '4',
  },

  // APPLICATION - MC (5)
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - 1}{x}$.',
    options: { A: '$\\frac{1}{2}$', B: '$1$', C: '$0$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Nhân liên hợp: $\\frac{(\\sqrt{1+x}-1)(\\sqrt{1+x}+1)}{x(\\sqrt{1+x}+1)}=\\frac{1}{\\sqrt{1+x}+1}\\to\\frac{1}{2}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to +\\infty} \\frac{\\sqrt{4x^2 + x} - 2x}{1}$.',
    options: { A: '$\\frac{1}{4}$', B: '$0$', C: '$\\frac{1}{2}$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\sqrt{4x^2+x}-2x = \\frac{x}{\\sqrt{4x^2+x}+2x} = \\frac{1}{\\sqrt{4+1/x}+2} \\to \\frac{1}{4}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $f(x) = \\frac{x^2-9}{x-3}$ có thể mở rộng liên tục tại $x=3$ với $f(3) = $?',
    options: { A: '$6$', B: '$3$', C: '$9$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\lim_{x\\to 3}\\frac{x^2-9}{x-3}=\\lim_{x\\to 3}(x+3)=6$. Đặt $f(3)=6$.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{n \\to \\infty} \\left(1 + \\frac{2}{n}\\right)^n$.',
    options: { A: '$e^2$', B: '$e$', C: '$2e$', D: '$e^{1/2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\left(1+\\frac{2}{n}\\right)^n = \\left[\\left(1+\\frac{1}{n/2}\\right)^{n/2}\\right]^2 \\to e^2$.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}$.',
    options: { A: '$1$', B: '$0$', C: '$e$', D: '$+\\infty$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\lim_{x\\to 0}\\frac{\\ln(1+x)}{x}=1$ (giới hạn cơ bản, hệ quả từ định nghĩa $e$).',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: 'Cho $\\lim_{x\\to 0}\\frac{ax+b\\sin x}{cx}=5$. Biết $b=3$. Xét tính đúng sai:',
    statementA: '$\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$ nên $\\frac{ax+3\\sin x}{cx}\\to\\frac{a+3}{c}$.',
    answerA: true,
    statementB: '$\\frac{a+3}{c} = 5$.',
    answerB: true,
    statementC: 'Nếu $c=1$ thì $a=2$.',
    answerC: true,
    statementD: 'Nếu $a=7$ thì $c=2$.',
    answerD: true,
    explanation: 'A: ✓. B: ✓. C: $a+3=5 \\Rightarrow a=2$ ✓. D: $\\frac{7+3}{c}=5 \\Rightarrow c=2$ ✓.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Tìm $a$ để hàm $f(x) = \\frac{x^2-a^2}{x-a}$ (khi $x\\neq a$) và $f(a)=6$ liên tục tại $x=a$. Nhập $a$.',
    correctAnswer: '3',
    explanation: '$\\lim_{x\\to a}\\frac{x^2-a^2}{x-a}=2a=6 \\Rightarrow a=3$.',
    topic: Topic.LIMITS, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '3',
  },

  // ADVANCED - MC (2)
  {
    content: 'Tính $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$.',
    options: { A: '$-\\frac{1}{6}$', B: '$0$', C: '$\\frac{1}{6}$', D: '$-1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Khai triển Taylor: $\\sin x = x - \\frac{x^3}{6} + O(x^5)$. Nên $\\frac{\\sin x-x}{x^3}\\to -\\frac{1}{6}$.',
    topic: Topic.LIMITS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\lim_{x \\to 1^-} \\frac{x^n - 1}{x - 1}$ với $n$ nguyên dương.',
    options: { A: '$n$', B: '$1$', C: '$n-1$', D: '$n+1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{x^n-1}{x-1} = 1+x+x^2+\\cdots+x^{n-1} \\to n$ khi $x\\to 1$.',
    topic: Topic.LIMITS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho $f(x) = \\frac{\\sin x}{x}$ khi $x\\neq 0$, $f(0)=1$. Xét tính đúng sai:',
    statementA: '$f$ liên tục tại $x=0$.',
    answerA: true,
    statementB: '$f$ liên tục trên $\\mathbb{R}\\setminus\\{0\\}$.',
    answerB: true,
    statementC: '$f$ có đạo hàm tại $x=0$.',
    answerC: true,
    statementD: "$f'(0) = 0$.",
    answerD: true,
    explanation: 'A: $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1=f(0)$ ✓. B: Là hàm sơ cấp trên $\\mathbb{R}\\setminus\\{0\\}$ ✓. C: $f\'(0)=\\lim_{h\\to 0}\\frac{f(h)-1}{h}=\\lim\\frac{\\sin h/h-1}{h}=0$ ✓. D: ✓.',
    topic: Topic.LIMITS, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Tính $L = \\lim_{n\\to\\infty}\\left(\\frac{1}{n^2}+\\frac{2}{n^2}+\\cdots+\\frac{n}{n^2}\\right)$. Nhập $2L$ (là số nguyên).',
    correctAnswer: '1',
    explanation: '$\\frac{1+2+\\cdots+n}{n^2}=\\frac{n(n+1)/2}{n^2}=\\frac{1+1/n}{2}\\to\\frac{1}{2}$. Vậy $L=\\frac{1}{2}$, $2L=1$.',
    topic: Topic.LIMITS, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },
];

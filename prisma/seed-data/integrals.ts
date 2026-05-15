import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const integralsQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Nguyên hàm của $f(x) = x^3$ là:',
    options: { A: '$\\frac{x^4}{4} + C$', B: '$3x^2 + C$', C: '$\\frac{x^4}{3} + C$', D: '$x^4 + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int x^3\\,dx = \\frac{x^4}{4} + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nguyên hàm của $f(x) = \\cos x$ là:',
    options: { A: '$\\sin x + C$', B: '$-\\sin x + C$', C: '$\\cos x + C$', D: '$\\tan x + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int \\cos x\\,dx = \\sin x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nguyên hàm của $f(x) = e^x$ là:',
    options: { A: '$e^x + C$', B: '$xe^x + C$', C: '$\\frac{e^x}{x} + C$', D: '$e^{x+1} + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int e^x\\,dx = e^x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nguyên hàm của $f(x) = \\frac{1}{x}$ ($x > 0$) là:',
    options: { A: '$\\ln x + C$', B: '$-\\frac{1}{x^2} + C$', C: '$\\ln|x| + C$', D: '$\\frac{1}{x^2} + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$. Với $x>0$: $\\ln x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^1 2x\\,dx$.',
    options: { A: '$1$', B: '$2$', C: '$\\frac{1}{2}$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int_0^1 2x\\,dx = [x^2]_0^1 = 1 - 0 = 1$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^{\\pi} \\sin x\\,dx$.',
    options: { A: '$2$', B: '$0$', C: '$1$', D: '$\\pi$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int_0^{\\pi} \\sin x\\,dx = [-\\cos x]_0^{\\pi} = -(-1) - (-1) = 2$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nguyên hàm của $f(x) = 5$ là:',
    options: { A: '$5x + C$', B: '$5 + C$', C: '$0 + C$', D: '$x + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int 5\\,dx = 5x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nguyên hàm của $f(x) = \\sin x$ là:',
    options: { A: '$-\\cos x + C$', B: '$\\cos x + C$', C: '$-\\sin x + C$', D: '$\\sin x + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int \\sin x\\,dx = -\\cos x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_1^e \\frac{1}{x}\\,dx$.',
    options: { A: '$1$', B: '$e$', C: '$e-1$', D: '$\\ln e = 1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\int_1^e \\frac{dx}{x} = [\\ln x]_1^e = \\ln e - \\ln 1 = 1 - 0 = 1$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^2 (3x^2 - 2x)\\,dx$.',
    options: { A: '$4$', B: '$6$', C: '$8$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$[x^3 - x^2]_0^2 = (8-4) - 0 = 4$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho $F(x) = x^2 \\sin x$. Xét tính đúng sai:',
    statementA: "$F'(x) = 2x\\sin x + x^2\\cos x$.",
    answerA: true,
    statementB: '$F(x)$ là một nguyên hàm của $f(x) = 2x\\sin x + x^2\\cos x$.',
    answerB: true,
    statementC: '$\\int (2x\\sin x + x^2\\cos x)\\,dx = x^2\\sin x + C$.',
    answerC: true,
    statementD: '$F(0) = 1$.',
    answerD: false,
    explanation: 'A: $(uv)\'$ ✓. B: Nguyên hàm của $f$ là $F$ ✓. C: ✓. D: $F(0)=0$ ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Xét tích phân $I = \\int_0^1 x^2\\,dx$. Tính đúng sai:',
    statementA: '$I = \\frac{1}{3}$.',
    answerA: true,
    statementB: '$I = \\left[\\frac{x^3}{3}\\right]_0^1$.',
    answerB: true,
    statementC: '$I > \\int_0^1 x^3\\,dx$.',
    answerC: true,
    statementD: '$I = \\int_0^1 x\\,dx$.',
    answerD: false,
    explanation: 'A: $1/3$ ✓. B: ✓. C: $1/3 > 1/4$ ✓. D: $\\int_0^1 x\\,dx = 1/2 \\neq 1/3$ ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Tính $\\int_0^3 (2x+1)\\,dx$. Kết quả là số nguyên.',
    correctAnswer: '12',
    explanation: '$[x^2+x]_0^3 = 9+3 = 12$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '12',
  },
  {
    content: 'Tính $\\int_0^{\\pi/2} \\cos x\\,dx$. Kết quả là số nguyên.',
    correctAnswer: '1',
    explanation: '$[\\sin x]_0^{\\pi/2} = 1 - 0 = 1$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Tính $\\int (2x+1)^3\\,dx$ bằng phương pháp đổi biến $t = 2x+1$.',
    options: { A: '$\\frac{(2x+1)^4}{8} + C$', B: '$\\frac{(2x+1)^4}{4} + C$', C: '$\\frac{(2x+1)^4}{2} + C$', D: '$(2x+1)^4 + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $t=2x+1$, $dt=2dx$. $\\int t^3 \\frac{dt}{2} = \\frac{t^4}{8} = \\frac{(2x+1)^4}{8} + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int x e^x\\,dx$ bằng tích phân từng phần.',
    options: { A: '$xe^x - e^x + C$', B: '$xe^x + e^x + C$', C: '$\\frac{x^2}{2}e^x + C$', D: '$e^x(x-1) - C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $u=x$, $dv=e^x dx$. $\\int xe^x dx = xe^x - \\int e^x dx = xe^x - e^x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_1^2 \\frac{2x}{x^2+1}\\,dx$.',
    options: { A: '$\\ln 5 - \\ln 2$', B: '$\\ln 5$', C: '$\\ln\\frac{5}{2}$', D: '$2\\ln 5$' } as Prisma.JsonObject,
    answer: 'C',
    explanation: 'Đặt $t=x^2+1$. $\\int_2^5 \\frac{dt}{t} = [\\ln t]_2^5 = \\ln 5 - \\ln 2 = \\ln\\frac{5}{2}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^1 x^2(x^3+1)^4\\,dx$.',
    options: { A: '$\\frac{2^5-1}{15}$', B: '$\\frac{1}{5}$', C: '$\\frac{1}{15}$', D: '$\\frac{31}{15}$' } as Prisma.JsonObject,
    answer: 'D',
    explanation: 'Đặt $t=x^3+1$, $dt=3x^2 dx$. $\\frac{1}{3}\\int_1^2 t^4 dt = \\frac{1}{3}[\\frac{t^5}{5}]_1^2 = \\frac{32-1}{15} = \\frac{31}{15}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int \\ln x\\,dx$.',
    options: { A: '$x\\ln x - x + C$', B: '$\\frac{1}{x} + C$', C: '$x\\ln x + C$', D: '$\\ln x - x + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tích phân từng phần: $u=\\ln x$, $dv=dx$. $x\\ln x - \\int \\frac{x}{x}dx = x\\ln x - x + C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^1 \\frac{1}{\\sqrt{x+1}}\\,dx$.',
    options: { A: '$2(\\sqrt{2}-1)$', B: '$\\sqrt{2}-1$', C: '$2\\sqrt{2}$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $t=\\sqrt{x+1}$. $[2\\sqrt{x+1}]_0^1 = 2\\sqrt{2} - 2 = 2(\\sqrt{2}-1)$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Diện tích hình phẳng giới hạn bởi $y = x^2$ và $y = x$ là:',
    options: { A: '$\\frac{1}{6}$', B: '$\\frac{1}{3}$', C: '$\\frac{1}{2}$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Giao: $x=0, x=1$. $S=\\int_0^1(x-x^2)dx=[\\frac{x^2}{2}-\\frac{x^3}{3}]_0^1=\\frac{1}{2}-\\frac{1}{3}=\\frac{1}{6}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^{\\pi/2} \\sin^2 x\\,dx$.',
    options: { A: '$\\frac{\\pi}{4}$', B: '$\\frac{\\pi}{2}$', C: '$1$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\sin^2 x = \\frac{1-\\cos 2x}{2}$. $\\int_0^{\\pi/2}\\frac{1-\\cos 2x}{2}dx = [\\frac{x}{2}-\\frac{\\sin 2x}{4}]_0^{\\pi/2} = \\frac{\\pi}{4}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Cho $I = \\int_0^2 |x-1|\\,dx$. Xét tính đúng sai:',
    statementA: 'Trên $[0,1]$: $|x-1| = 1-x$.',
    answerA: true,
    statementB: 'Trên $[1,2]$: $|x-1| = x-1$.',
    answerB: true,
    statementC: '$I = \\int_0^1(1-x)dx + \\int_1^2(x-1)dx$.',
    answerC: true,
    statementD: '$I = 0$.',
    answerD: false,
    explanation: 'A,B,C: ✓. $I = \\frac{1}{2} + \\frac{1}{2} = 1 \\neq 0$ ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Xét $\\int_0^1 x e^{x^2}\\,dx$. Tính đúng sai:',
    statementA: 'Đặt $t = x^2$ thì $dt = 2x\\,dx$.',
    answerA: true,
    statementB: 'Tích phân trở thành $\\frac{1}{2}\\int_0^1 e^t\\,dt$.',
    answerB: true,
    statementC: 'Kết quả là $\\frac{e-1}{2}$.',
    answerC: true,
    statementD: 'Kết quả là $e-1$.',
    answerD: false,
    explanation: 'A: ✓. B: Đổi cận $x=0 \\to t=0$, $x=1 \\to t=1$ ✓. C: $\\frac{1}{2}[e^t]_0^1 = \\frac{e-1}{2}$ ✓. D: ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Tính diện tích hình phẳng giới hạn bởi $y = 4 - x^2$ và trục hoành. Kết quả là phân số $\\frac{p}{q}$ — nhập tử số $p$.',
    correctAnswer: '32',
    explanation: 'Giao Ox: $x=\\pm 2$. $S=\\int_{-2}^2(4-x^2)dx=[4x-\\frac{x^3}{3}]_{-2}^2=2(8-\\frac{8}{3})=\\frac{32}{3}$. Tử số: $32$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '32',
  },

  // APPLICATION - MC (5)
  {
    content: 'Thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi $y = \\sqrt{x}$, $Ox$ từ $x=0$ đến $x=4$ quanh trục $Ox$ là:',
    options: { A: '$8\\pi$', B: '$4\\pi$', C: '$16\\pi$', D: '$2\\pi$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$V = \\pi\\int_0^4 (\\sqrt{x})^2 dx = \\pi\\int_0^4 x\\,dx = \\pi[\\frac{x^2}{2}]_0^4 = 8\\pi$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Diện tích hình phẳng giới hạn bởi $y = x^2$ và $y = 2x + 3$ là:',
    options: { A: '$\\frac{32}{3}$', B: '$\\frac{16}{3}$', C: '$8$', D: '$\\frac{20}{3}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Giao: $x^2=2x+3 \\Rightarrow x=-1, 3$. $S=\\int_{-1}^3(2x+3-x^2)dx=[x^2+3x-\\frac{x^3}{3}]_{-1}^3=9+9-9-1+3-\\frac{1}{3}\\cdot(-1)=\\frac{32}{3}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^{\\pi/2} x\\cos x\\,dx$.',
    options: { A: '$\\frac{\\pi}{2} - 1$', B: '$\\frac{\\pi}{2} + 1$', C: '$1$', D: '$\\pi - 1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tích phân từng phần: $[x\\sin x]_0^{\\pi/2} - \\int_0^{\\pi/2}\\sin x\\,dx = \\frac{\\pi}{2} - [-\\cos x]_0^{\\pi/2} = \\frac{\\pi}{2} - 1$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int \\frac{x}{x^2-1}\\,dx$ ($x > 1$).',
    options: { A: '$\\frac{1}{2}\\ln(x^2-1) + C$', B: '$\\ln(x^2-1) + C$', C: '$\\frac{1}{2}\\ln|x-1| + C$', D: '$\\ln|x+1| + C$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $t=x^2-1$, $dt=2x\\,dx$. $\\frac{1}{2}\\int\\frac{dt}{t}=\\frac{1}{2}\\ln|t|=\\frac{1}{2}\\ln(x^2-1)+C$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_1^4 \\frac{\\ln x}{x}\\,dx$.',
    options: { A: '$\\frac{(\\ln 4)^2}{2}$', B: '$\\ln^2 4$', C: '$\\frac{\\ln 4}{2}$', D: '$\\ln 4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $t=\\ln x$, $dt=dx/x$. $\\int_0^{\\ln 4} t\\,dt = [\\frac{t^2}{2}]_0^{\\ln 4} = \\frac{(\\ln 4)^2}{2}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: 'Cho $S = \\int_0^2 (x^2 - x)\\,dx$. Xét tính đúng sai:',
    statementA: 'Trên $[0,1]$: $x^2 - x \\leq 0$.',
    answerA: true,
    statementB: 'Diện tích hình phẳng $\\neq |\\int_0^2(x^2-x)dx|$.',
    answerB: true,
    statementC: 'Diện tích $= \\int_0^1(x-x^2)dx + \\int_1^2(x^2-x)dx$.',
    answerC: true,
    statementD: '$\\int_0^2(x^2-x)dx = 0$.',
    answerD: false,
    explanation: 'A: $x(x-1)\\leq 0$ trên $[0,1]$ ✓. B: Cần tính theo phần ✓. C: ✓. D: $[\\frac{x^3}{3}-\\frac{x^2}{2}]_0^2=\\frac{8}{3}-2=\\frac{2}{3}\\neq 0$ ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Thể tích khối tròn xoay tạo bởi hình phẳng giới hạn bởi $y=x^2+1$, $Ox$, $x=0$, $x=1$ quay quanh $Ox$ bằng $\\frac{p\\pi}{q}$ (tối giản). Nhập $p+q$.',
    correctAnswer: '28',
    explanation: '$V=\\pi\\int_0^1(x^2+1)^2dx=\\pi\\int_0^1(x^4+2x^2+1)dx=\\pi[\\frac{x^5}{5}+\\frac{2x^3}{3}+x]_0^1=\\pi(\\frac{1}{5}+\\frac{2}{3}+1)=\\frac{28\\pi}{15}$. $p=28, q=15 \\Rightarrow p+q=43$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '43',
  },

  // ADVANCED - MC (2)
  {
    content: 'Tính $\\int_0^1 \\frac{x}{(x+1)^2}\\,dx$.',
    options: { A: '$\\ln 2 - \\frac{1}{2}$', B: '$\\ln 2$', C: '$\\frac{1}{2}$', D: '$1 - \\ln 2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{x}{(x+1)^2} = \\frac{1}{x+1} - \\frac{1}{(x+1)^2}$. $\\int_0^1[\\frac{1}{x+1}-\\frac{1}{(x+1)^2}]dx=[\\ln(x+1)+\\frac{1}{x+1}]_0^1=\\ln 2+\\frac{1}{2}-1=\\ln 2-\\frac{1}{2}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\int_0^{\\pi} x\\sin x\\,dx$.',
    options: { A: '$\\pi$', B: '$2\\pi$', C: '$\\pi + 2$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Từng phần: $[-x\\cos x]_0^{\\pi}+\\int_0^{\\pi}\\cos x\\,dx = \\pi + [\\sin x]_0^{\\pi} = \\pi + 0 = \\pi$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho $I_n = \\int_0^{\\pi/2}\\sin^n x\\,dx$. Xét tính đúng sai:',
    statementA: '$I_0 = \\frac{\\pi}{2}$.',
    answerA: true,
    statementB: '$I_1 = 1$.',
    answerB: true,
    statementC: '$I_2 = \\frac{\\pi}{4}$.',
    answerC: true,
    statementD: '$I_n$ tăng khi $n$ tăng.',
    answerD: false,
    explanation: 'A: $\\int_0^{\\pi/2}1\\,dx=\\pi/2$ ✓. B: $[-\\cos x]_0^{\\pi/2}=1$ ✓. C: ✓. D: $\\sin^n x\\leq \\sin^{n-1}x$ trên $(0,\\pi/2)$ nên $I_n\\leq I_{n-1}$ → giảm ✗.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Tính $\\int_0^{\\ln 2} e^x(e^x+1)^2\\,dx$. Kết quả là số nguyên.',
    correctAnswer: '9',
    explanation: 'Đặt $t=e^x+1$, $dt=e^x dx$. Cận: $x=0\\to t=2$, $x=\\ln 2\\to t=3$. $\\int_2^3 t^2\\,dt=[\\frac{t^3}{3}]_2^3=9-\\frac{8}{3}=\\frac{19}{3}$. Thử cách khác: $\\int_0^{\\ln 2}e^x(e^{2x}+2e^x+1)dx=\\int_0^{\\ln 2}(e^{3x}+2e^{2x}+e^x)dx=[\\frac{e^{3x}}{3}+e^{2x}+e^x]_0^{\\ln 2}=(\\frac{8}{3}+4+2)-(\\frac{1}{3}+1+1)=\\frac{7}{3}+4=\\frac{19}{3}$.',
    topic: Topic.INTEGRALS, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '19',
  },
];

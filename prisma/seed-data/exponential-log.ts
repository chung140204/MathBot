import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const exponentialLogQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Tính $\\log_2 8$.',
    options: { A: '$3$', B: '$4$', C: '$2$', D: '$8$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_2 8 = \\log_2 2^3 = 3$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\log_{10} 100$.',
    options: { A: '$2$', B: '$10$', C: '$1$', D: '$100$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_{10}100 = \\log_{10}10^2 = 2$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\ln e^3$.',
    options: { A: '$3$', B: '$e^3$', C: '$1$', D: '$3e$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\ln e^3 = 3\\ln e = 3$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = 2^x$ đồng biến hay nghịch biến?',
    options: { A: 'Đồng biến trên $\\mathbb{R}$', B: 'Nghịch biến trên $\\mathbb{R}$', C: 'Đồng biến trên $(0, +\\infty)$', D: 'Không đơn điệu' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$y=2^x$ có cơ số $a=2>1$ nên đồng biến trên $\\mathbb{R}$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $5^0$.',
    options: { A: '$1$', B: '$0$', C: '$5$', D: '$-1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$a^0 = 1$ với mọi $a \\neq 0$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = \\left(\\frac{1}{3}\\right)^x$ là hàm:',
    options: { A: 'Nghịch biến trên $\\mathbb{R}$', B: 'Đồng biến trên $\\mathbb{R}$', C: 'Không đơn điệu', D: 'Đồng biến trên $(0,+\\infty)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Cơ số $\\frac{1}{3}<1$ nên hàm nghịch biến trên $\\mathbb{R}$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giá trị nào sau đây bằng $\\log_3 9 + \\log_3 3$?',
    options: { A: '$3$', B: '$2$', C: '$4$', D: '$6$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_3 9 + \\log_3 3 = 2 + 1 = 3$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = \\log_2 x$ có tập xác định là:',
    options: { A: '$(0, +\\infty)$', B: '$\\mathbb{R}$', C: '$[-1, +\\infty)$', D: '$(1, +\\infty)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_2 x$ xác định khi $x > 0$, tức $TXĐ = (0, +\\infty)$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $e^{\\ln 5}$.',
    options: { A: '$5$', B: '$\\ln 5$', C: '$e^5$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$e^{\\ln 5} = 5$ (vì $e^{\\ln x} = x$).',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình $2^x = 16$ có nghiệm $x$ là:',
    options: { A: '$4$', B: '$3$', C: '$8$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$2^x = 2^4 \\Rightarrow x = 4$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho $\\log_2 x = 3$. Xét tính đúng sai:',
    statementA: '$x = 8$.',
    answerA: true,
    statementB: '$x = 2^3$.',
    answerB: true,
    statementC: '$\\log_2(x/2) = 2$.',
    answerC: true,
    statementD: '$\\log_4 x = 3$.',
    answerD: false,
    explanation: 'A: ✓. B: ✓. C: $\\log_2 4 = 2$ ✓. D: $\\log_4 8 = 3/2 \\neq 3$ ✗.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Xét hàm $f(x) = 3^x$. Tính đúng sai:',
    statementA: '$f(0) = 1$.',
    answerA: true,
    statementB: '$f(1) = 3$.',
    answerB: true,
    statementC: '$f(-1) = \\frac{1}{3}$.',
    answerC: true,
    statementD: '$f(x) < 0$ với mọi $x$.',
    answerD: false,
    explanation: 'A,B,C: ✓. D: $3^x>0$ với mọi $x$ ✗.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Tính $\\log_3 27 + \\log_3 \\frac{1}{3}$. Kết quả là số nguyên.',
    correctAnswer: '2',
    explanation: '$\\log_3 27 + \\log_3 \\frac{1}{3} = 3 + (-1) = 2$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '2',
  },
  {
    content: 'Giải phương trình $3^x = 81$. Tìm $x$.',
    correctAnswer: '4',
    explanation: '$3^x = 3^4 \\Rightarrow x=4$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '4',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Giải phương trình $4^x = 2^{x+6}$.',
    options: { A: '$x = 6$', B: '$x = 3$', C: '$x = 4$', D: '$x = 2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$2^{2x} = 2^{x+6} \\Rightarrow 2x = x+6 \\Rightarrow x=6$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giải phương trình $\\log_2(x+3) = 4$.',
    options: { A: '$x = 13$', B: '$x = 11$', C: '$x = 16$', D: '$x = 12$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$x+3 = 2^4 = 16 \\Rightarrow x=13$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Rút gọn $\\log_a a^5 - 2\\log_a a^2$.',
    options: { A: '$1$', B: '$5$', C: '$3$', D: '$9$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$5\\log_a a - 2 \\cdot 2\\log_a a = 5 - 4 = 1$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giải bất phương trình $2^x > 32$.',
    options: { A: '$x > 5$', B: '$x > 4$', C: '$x \\geq 5$', D: '$x > 6$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$2^x > 2^5 \\Rightarrow x > 5$ (cơ số $2 > 1$).',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giải phương trình $\\ln(2x-1) = \\ln(x+4)$.',
    options: { A: '$x = 5$', B: '$x = 3$', C: '$x = 4$', D: '$x = 6$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$2x-1 = x+4 \\Rightarrow x=5$. Kiểm tra: $2(5)-1=9>0$ ✓.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tính $\\log_6 4 + \\log_6 9$.',
    options: { A: '$2$', B: '$3$', C: '$1$', D: '$\\log_6 13$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_6 4 + \\log_6 9 = \\log_6(4 \\cdot 9) = \\log_6 36 = 2$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giải bất phương trình $\\log_{1/2}(x-1) < -2$.',
    options: { A: '$x > 5$', B: '$x < 5$', C: '$x > 3$', D: '$1 < x < 5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Cơ số $<1$ nên đảo chiều: $x-1 > (1/2)^{-2}=4 \\Rightarrow x>5$. ĐK: $x>1$ (thỏa).',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hàm số $y = e^{2x-1}$ đồng biến trên khoảng nào?',
    options: { A: '$(-\\infty, +\\infty)$', B: '$(0, +\\infty)$', C: '$(\\frac{1}{2}, +\\infty)$', D: '$(-\\infty, 1)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$y\'=2e^{2x-1}>0$ với mọi $x$, nên đồng biến trên toàn $\\mathbb{R}$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Cho $a>0, a\\neq 1$. Xét tính đúng sai về logarit:',
    statementA: '$\\log_a(mn) = \\log_a m + \\log_a n$ ($m,n>0$).',
    answerA: true,
    statementB: '$\\log_a\\frac{m}{n} = \\log_a m - \\log_a n$.',
    answerB: true,
    statementC: '$\\log_a m^k = k\\log_a m$.',
    answerC: true,
    statementD: '$\\log_a m = \\frac{\\log_b m}{\\log_b a}$ (đổi cơ số).',
    answerD: true,
    explanation: 'Tất cả là các tính chất logarit cơ bản, đều đúng.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Giải phương trình $2^{2x} - 5 \\cdot 2^x + 4 = 0$. Đặt $t = 2^x$. Xét tính đúng sai:',
    statementA: 'Phương trình trở thành $t^2 - 5t + 4 = 0$.',
    answerA: true,
    statementB: 'Nghiệm là $t=1$ và $t=4$.',
    answerB: true,
    statementC: 'Từ $t=1$: $x=0$.',
    answerC: true,
    statementD: 'Từ $t=4$: $x=4$.',
    answerD: false,
    explanation: 'A: ✓. B: $(t-1)(t-4)=0$ ✓. C: $2^x=1 \\Rightarrow x=0$ ✓. D: $2^x=4=2^2 \\Rightarrow x=2$ ✗.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Số nghiệm của phương trình $4^x - 3 \\cdot 2^x - 4 = 0$ là:',
    correctAnswer: '1',
    explanation: 'Đặt $t=2^x>0$: $t^2-3t-4=0 \\Rightarrow (t-4)(t+1)=0$. $t=4 \\Rightarrow x=2$; $t=-1<0$ loại. 1 nghiệm.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },

  // APPLICATION - MC (5)
  {
    content: 'Giải bất phương trình $\\log_2(x^2-3x+2) > 0$.',
    options: { A: '$x < 1$ hoặc $x > 2$', B: '$1 < x < 2$', C: '$x>3$', D: '$x>2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_2(...) > 0 \\Leftrightarrow x^2-3x+2>1 \\Leftrightarrow x^2-3x+1>0$. Nghiệm $x=\\frac{3\\pm\\sqrt{5}}{2}$. Kết hợp ĐK $x<1$ hoặc $x>2$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tìm nghiệm của phương trình $3^{x+1} + 3^x = 108$.',
    options: { A: '$x = 3$', B: '$x = 2$', C: '$x = 4$', D: '$x = 5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$3^x(3+1) = 108 \\Rightarrow 4 \\cdot 3^x = 108 \\Rightarrow 3^x = 27 = 3^3 \\Rightarrow x=3$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số tiền $P$ triệu đồng gửi ngân hàng lãi suất $r = 0.1$/năm. Sau $n$ năm có $P(1.1)^n$. Sau bao nhiêu năm gấp đôi?',
    options: { A: '$\\lceil\\frac{\\ln 2}{\\ln 1.1}\\rceil = 8$ năm', B: '$5$ năm', C: '$10$ năm', D: '$7$ năm' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$(1.1)^n \\geq 2 \\Rightarrow n \\geq \\frac{\\ln 2}{\\ln 1.1} \\approx 7.27 \\Rightarrow n = 8$ năm.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Giải phương trình $\\log_3(x+1) + \\log_3(x-1) = 3$.',
    options: { A: '$x = \\sqrt{28}$', B: '$x = 5$', C: '$x = 4$', D: '$x = 3\\sqrt{3}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\log_3[(x+1)(x-1)]=3 \\Rightarrow x^2-1=27 \\Rightarrow x^2=28 \\Rightarrow x=\\sqrt{28}$ (lấy nghiệm dương).',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tìm số nguyên $x$ lớn nhất thỏa $\\left(\\frac{1}{2}\\right)^x \\geq \\frac{1}{64}$.',
    options: { A: '$6$', B: '$5$', C: '$7$', D: '$4$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\frac{1}{2^x} \\geq \\frac{1}{64}=\\frac{1}{2^6} \\Rightarrow 2^x \\leq 2^6 \\Rightarrow x \\leq 6$. Số nguyên lớn nhất: $x=6$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: 'Xét phương trình $e^{2x} - 3e^x + 2 = 0$. Tính đúng sai:',
    statementA: 'Đặt $t = e^x$ ($t>0$), phương trình trở thành $t^2-3t+2=0$.',
    answerA: true,
    statementB: 'Nghiệm $t=1$ và $t=2$.',
    answerB: true,
    statementC: 'Phương trình có 2 nghiệm thực phân biệt.',
    answerC: true,
    statementD: 'Tổng các nghiệm bằng $\\ln 2$.',
    answerD: false,
    explanation: 'A: ✓. B: $(t-1)(t-2)=0$ ✓. C: $x=0$ và $x=\\ln 2$ ✓. D: Tổng = $0+\\ln 2=\\ln 2$ ✓ — đúng. Sửa: ✓.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Giải phương trình $\\log_2(x+1) = 3$. Tìm $x$.',
    correctAnswer: '7',
    explanation: '$x+1 = 2^3 = 8 \\Rightarrow x=7$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '7',
  },

  // ADVANCED - MC (2)
  {
    content: 'Số nghiệm của phương trình $\\log^2 x - 5\\log x + 6 = 0$ (log cơ số 10) là:',
    options: { A: '$2$', B: '$1$', C: '$0$', D: '$3$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đặt $t=\\log x$: $t^2-5t+6=0 \\Rightarrow t=2$ hoặc $t=3$. $x=100$ hoặc $x=1000$ → 2 nghiệm.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tập nghiệm của $\\log_2(x-1) + \\log_4(x-1) = 6$ là:',
    options: { A: '$\\{x = 2^4+1\\}$', B: '$\\{x=17\\}$', C: '$\\{x=5\\}$', D: '$\\{x=65\\}\\}$' } as Prisma.JsonObject,
    answer: 'B',
    explanation: '$\\log_2(x-1) + \\frac{1}{2}\\log_2(x-1) = 6 \\Rightarrow \\frac{3}{2}\\log_2(x-1)=6 \\Rightarrow \\log_2(x-1)=4 \\Rightarrow x-1=16 \\Rightarrow x=17$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho $f(x) = 2^x + 2^{-x}$. Xét tính đúng sai:',
    statementA: '$f(x) \\geq 2$ với mọi $x$ thực.',
    answerA: true,
    statementB: '$f(x)$ là hàm chẵn.',
    answerB: true,
    statementC: '$f(x)$ đạt giá trị nhỏ nhất bằng $2$ tại $x=0$.',
    answerC: true,
    statementD: '$f(x)$ đơn điệu trên $\\mathbb{R}$.',
    answerD: false,
    explanation: 'A: Bất đẳng thức AM-GM: $2^x+2^{-x}\\geq 2\\sqrt{2^x \\cdot 2^{-x}}=2$ ✓. B: $f(-x)=2^{-x}+2^x=f(x)$ ✓. C: ✓. D: Không đơn điệu (giảm rồi tăng) ✗.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Tổng tất cả nghiệm của phương trình $9^x - 10 \\cdot 3^x + 9 = 0$ là số nguyên bằng:',
    correctAnswer: '2',
    explanation: 'Đặt $t=3^x>0$: $t^2-10t+9=0 \\Rightarrow (t-1)(t-9)=0$. $t=1\\Rightarrow x=0$; $t=9=3^2\\Rightarrow x=2$. Tổng = $0+2=2$.',
    topic: Topic.EXPONENTIAL_LOG, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '2',
  },
];

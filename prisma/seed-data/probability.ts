import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const probabilityQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Chọn ngẫu nhiên 1 học sinh từ lớp 40 học sinh (15 nam, 25 nữ). Xác suất chọn được học sinh nam là:',
    options: { A: '$\\frac{3}{8}$', B: '$\\frac{5}{8}$', C: '$\\frac{15}{40}$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(\\text{nam}) = \\frac{15}{40} = \\frac{3}{8}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Gieo 1 xúc xắc cân đối. Xác suất xuất hiện mặt số chẵn là:',
    options: { A: '$\\frac{1}{2}$', B: '$\\frac{1}{3}$', C: '$\\frac{2}{3}$', D: '$\\frac{1}{6}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Mặt chẵn: $\\{2, 4, 6\\}$. $P = \\frac{3}{6} = \\frac{1}{2}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số chỉnh hợp chập 2 của 5 phần tử $A_5^2$ bằng:',
    options: { A: '$20$', B: '$10$', C: '$25$', D: '$15$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$A_5^2 = 5 \\times 4 = 20$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số tổ hợp chập 3 của 6 phần tử $C_6^3$ bằng:',
    options: { A: '$20$', B: '$30$', C: '$120$', D: '$15$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$C_6^3 = \\frac{6!}{3!3!} = 20$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Xác suất của biến cố chắc chắn bằng:',
    options: { A: '$1$', B: '$0$', C: '$0.5$', D: '$-1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Biến cố chắc chắn luôn xảy ra nên $P = 1$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Túi đựng 3 bi đỏ, 2 bi xanh. Rút ngẫu nhiên 1 bi. Xác suất rút được bi xanh là:',
    options: { A: '$\\frac{2}{5}$', B: '$\\frac{3}{5}$', C: '$\\frac{1}{2}$', D: '$\\frac{1}{5}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(\\text{xanh}) = \\frac{2}{5}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số hoán vị của 4 phần tử bằng:',
    options: { A: '$24$', B: '$12$', C: '$16$', D: '$8$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P_4 = 4! = 24$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nếu $P(A) = 0.4$ thì $P(\\bar{A})$ (xác suất biến cố đối của $A$) bằng:',
    options: { A: '$0.6$', B: '$0.4$', C: '$0.5$', D: '$1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(\\bar{A}) = 1 - P(A) = 1 - 0.4 = 0.6$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: '$C_n^0 = $ ?',
    options: { A: '$1$', B: '$n$', C: '$0$', D: '$n!$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$C_n^0 = \\frac{n!}{0! \\cdot n!} = 1$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số cách xếp 5 học sinh vào 5 ghế là:',
    options: { A: '$120$', B: '$25$', C: '$60$', D: '$100$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P_5 = 5! = 120$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Gieo xúc xắc 1 lần. Gọi $A$ = "xuất hiện số lẻ". Xét tính đúng sai:',
    statementA: '$A = \\{1, 3, 5\\}$.',
    answerA: true,
    statementB: '$P(A) = \\frac{1}{2}$.',
    answerB: true,
    statementC: '$\\bar{A} = \\{2, 4, 6\\}$.',
    answerC: true,
    statementD: '$P(A) + P(\\bar{A}) = 2$.',
    answerD: false,
    explanation: 'A,B,C: ✓. D: $P(A)+P(\\bar{A})=1$ ✗.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho $A_5^2$, $C_5^2$, $P_3$. Xét tính đúng sai:',
    statementA: '$A_5^2 = 20$.',
    answerA: true,
    statementB: '$C_5^2 = 10$.',
    answerB: true,
    statementC: '$A_5^2 = 2 \\cdot C_5^2$.',
    answerC: true,
    statementD: '$P_3 = 3! = 9$.',
    answerD: false,
    explanation: 'A: ✓. B: $\\frac{5!}{2!3!}=10$ ✓. C: $20=2\\times 10$ ✓. D: $3!=6$ ✗.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Một hộp có 4 bi đỏ và 6 bi trắng. Rút ngẫu nhiên 1 bi. Tính xác suất rút bi đỏ. Nhập tử số (phân số tối giản có mẫu là 5).',
    correctAnswer: '2',
    explanation: '$P = \\frac{4}{10} = \\frac{2}{5}$. Tử số: $2$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '2',
  },
  {
    content: 'Tính $C_7^2$.',
    correctAnswer: '21',
    explanation: '$C_7^2 = \\frac{7 \\times 6}{2} = 21$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '21',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Gieo 2 xúc xắc. Xác suất tổng 2 mặt bằng 7 là:',
    options: { A: '$\\frac{1}{6}$', B: '$\\frac{7}{36}$', C: '$\\frac{1}{4}$', D: '$\\frac{5}{36}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tổng 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ — 6 cặp. $P=\\frac{6}{36}=\\frac{1}{6}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Rút ngẫu nhiên 2 thẻ từ 10 thẻ đánh số 1 đến 10. Xác suất cả 2 thẻ đều có số chẵn là:',
    options: { A: '$\\frac{2}{9}$', B: '$\\frac{1}{4}$', C: '$\\frac{1}{5}$', D: '$\\frac{4}{9}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thẻ chẵn: 5 thẻ. $P = \\frac{C_5^2}{C_{10}^2} = \\frac{10}{45} = \\frac{2}{9}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Xếp ngẫu nhiên 3 nam và 2 nữ thành 1 hàng. Xác suất 2 nữ đứng cạnh nhau là:',
    options: { A: '$\\frac{2}{5}$', B: '$\\frac{1}{5}$', C: '$\\frac{3}{5}$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Coi 2 nữ là 1 khối: $4! \\times 2! = 48$ cách. Tổng: $5! = 120$. $P = \\frac{48}{120} = \\frac{2}{5}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hai xạ thủ cùng bắn, mỗi người bắn 1 phát. Xác suất bắn trúng của người thứ nhất là 0.8, người thứ hai là 0.7. Xác suất để cả 2 đều trúng là:',
    options: { A: '$0.56$', B: '$0.5$', C: '$0.24$', D: '$1.5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hai sự kiện độc lập: $P = 0.8 \\times 0.7 = 0.56$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Có 5 câu hỏi trắc nghiệm, mỗi câu 4 đáp án. Xác suất chọn ngẫu nhiên đúng cả 5 câu là:',
    options: { A: '$\\frac{1}{1024}$', B: '$\\frac{1}{512}$', C: '$\\frac{5}{4}$', D: '$\\frac{1}{4^5}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P = \\left(\\frac{1}{4}\\right)^5 = \\frac{1}{1024}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Từ 10 sản phẩm (7 tốt, 3 xấu), lấy ngẫu nhiên 3. Xác suất được đúng 2 sản phẩm tốt là:',
    options: { A: '$\\frac{21}{40}$', B: '$\\frac{7}{40}$', C: '$\\frac{1}{4}$', D: '$\\frac{3}{10}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P = \\frac{C_7^2 \\cdot C_3^1}{C_{10}^3} = \\frac{21 \\times 3}{120} = \\frac{63}{120} = \\frac{21}{40}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Một bạn làm bài kiểm tra 10 câu đúng sai, trả lời ngẫu nhiên. Xác suất đúng ít nhất 9 câu là:',
    options: { A: '$\\frac{11}{1024}$', B: '$\\frac{10}{1024}$', C: '$\\frac{1}{1024}$', D: '$\\frac{1}{100}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(X\\geq 9) = C_{10}^9(\\frac{1}{2})^{10} + C_{10}^{10}(\\frac{1}{2})^{10} = \\frac{10+1}{1024} = \\frac{11}{1024}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Chọn ngẫu nhiên 2 người từ nhóm 4 nam 3 nữ. Xác suất chọn được 1 nam 1 nữ là:',
    options: { A: '$\\frac{4}{7}$', B: '$\\frac{3}{7}$', C: '$\\frac{12}{21}$', D: '$\\frac{2}{7}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P = \\frac{C_4^1 C_3^1}{C_7^2} = \\frac{12}{21} = \\frac{4}{7}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Gieo đồng tiền cân đối 3 lần. Gọi $X$ = số lần xuất hiện mặt ngửa. Xét tính đúng sai:',
    statementA: '$P(X=0) = \\frac{1}{8}$.',
    answerA: true,
    statementB: '$P(X=3) = \\frac{1}{8}$.',
    answerB: true,
    statementC: '$P(X=1) = \\frac{3}{8}$.',
    answerC: true,
    statementD: '$P(X \\geq 2) = \\frac{3}{8}$.',
    answerD: false,
    explanation: 'A: $(1/2)^3=1/8$ ✓. B: $(1/2)^3=1/8$ ✓. C: $C_3^1(1/2)^3=3/8$ ✓. D: $P(X\\geq 2)=P(X=2)+P(X=3)=3/8+1/8=4/8=1/2$ ✗.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho 2 biến cố $A$ và $B$ độc lập với $P(A)=0.3$, $P(B)=0.4$. Xét tính đúng sai:',
    statementA: '$P(A \\cap B) = 0.12$.',
    answerA: true,
    statementB: '$P(A \\cup B) = P(A)+P(B)-P(A \\cap B) = 0.58$.',
    answerB: true,
    statementC: '$P(\\bar{A} \\cap \\bar{B}) = 0.42$.',
    answerC: true,
    statementD: '$P(A|B) = 0.4$.',
    answerD: false,
    explanation: 'A: $0.3\\times0.4=0.12$ ✓. B: $0.3+0.4-0.12=0.58$ ✓. C: $(1-0.3)(1-0.4)=0.42$ ✓. D: $P(A|B)=P(A)=0.3$ (độc lập) ✗.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Từ tổ hợp $C_{10}^3$, tính số cách chọn 3 học sinh từ 10 học sinh để thành lập ban cán sự. Nhập kết quả.',
    correctAnswer: '120',
    explanation: '$C_{10}^3 = \\frac{10 \\times 9 \\times 8}{3!} = 120$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '120',
  },

  // APPLICATION - MC (5)
  {
    content: 'Xác suất có điều kiện $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. Biết $P(B) = 0.5$, $P(A \\cap B) = 0.3$. Tính $P(A|B)$.',
    options: { A: '$0.6$', B: '$0.3$', C: '$0.5$', D: '$0.15$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(A|B) = \\frac{0.3}{0.5} = 0.6$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phân phối nhị thức: $X \\sim B(10, 0.3)$. Tính $P(X=2)$.',
    options: { A: '$C_{10}^2 (0.3)^2 (0.7)^8$', B: '$C_{10}^2 (0.3)^8 (0.7)^2$', C: '$(0.3)^2$', D: '$C_{10}^2 (0.7)^8$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(X=k) = C_n^k p^k(1-p)^{n-k}$. $P(X=2) = C_{10}^2(0.3)^2(0.7)^8$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Từ 4 nam, 3 nữ, chọn ngẫu nhiên 3 người. Xác suất có ít nhất 1 nữ là:',
    options: { A: '$\\frac{31}{35}$', B: '$\\frac{4}{35}$', C: '$\\frac{3}{7}$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(\\text{không có nữ}) = \\frac{C_4^3}{C_7^3} = \\frac{4}{35}$. $P(\\text{ít nhất 1 nữ}) = 1 - \\frac{4}{35} = \\frac{31}{35}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Gieo xúc xắc đến khi xuất hiện mặt 6 thì dừng. Xác suất để phải gieo đúng 3 lần là:',
    options: { A: '$\\frac{25}{216}$', B: '$\\frac{1}{216}$', C: '$\\frac{5}{36}$', D: '$\\frac{25}{36}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hai lần đầu không ra 6, lần 3 ra 6: $(\\frac{5}{6})^2 \\times \\frac{1}{6} = \\frac{25}{216}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Có 3 hộp: Hộp 1 (2 đỏ, 1 trắng), Hộp 2 (1 đỏ, 2 trắng), Hộp 3 (1 đỏ, 1 trắng). Chọn ngẫu nhiên 1 hộp rồi lấy 1 bi. Xác suất lấy được bi đỏ là:',
    options: { A: '$\\frac{4}{9}$', B: '$\\frac{1}{3}$', C: '$\\frac{5}{9}$', D: '$\\frac{1}{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P = \\frac{1}{3} \\cdot \\frac{2}{3} + \\frac{1}{3} \\cdot \\frac{1}{3} + \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{2}{9}+\\frac{1}{9}+\\frac{1}{6} = \\frac{4+2+3}{18} = \\frac{9}{18} = \\frac{1}{2}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: '$X \\sim B(5, 0.5)$. Xét tính đúng sai:',
    statementA: '$P(X=0) = \\frac{1}{32}$.',
    answerA: true,
    statementB: '$P(X=5) = \\frac{1}{32}$.',
    answerB: true,
    statementC: '$E(X) = np = 2.5$.',
    answerC: true,
    statementD: '$P(X=3) = P(X=2)$.',
    answerD: true,
    explanation: 'A: $(0.5)^5=1/32$ ✓. B: ✓. C: $E=5\\times0.5=2.5$ ✓. D: Vì $p=1/2$: $P(X=k)=C_5^k/32$, $P(X=3)=C_5^3/32=10/32$, $P(X=2)=C_5^2/32=10/32$ ✓.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Xếp ngẫu nhiên 4 học sinh vào hàng. Xác suất để 2 học sinh $A$ và $B$ đứng cạnh nhau là phân số $\\frac{p}{q}$ tối giản. Nhập $p$.',
    correctAnswer: '1',
    explanation: 'Coi $A,B$ là 1 khối: $3! \\times 2 = 12$ cách. Tổng: $4!=24$. $P=\\frac{12}{24}=\\frac{1}{2}$. Tử số $p=1$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },

  // ADVANCED - MC (2)
  {
    content: 'Công thức Bayes: Biết $P(H_1)=0.4$, $P(H_2)=0.6$, $P(A|H_1)=0.3$, $P(A|H_2)=0.5$. Tính $P(H_1|A)$.',
    options: { A: '$\\frac{2}{7}$', B: '$\\frac{3}{7}$', C: '$0.4$', D: '$\\frac{1}{4}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$P(A)=0.4\\times0.3+0.6\\times0.5=0.12+0.30=0.42$. $P(H_1|A)=\\frac{0.4\\times0.3}{0.42}=\\frac{0.12}{0.42}=\\frac{2}{7}$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: '$X \\sim B(n, p)$ với $E(X)=4$, $D(X)=2.4$. Tìm $n$:',
    options: { A: '$10$', B: '$8$', C: '$12$', D: '$6$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$np=4$, $np(1-p)=2.4 \\Rightarrow 4(1-p)=2.4 \\Rightarrow p=0.4$. $n=4/0.4=10$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho $X \\sim B(6, 1/3)$. Xét tính đúng sai:',
    statementA: '$E(X) = 2$.',
    answerA: true,
    statementB: '$D(X) = \\frac{4}{3}$.',
    answerB: true,
    statementC: '$P(X=0) = (\\frac{2}{3})^6 = \\frac{64}{729}$.',
    answerC: true,
    statementD: '$P(X \\geq 1) = 1 - P(X=0) < \\frac{2}{3}$.',
    answerD: false,
    explanation: 'A: $np=6\\times1/3=2$ ✓. B: $np(1-p)=2\\times2/3=4/3$ ✓. C: $C_6^0(1/3)^0(2/3)^6=64/729$ ✓. D: $P(X\\geq1)=1-64/729=665/729>2/3$ ✗.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Số cách sắp xếp 6 học sinh thành 1 vòng tròn là số nguyên bằng:',
    correctAnswer: '120',
    explanation: 'Hoán vị vòng tròn: $(n-1)! = 5! = 120$.',
    topic: Topic.PROBABILITY, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '120',
  },
];

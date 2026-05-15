import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const volumeQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Công thức tính thể tích khối lăng trụ có diện tích đáy $S$ và chiều cao $h$ là:',
    options: { A: '$V = Sh$', B: '$V = \\frac{1}{3}Sh$', C: '$V = 2Sh$', D: '$V = \\frac{1}{2}Sh$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'Thể tích lăng trụ: $V = Sh$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Công thức tính thể tích khối chóp có diện tích đáy $S$ và chiều cao $h$ là:',
    options: { A: '$V = \\frac{1}{3}Sh$', B: '$V = Sh$', C: '$V = \\frac{2}{3}Sh$', D: '$V = \\frac{1}{2}Sh$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'Thể tích khối chóp: $V = \\frac{1}{3}Sh$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Thể tích khối trụ có bán kính đáy $r = 3$ và chiều cao $h = 5$ là:',
    options: { A: '$45\\pi$', B: '$15\\pi$', C: '$30\\pi$', D: '$9\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\pi r^2 h = \\pi \\cdot 9 \\cdot 5 = 45\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Thể tích khối nón có bán kính đáy $r = 6$ và chiều cao $h = 9$ là:',
    options: { A: '$108\\pi$', B: '$324\\pi$', C: '$54\\pi$', D: '$216\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot 36 \\cdot 9 = 108\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Thể tích khối cầu có bán kính $R = 3$ là:',
    options: { A: '$36\\pi$', B: '$27\\pi$', C: '$108\\pi$', D: '$12\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Diện tích mặt cầu có bán kính $R = 5$ là:',
    options: { A: '$100\\pi$', B: '$25\\pi$', C: '$50\\pi$', D: '$75\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S = 4\\pi R^2 = 4\\pi \\cdot 25 = 100\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối hộp chữ nhật có kích thước $a = 2, b = 3, c = 4$. Thể tích là:',
    options: { A: '$24$', B: '$12$', C: '$9$', D: '$36$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = abc = 2 \\cdot 3 \\cdot 4 = 24$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Thể tích khối lập phương có cạnh $a = 5$ là:',
    options: { A: '$125$', B: '$25$', C: '$75$', D: '$150$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = a^3 = 125$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối chóp tam giác đều $S.ABC$ có cạnh đáy $a = 6$, chiều cao $h = 4$. Thể tích là:',
    options: { A: '$12\\sqrt{3}$', B: '$24\\sqrt{3}$', C: '$36\\sqrt{3}$', D: '$6\\sqrt{3}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S_{\\triangle} = \\frac{6^2\\sqrt{3}}{4} = 9\\sqrt{3}$. $V = \\frac{1}{3} \\cdot 9\\sqrt{3} \\cdot 4 = 12\\sqrt{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối trụ có đường kính đáy $d = 8$, chiều cao $h = 10$. Thể tích là:',
    options: { A: '$160\\pi$', B: '$640\\pi$', C: '$320\\pi$', D: '$80\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$r = 4$. $V = \\pi \\cdot 16 \\cdot 10 = 160\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  // RECOGNITION - TF (2)
  {
    content: 'Xét tính đúng/sai về công thức thể tích:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Thể tích lăng trụ: $V = Sh$.', answerA: true,
    statementB: 'Thể tích chóp: $V = \\frac{1}{2}Sh$.', answerB: false,
    statementC: 'Thể tích cầu bán kính $R$: $V = \\frac{4}{3}\\pi R^3$.', answerC: true,
    statementD: 'Thể tích nón: $V = \\pi r^2 h$.', answerD: false,
    explanation: 'Chóp: $V = \\frac{1}{3}Sh$✗. Nón: $V = \\frac{1}{3}\\pi r^2 h$✗.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, answer: '', options: {} as Prisma.JsonObject,
  },
  {
    content: 'Cho khối lập phương cạnh $a$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Thể tích: $V = a^3$.', answerA: true,
    statementB: 'Diện tích toàn phần: $S = 6a^2$.', answerB: true,
    statementC: 'Đường chéo có độ dài $a\\sqrt{2}$.', answerC: false,
    statementD: 'Diện tích mặt cầu ngoại tiếp là $3\\pi a^2$.', answerD: true,
    explanation: 'Đường chéo $= a\\sqrt{3}$✗. $R = \\frac{a\\sqrt{3}}{2}$, $S = 4\\pi R^2 = 3\\pi a^2$✓.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, answer: '', options: {} as Prisma.JsonObject,
  },
  // RECOGNITION - SA (2)
  {
    content: 'Tính thể tích khối hộp chữ nhật có ba kích thước $2$, $3$ và $5$.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '30', explanation: '$V = 2 \\cdot 3 \\cdot 5 = 30$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, options: {} as Prisma.JsonObject, answer: '30',
  },
  {
    content: 'Khối cầu có đường kính $d = 6$. Thể tích bằng $k\\pi$. Tìm $k$.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '36', explanation: '$R = 3$. $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.RECOGNITION, options: {} as Prisma.JsonObject, answer: '36',
  },
  // COMPREHENSION - MC (8)
  {
    content: 'Khối hộp chữ nhật có kích thước $3, 4, 12$. Đường chéo dài bao nhiêu?',
    options: { A: '$13$', B: '$\\sqrt{153}$', C: '$\\sqrt{25}$', D: '$5\\sqrt{5}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$d = \\sqrt{9+16+144} = \\sqrt{169} = 13$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Lăng trụ đứng đáy tam giác vuông với hai cạnh góc vuông $3, 4$, chiều cao $10$. Thể tích là:',
    options: { A: '$60$', B: '$120$', C: '$30$', D: '$40$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6$. $V = 6 \\cdot 10 = 60$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối trụ $r = 3, h_1 = 8$ ghép với nón cùng đáy $r = 3, h_2 = 4$. Tổng thể tích là:',
    options: { A: '$84\\pi$', B: '$72\\pi$', C: '$96\\pi$', D: '$108\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\pi \\cdot 9 \\cdot 8 + \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 72\\pi + 12\\pi = 84\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA \\perp$ đáy, $SA = a$. Thể tích là:',
    options: { A: '$\\frac{a^3}{3}$', B: '$\\frac{a^3}{2}$', C: '$a^3$', D: '$\\frac{a^3}{6}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\frac{1}{3} \\cdot a^2 \\cdot a = \\frac{a^3}{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối nón có đường sinh $l = 10$, bán kính đáy $r = 6$. Thể tích là:',
    options: { A: '$96\\pi$', B: '$120\\pi$', C: '$288\\pi$', D: '$48\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$h = \\sqrt{100-36} = 8$. $V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 = 96\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Lăng trụ đứng $ABC.A\'B\'C\'$ đáy tam giác đều cạnh $4$, chiều cao $6$. Thể tích là:',
    options: { A: '$24\\sqrt{3}$', B: '$48\\sqrt{3}$', C: '$12\\sqrt{3}$', D: '$36\\sqrt{3}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S = \\frac{16\\sqrt{3}}{4} = 4\\sqrt{3}$. $V = 4\\sqrt{3} \\cdot 6 = 24\\sqrt{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Chóp tứ giác đều $S.ABCD$ cạnh đáy $a = 4$, cạnh bên $l = 6$. Thể tích là:',
    options: { A: '$\\frac{32\\sqrt{7}}{3}$', B: '$\\frac{64\\sqrt{7}}{3}$', C: '$\\frac{16\\sqrt{7}}{3}$', D: '$\\frac{128\\sqrt{7}}{3}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S = 16$. Nửa đường chéo đáy $= 2\\sqrt{2}$. $h = \\sqrt{36-8} = 2\\sqrt{7}$. $V = \\frac{1}{3} \\cdot 16 \\cdot 2\\sqrt{7} = \\frac{32\\sqrt{7}}{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Chóp tam giác đều $S.ABC$ cạnh đáy $a = 6$, tất cả cạnh bên cũng bằng $6$. Thể tích là:',
    options: { A: '$18\\sqrt{2}$', B: '$36\\sqrt{2}$', C: '$9\\sqrt{2}$', D: '$27\\sqrt{2}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$S_{\\triangle} = 9\\sqrt{3}$. Tâm đáy cách đỉnh $R_0 = \\frac{6}{\\sqrt{3}} = 2\\sqrt{3}$. $h = \\sqrt{36-12} = 2\\sqrt{6}$. $V = \\frac{1}{3} \\cdot 9\\sqrt{3} \\cdot 2\\sqrt{6} = 6\\sqrt{18} = 18\\sqrt{2}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  // COMPREHENSION - TF (2)
  {
    content: 'Chóp $S.ABC$: $SA \\perp (ABC)$, $SA = 6$, $\\triangle ABC$ vuông tại $B$, $AB = 3$, $BC = 4$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: '$S_{\\triangle ABC} = 6$.', answerA: true,
    statementB: 'Chiều cao khối chóp là $SA = 6$.', answerB: true,
    statementC: 'Thể tích bằng $36$.', answerC: false,
    statementD: 'Thể tích bằng $12$.', answerD: true,
    explanation: '$S = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6$✓. $h = SA = 6$✓. $V = \\frac{1}{3} \\cdot 6 \\cdot 6 = 12$, không phải $36$✗.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, answer: '', options: {} as Prisma.JsonObject,
  },
  {
    content: 'Khối trụ $r = 4$, $h = 9$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: '$V = 144\\pi$.', answerA: true,
    statementB: 'Diện tích xung quanh $= 72\\pi$.', answerB: true,
    statementC: 'Diện tích toàn phần $= 104\\pi$.', answerC: true,
    statementD: 'Đường sinh bằng $\\sqrt{97}$.', answerD: false,
    explanation: '$V=\\pi \\cdot 16 \\cdot 9=144\\pi$✓. $S_{xq}=2\\pi \\cdot 4 \\cdot 9=72\\pi$✓. $S_{tp}=72\\pi+32\\pi=104\\pi$✓. Đường sinh của trụ bằng chiều cao $h=9$, không phải $\\sqrt{97}$✗.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, answer: '', options: {} as Prisma.JsonObject,
  },
  // COMPREHENSION - SA (1)
  {
    content: 'Chóp tứ giác đều $S.ABCD$ cạnh đáy $a = 6$, chiều cao $h = 4$. Tính thể tích.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '48', explanation: '$V = \\frac{1}{3} \\cdot 36 \\cdot 4 = 48$.',
    topic: Topic.VOLUME, difficulty: Difficulty.COMPREHENSION, options: {} as Prisma.JsonObject, answer: '48',
  },
  // APPLICATION - MC (5)
  {
    content: 'Mặt cầu ngoại tiếp khối lập phương cạnh $a = 2$. Thể tích khối cầu là:',
    options: { A: '$4\\pi\\sqrt{3}$', B: '$\\frac{4\\pi\\sqrt{3}}{3}$', C: '$8\\pi$', D: '$\\frac{8\\pi}{3}$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$R = \\frac{a\\sqrt{3}}{2} = \\sqrt{3}$. $V = \\frac{4}{3}\\pi(\\sqrt{3})^3 = \\frac{4}{3}\\pi \\cdot 3\\sqrt{3} = 4\\pi\\sqrt{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối cầu nội tiếp khối lập phương cạnh $a = 6$. Thể tích khối cầu là:',
    options: { A: '$36\\pi$', B: '$32\\pi$', C: '$48\\pi$', D: '$24\\pi$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$R = \\frac{a}{2} = 3$. $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khối nón có thiết diện qua trục là tam giác đều cạnh $2a$. Thể tích là:',
    options: { A: '$\\frac{\\pi a^3 \\sqrt{3}}{3}$', B: '$\\frac{\\pi a^3 \\sqrt{3}}{2}$', C: '$\\pi a^3 \\sqrt{3}$', D: '$\\frac{2\\pi a^3 \\sqrt{3}}{3}$' } as Prisma.JsonObject,
    answer: 'A', explanation: 'Thiết diện qua trục là tam giác cân. Tam giác đều cạnh $2a$: đáy $= 2r = 2a$, $r = a$. Đường sinh $l = 2a$. $h = \\sqrt{4a^2-a^2} = a\\sqrt{3}$. $V = \\frac{1}{3}\\pi a^2 \\cdot a\\sqrt{3} = \\frac{\\pi a^3\\sqrt{3}}{3}$.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Chóp cụt có hai đáy hình vuông cạnh $a_1 = 6$, $a_2 = 3$, chiều cao $h = 4$. Thể tích là:',
    options: { A: '$84$', B: '$63$', C: '$108$', D: '$126$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\frac{h}{3}(S_1+S_2+\\sqrt{S_1 S_2}) = \\frac{4}{3}(36+9+18) = \\frac{4 \\cdot 63}{3} = 84$.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khi tăng bán kính khối trụ lên gấp đôi và giảm chiều cao còn một nửa thì thể tích thay đổi thế nào?',
    options: { A: 'Tăng gấp $2$ lần', B: 'Tăng gấp $4$ lần', C: 'Không đổi', D: 'Giảm $2$ lần' } as Prisma.JsonObject,
    answer: 'A', explanation: "$V' = \\pi(2r)^2 \\cdot \\frac{h}{2} = 4\\pi r^2 \\cdot \\frac{h}{2} = 2\\pi r^2 h = 2V$.",
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  // APPLICATION - TF (1)
  {
    content: 'Khối cầu bán kính $R$ ngoại tiếp khối trụ $r$, $h = 2r$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: '$R = r\\sqrt{2}$.', answerA: true,
    statementB: 'Thể tích khối trụ $= 2\\pi r^3$.', answerB: true,
    statementC: 'Thể tích khối cầu $= \\frac{4\\pi r^3\\sqrt{2}}{3}$.', answerC: false,
    statementD: 'Tỉ số $\\frac{V_{trụ}}{V_{cầu}} = \\frac{3}{4\\sqrt{2}}$.', answerD: false,
    explanation: '$R = \\sqrt{r^2+r^2} = r\\sqrt{2}$✓. $V_{trụ}=2\\pi r^3$✓. $V_{cầu}=\\frac{4}{3}\\pi(r\\sqrt{2})^3=\\frac{8\\sqrt{2}\\pi r^3}{3} \\neq \\frac{4\\sqrt{2}\\pi r^3}{3}$✗. Tỉ số $=\\frac{2\\pi r^3}{\\frac{8\\sqrt{2}\\pi r^3}{3}}=\\frac{6}{8\\sqrt{2}}=\\frac{3}{4\\sqrt{2}}=\\frac{3\\sqrt{2}}{8}$. (D ghi $\\frac{3}{4\\sqrt{2}}$ chưa rút gọn đúng)✗.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, answer: '', options: {} as Prisma.JsonObject,
  },
  // APPLICATION - SA (1)
  {
    content: 'Khối nón nội tiếp khối cầu bán kính $R = 5$. Khối nón có bán kính đáy $r = 4$. Tính chiều cao $h$.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '8',
    explanation: 'Tâm cầu $O$, tâm đáy $I$: $OI = \\sqrt{R^2 - r^2} = \\sqrt{25-16} = 3$. Đỉnh $S$ và đáy đều trên cầu; $SI = h = SO + OI = 5 + 3 = 8$.',
    topic: Topic.VOLUME, difficulty: Difficulty.APPLICATION, options: {} as Prisma.JsonObject, answer: '8',
  },
  // ADVANCED - MC (2)
  {
    content: 'Chóp cụt đáy là hai hình vuông cạnh $6$ và $3$, chiều cao $h = 4$. Thể tích là:',
    options: { A: '$84$', B: '$63$', C: '$108$', D: '$56$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$V = \\frac{4}{3}(36+9+18) = \\frac{4 \\cdot 63}{3} = 84$.',
    topic: Topic.VOLUME, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Nón cụt có hai bán kính $R = 6$, $r = 3$, chiều cao $h = 4$. Chiều cao khối nón ban đầu (trước khi cắt) là:',
    options: { A: '$8$', B: '$12$', C: '$6$', D: '$10$' } as Prisma.JsonObject,
    answer: 'A', explanation: '$\\frac{R}{H} = \\frac{r}{H-h} \\Rightarrow 6(H-4) = 3H \\Rightarrow 3H = 24 \\Rightarrow H = 8$.',
    topic: Topic.VOLUME, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  // ADVANCED - TF (1)
  {
    content: 'Nón cụt có hai bán kính $R = 6$, $r = 3$, chiều cao $h = 4$. Xét tính đúng/sai:',
    format: 'TRUE_FALSE' as const,
    statementA: 'Công thức $V = \\frac{\\pi h}{3}(R^2 + Rr + r^2)$.', answerA: true,
    statementB: 'Thể tích bằng $84\\pi$.', answerB: true,
    statementC: 'Chiều cao nón ban đầu (trước khi cắt) là $12$.', answerC: false,
    statementD: 'Đường sinh nón cụt bằng $5$.', answerD: true,
    explanation: '$V = \\frac{4\\pi}{3}(36+18+9) = 84\\pi$✓. Nón ban đầu cao $8$ không phải $12$✗. $l = \\sqrt{h^2+(R-r)^2} = \\sqrt{16+9} = 5$✓.',
    topic: Topic.VOLUME, difficulty: Difficulty.ADVANCED, answer: '', options: {} as Prisma.JsonObject,
  },
  // ADVANCED - SA (1)
  {
    content: 'Trong các khối hộp chữ nhật có tổng diện tích các mặt bằng $96$, khối có thể tích lớn nhất là khối lập phương. Tính thể tích lớn nhất đó.',
    format: 'SHORT_ANSWER' as const,
    correctAnswer: '64',
    explanation: '$2(ab+bc+ca) = 96 \\Rightarrow ab+bc+ca = 48$. Theo AM-GM, $abc$ max khi $a=b=c$: $3a^2=48 \\Rightarrow a=4$. $V = 4^3 = 64$.',
    topic: Topic.VOLUME, difficulty: Difficulty.ADVANCED, options: {} as Prisma.JsonObject, answer: '64',
  },
];

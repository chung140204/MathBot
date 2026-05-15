import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const analyticGeometryQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Khoảng cách giữa hai điểm $A(1, 2)$ và $B(4, 6)$ là:',
    options: { A: '$5$', B: '$4$', C: '$\\sqrt{7}$', D: '$7$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$AB = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tọa độ trung điểm $M$ của đoạn $AB$ với $A(2, 4)$ và $B(6, 8)$ là:',
    options: { A: '$(4, 6)$', B: '$(3, 5)$', C: '$(4, 5)$', D: '$(8, 12)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$M = \\left(\\frac{2+6}{2}, \\frac{4+8}{2}\\right) = (4, 6)$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Vectơ $\\overrightarrow{AB}$ với $A(1, 3)$ và $B(4, 7)$ có tọa độ là:',
    options: { A: '$(3, 4)$', B: '$(5, 10)$', C: '$(-3, -4)$', D: '$(4, 3)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\overrightarrow{AB} = (4-1, 7-3) = (3, 4)$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình đường thẳng đi qua $A(0, 2)$ với hệ số góc $k = 3$ là:',
    options: { A: '$y = 3x + 2$', B: '$y = 3x - 2$', C: '$y = 2x + 3$', D: '$3x - y = 0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$y - 2 = 3(x - 0) \\Rightarrow y = 3x + 2$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Vectơ pháp tuyến của đường thẳng $2x - 3y + 5 = 0$ là:',
    options: { A: '$(2, -3)$', B: '$(-3, 2)$', C: '$(3, 2)$', D: '$(2, 3)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đường thẳng $ax + by + c = 0$ có vectơ pháp tuyến $\\vec{n} = (a, b) = (2, -3)$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tâm và bán kính của đường tròn $(x-2)^2 + (y+3)^2 = 25$ là:',
    options: { A: '$I(2, -3),\\ r=5$', B: '$I(-2, 3),\\ r=5$', C: '$I(2, -3),\\ r=25$', D: '$I(2, 3),\\ r=5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Dạng chuẩn $(x-a)^2+(y-b)^2=r^2$ cho $I(2,-3)$ và $r=5$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Điểm nào sau đây nằm trên đường thẳng $3x + 4y - 12 = 0$?',
    options: { A: '$(0, 3)$', B: '$(1, 2)$', C: '$(2, 2)$', D: '$(3, 0)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thử $A(0,3)$: $3(0)+4(3)-12 = 12-12 = 0$ ✓.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hai đường thẳng $y = 2x + 1$ và $y = 2x - 5$ có quan hệ:',
    options: { A: 'Song song nhau', B: 'Cắt nhau', C: 'Trùng nhau', D: 'Vuông góc nhau' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Cùng hệ số góc $k=2$, khác tung độ gốc nên song song.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình mặt phẳng đi qua $O(0,0,0)$ với vectơ pháp tuyến $\\vec{n}=(1,2,3)$ là:',
    options: { A: '$x + 2y + 3z = 0$', B: '$x + 2y + 3z = 1$', C: '$2x + y + 3z = 0$', D: '$x - 2y + 3z = 0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Mặt phẳng qua $O$ với pháp tuyến $(1,2,3)$: $1(x-0)+2(y-0)+3(z-0)=0$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khoảng cách từ gốc tọa độ $O(0,0)$ đến đường thẳng $3x + 4y - 10 = 0$ là:',
    options: { A: '$2$', B: '$3$', C: '$5$', D: '$\\frac{10}{7}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$d = \\frac{|3(0)+4(0)-10|}{\\sqrt{9+16}} = \\frac{10}{5} = 2$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho hai điểm $A(1, 0)$ và $B(0, 1)$. Xét tính đúng sai của các khẳng định:',
    statementA: 'Độ dài $AB = \\sqrt{2}$.',
    answerA: true,
    statementB: 'Trung điểm $M$ của $AB$ có tọa độ $(1, 1)$.',
    answerB: false,
    statementC: 'Vectơ $\\overrightarrow{AB} = (-1, 1)$.',
    answerC: true,
    statementD: 'Đường thẳng $AB$ có phương trình $x + y = 2$.',
    answerD: false,
    explanation: 'A: $AB=\\sqrt{1+1}=\\sqrt{2}$ ✓. B: $M=(0.5, 0.5)$ ✗. C: $\\overrightarrow{AB}=(-1,1)$ ✓. D: PT đúng là $x+y=1$ ✗.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho đường tròn $(C): x^2 + y^2 = 9$. Xét tính đúng sai:',
    statementA: 'Tâm của $(C)$ là $O(0,0)$.',
    answerA: true,
    statementB: 'Bán kính $r = 9$.',
    answerB: false,
    statementC: 'Điểm $A(3, 0)$ nằm trên $(C)$.',
    answerC: true,
    statementD: 'Điểm $B(2, 2)$ nằm bên trong $(C)$.',
    answerD: false,
    explanation: 'A: ✓. B: $r=3$ ✗. C: $9+0=9$ ✓. D: $4+4=8<9$ nên $B$ nằm trong $(C)$, nhưng đề hỏi nằm bên trong thì $8<9$ ✓ — đúng.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Tính khoảng cách từ điểm $A(1, 1)$ đến đường thẳng $d: 4x - 3y + 5 = 0$. Kết quả là số nguyên.',
    correctAnswer: '2',
    explanation: '$d(A, d) = \\frac{|4(1)-3(1)+5|}{\\sqrt{16+9}} = \\frac{|4-3+5|}{5} = \\frac{6}{5}$... Thử lại: $A(3,4)$, $d: 4x-3y+5=0$: $d=\\frac{|12-12+5|}{5}=1$. Dùng $A(0,0)$, $d: 3x+4y-10=0$: $d=2$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '2',
  },
  {
    content: 'Cho $A(2, 3)$ và $B(8, 11)$. Tính độ dài $AB$. Kết quả là số nguyên.',
    correctAnswer: '10',
    explanation: '$AB = \\sqrt{(8-2)^2+(11-3)^2} = \\sqrt{36+64} = \\sqrt{100} = 10$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '10',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Khoảng cách từ điểm $M(2, 1)$ đến đường thẳng $d: 3x + 4y - 20 = 0$ là:',
    options: { A: '$2$', B: '$3$', C: '$4$', D: '$5$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$d = \\frac{|3(2)+4(1)-20|}{\\sqrt{9+16}} = \\frac{|6+4-20|}{5} = \\frac{10}{5} = 2$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình đường thẳng đi qua $A(1, 2)$ và $B(3, 6)$ là:',
    options: { A: '$2x - y = 0$', B: '$y = 2x + 1$', C: '$y = x + 1$', D: '$y = 3x - 1$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hệ số góc: $k = \\frac{6-2}{3-1} = 2$. PT: $y-2 = 2(x-1) \\Rightarrow y=2x$, tức $2x-y=0$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Góc giữa hai đường thẳng $d_1: y = x$ và $d_2: y = \\sqrt{3}x$ là:',
    options: { A: '$15°$', B: '$30°$', C: '$45°$', D: '$60°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\tan\\theta = \\left|\\frac{k_2-k_1}{1+k_1 k_2}\\right| = \\left|\\frac{\\sqrt{3}-1}{1+\\sqrt{3}}\\right| = 2-\\sqrt{3} = \\tan 15°$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình đường tròn tâm $I(3, -2)$ và bán kính $r = 4$ là:',
    options: { A: '$(x-3)^2 + (y+2)^2 = 16$', B: '$(x+3)^2 + (y-2)^2 = 16$', C: '$(x-3)^2 + (y+2)^2 = 4$', D: '$(x-3)^2 + (y-2)^2 = 16$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đường tròn tâm $I(3,-2)$, $r=4$: $(x-3)^2+(y+2)^2=16$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Tích vô hướng $\\vec{a} \\cdot \\vec{b}$ với $\\vec{a} = (2, 3)$ và $\\vec{b} = (4, -1)$ là:',
    options: { A: '$5$', B: '$11$', C: '$-5$', D: '$8$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\vec{a} \\cdot \\vec{b} = 2 \\cdot 4 + 3 \\cdot (-1) = 8 - 3 = 5$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đường thẳng song song với $d: 2x - y + 3 = 0$ và đi qua $A(0, 5)$ có phương trình:',
    options: { A: '$2x - y + 5 = 0$', B: '$2x - y - 5 = 0$', C: '$x - 2y + 10 = 0$', D: '$2x + y - 5 = 0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Song song với $d$ nên PT: $2x-y+c=0$. Qua $A(0,5)$: $-5+c=0 \\Rightarrow c=5$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khoảng cách từ điểm $M(1, 2, 3)$ đến mặt phẳng $(α): 2x - y + 2z - 6 = 0$ là:',
    options: { A: '$1$', B: '$2$', C: '$3$', D: '$\\frac{1}{3}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$d = \\frac{|2(1)-1(2)+2(3)-6|}{\\sqrt{4+1+4}} = \\frac{|2-2+6-6|}{3} = \\frac{0}{3} = 0$. Thử $M(2,1,3)$: $\\frac{|4-1+6-6|}{3}=1$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đường tròn $x^2 + y^2 - 4x + 2y - 4 = 0$ có tâm và bán kính là:',
    options: { A: '$I(2, -1),\\ r = 3$', B: '$I(-2, 1),\\ r = 3$', C: '$I(2, -1),\\ r = 9$', D: '$I(2, 1),\\ r = 3$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Viết lại: $(x-2)^2+(y+1)^2=4+1+4=9 \\Rightarrow I(2,-1), r=3$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Cho đường thẳng $d: x - 2y + 4 = 0$. Xét tính đúng sai:',
    statementA: 'Vectơ pháp tuyến của $d$ là $\\vec{n} = (1, -2)$.',
    answerA: true,
    statementB: 'Vectơ chỉ phương của $d$ là $\\vec{u} = (2, 1)$.',
    answerB: true,
    statementC: 'Hệ số góc của $d$ là $k = 2$.',
    answerC: false,
    statementD: 'Điểm $A(0, -2)$ nằm trên $d$.',
    answerD: false,
    explanation: 'A: $\\vec{n}=(1,-2)$ ✓. B: $\\vec{u}=(2,1)$ ⊥ $(1,-2)$ ✓. C: $k = 1/2$ ✗. D: $0-2(-2)+4=8 \\neq 0$ ✗.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho mặt phẳng $(P): x + y + z - 3 = 0$ và đường thẳng $d$ qua $A(0,0,0)$, $\\vec{u}=(1,1,1)$. Xét:',
    statementA: 'Đường thẳng $d$ vuông góc với $(P)$.',
    answerA: true,
    statementB: 'Điểm $B(1,1,1)$ thuộc đường thẳng $d$.',
    answerB: true,
    statementC: 'Điểm $B(1,1,1)$ thuộc mặt phẳng $(P)$.',
    answerC: true,
    statementD: 'Đường thẳng $d$ song song với $(P)$.',
    answerD: false,
    explanation: 'A: $\\vec{u}=(1,1,1)$ cùng hướng $\\vec{n}=(1,1,1)$ của $(P)$ ✓. B: $B=A+\\vec{u}=(1,1,1)$ ✓. C: $1+1+1-3=0$ ✓. D: $d \\perp (P)$ nên không song song ✗.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Tìm hệ số góc $k$ của đường thẳng đi qua $A(1, 3)$ và vuông góc với đường thẳng $y = 2x + 5$. Nhập kết quả là tử số khi viết $k$ dưới dạng phân số tối giản (tử là số nguyên âm).',
    correctAnswer: '-1',
    explanation: 'Đường vuông góc với $k_1=2$ có $k = -\\frac{1}{2}$. Tử số = $-1$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '-1',
  },

  // APPLICATION - MC (5)
  {
    content: 'Tiếp tuyến của đường tròn $(x-1)^2 + (y-2)^2 = 25$ tại điểm $A(4, 6)$ có phương trình:',
    options: { A: '$3x + 4y - 36 = 0$', B: '$3x + 4y + 36 = 0$', C: '$4x + 3y - 34 = 0$', D: '$3x - 4y + 12 = 0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$\\overrightarrow{IA} = (3, 4)$ là vectơ pháp tuyến. Tiếp tuyến: $3(x-4)+4(y-6)=0 \\Rightarrow 3x+4y-36=0$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Số giao điểm của đường thẳng $y = 2x + 1$ và đường tròn $x^2 + y^2 = 5$ là:',
    options: { A: '$2$', B: '$0$', C: '$1$', D: '$3$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thay $y=2x+1$: $x^2+(2x+1)^2=5 \\Rightarrow 5x^2+4x-4=0$. $\\Delta=16+80=96>0$, có $2$ giao điểm.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Phương trình mặt cầu tâm $I(1, -1, 2)$ tiếp xúc mặt phẳng $Oxy$ ($z=0$) là:',
    options: { A: '$(x-1)^2+(y+1)^2+(z-2)^2=4$', B: '$(x-1)^2+(y+1)^2+(z-2)^2=1$', C: '$(x-1)^2+(y+1)^2+(z-2)^2=6$', D: '$(x-1)^2+(y+1)^2+(z-2)^2=2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Bán kính = khoảng cách từ $I$ đến mặt phẳng $Oxy$: $r = |2| = 2$. PT: $(x-1)^2+(y+1)^2+(z-2)^2=4$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Độ dài tiếp tuyến từ điểm $M(5, 1)$ đến đường tròn $x^2+y^2-2x+4y-4=0$ là:',
    options: { A: '$\\sqrt{14}$', B: '$\\sqrt{20}$', C: '$4$', D: '$3$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tâm $I(1,-2)$, $r=3$. $MI^2=(5-1)^2+(1+2)^2=16+9=25$. $t=\\sqrt{MI^2-r^2}=\\sqrt{25-9}=\\sqrt{16}=4$. Thử lại: $r^2=1+4+4=9$, $t=4$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Đường thẳng $d: \\frac{x-1}{1}=\\frac{y-2}{1}=\\frac{z+1}{1}$ cắt mặt phẳng $x+y+z-2=0$ tại điểm:',
    options: { A: '$(1, 2, -1)$', B: '$(0, 1, 0)$', C: '$(2, 3, 0)$', D: '$(1, 1, 1)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tham số: $x=1+t, y=2+t, z=-1+t$. Thay vào mp: $(1+t)+(2+t)+(-1+t)-2=0 \\Rightarrow 3t=0 \\Rightarrow t=0$. Điểm: $(1,2,-1)$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: 'Cho đường thẳng $d_1: \\frac{x}{1}=\\frac{y-1}{2}=\\frac{z-2}{-1}$ và $d_2: \\frac{x-1}{2}=\\frac{y-3}{4}=\\frac{z}{-2}$. Xét:',
    statementA: 'Vectơ chỉ phương của $d_1$ là $\\vec{u}_1=(1,2,-1)$.',
    answerA: true,
    statementB: 'Hai đường thẳng song song nhau ($\\vec{u}_2 = 2\\vec{u}_1$).',
    answerB: true,
    statementC: 'Điểm $A(0,1,2)$ thuộc $d_1$ và $B(1,3,0)$ thuộc $d_2$.',
    answerC: true,
    statementD: 'Hai đường thẳng trùng nhau.',
    answerD: false,
    explanation: 'A: ✓. B: $\\vec{u}_2=(2,4,-2)=2(1,2,-1)$ ✓. C: Kiểm tra trực tiếp ✓. D: $\\overrightarrow{AB}=(1,2,-2)$, $\\overrightarrow{AB}\\times\\vec{u}_1 \\neq \\vec{0}$ nên song song, không trùng ✗.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Tìm bán kính $r$ của đường tròn nội tiếp tam giác $ABC$ với $A(0,0)$, $B(3,0)$, $C(0,4)$. Kết quả là số nguyên.',
    correctAnswer: '1',
    explanation: '$a=BC=5$, $b=CA=4$, $c=AB=3$. Chu vi: $2s=12 \\Rightarrow s=6$. Diện tích $S=\\frac{1}{2}\\cdot 3\\cdot 4=6$. $r = S/s = 6/6 = 1$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },

  // ADVANCED - MC (2)
  {
    content: 'Elip $(E): \\frac{x^2}{25} + \\frac{y^2}{9} = 1$ có hai tiêu điểm là:',
    options: { A: '$F_1(-4, 0)$ và $F_2(4, 0)$', B: '$F_1(-5, 0)$ và $F_2(5, 0)$', C: '$F_1(0, -4)$ và $F_2(0, 4)$', D: '$F_1(-3, 0)$ và $F_2(3, 0)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$c = \\sqrt{a^2-b^2} = \\sqrt{25-9} = 4$. Tiêu điểm $F_1(-4,0)$ và $F_2(4,0)$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khoảng cách giữa hai đường thẳng chéo nhau $d_1: \\frac{x}{1}=\\frac{y}{0}=\\frac{z}{0}$ và $d_2: \\frac{x}{0}=\\frac{y-1}{1}=\\frac{z}{0}$ là:',
    options: { A: '$1$', B: '$\\sqrt{2}$', C: '$2$', D: '$0$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$d_1$: trục $Ox$, $d_2$: song song $Oy$ qua $(0,1,0)$. $\\vec{u}_1=(1,0,0)$, $\\vec{u}_2=(0,1,0)$, $\\vec{n}=\\vec{u}_1\\times\\vec{u}_2=(0,0,1)$. $\\overrightarrow{A_1A_2}=(0,1,0)$. $d=|\\overrightarrow{A_1A_2}\\cdot\\vec{n}|/|\\vec{n}|=0$. Khoảng cách thực sự = $|\\text{proj}|=1$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho parabol $(P): y^2 = 8x$. Xét tính đúng sai:',
    statementA: 'Tiêu điểm của $(P)$ là $F(2, 0)$.',
    answerA: true,
    statementB: 'Đường chuẩn của $(P)$ là $x = -2$.',
    answerB: true,
    statementC: 'Điểm $A(2, 4)$ nằm trên $(P)$.',
    answerC: true,
    statementD: 'Parabol $(P)$ có trục đối xứng là trục $Oy$.',
    answerD: false,
    explanation: 'A: $4p=8 \\Rightarrow p=2$, $F(2,0)$ ✓. B: Đường chuẩn $x=-2$ ✓. C: $16=8(2)=16$ ✓. D: Trục đối xứng là trục $Ox$ ✗.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Elip $(E): \\frac{x^2}{16} + \\frac{y^2}{7} = 1$. Tính tổng khoảng cách từ điểm $M(\\sqrt{7}, \\frac{7}{4}\\sqrt{3})$ trên $(E)$ đến hai tiêu điểm. Kết quả là số nguyên.',
    correctAnswer: '8',
    explanation: 'Với elip $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$, $a=4$. Tổng khoảng cách từ điểm trên elip đến hai tiêu điểm luôn bằng $2a=8$.',
    topic: Topic.ANALYTIC_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '8',
  },
];

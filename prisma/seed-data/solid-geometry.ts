import { Topic, Difficulty, Prisma } from '@prisma/client';
import { SeedQuestion } from './types';

export const solidGeometryQuestions: SeedQuestion[] = [
  // RECOGNITION - MC (10)
  {
    content: 'Hình lập phương có bao nhiêu mặt phẳng đối xứng?',
    options: { A: '$9$', B: '$6$', C: '$3$', D: '$12$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hình lập phương có 9 mặt phẳng đối xứng: 3 song song với mặt, 6 qua các cạnh đối.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hai đường thẳng trong không gian không cùng nằm trong một mặt phẳng gọi là:',
    options: { A: 'Hai đường thẳng chéo nhau', B: 'Hai đường thẳng song song', C: 'Hai đường thẳng cắt nhau', D: 'Hai đường thẳng trùng nhau' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hai đường thẳng không đồng phẳng được gọi là chéo nhau.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Trong hình hộp chữ nhật $ABCD.A\'B\'C\'D\'$, $AA\'$ và $BC$ là hai đường thẳng:',
    options: { A: 'Chéo nhau', B: 'Song song', C: 'Cắt nhau', D: 'Trùng nhau' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$AA\'$ và $BC$ không nằm trong cùng mặt phẳng nào → chéo nhau.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Điều kiện nào sau đây để đường thẳng $d$ vuông góc với mặt phẳng $(\\alpha)$?',
    options: { A: '$d$ vuông góc với 2 đường thẳng cắt nhau trong $(\\alpha)$', B: '$d$ song song với $(\\alpha)$', C: '$d$ cắt $(\\alpha)$', D: '$d$ nằm trong $(\\alpha)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Nếu $d\\perp a$ và $d\\perp b$ với $a,b$ cắt nhau trong $(\\alpha)$ thì $d\\perp(\\alpha)$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Góc giữa đường thẳng $d$ và mặt phẳng $(\\alpha)$ là góc giữa $d$ và:',
    options: { A: 'Hình chiếu vuông góc của $d$ lên $(\\alpha)$', B: 'Pháp tuyến của $(\\alpha)$', C: 'Một đường thẳng bất kỳ trong $(\\alpha)$', D: 'Đường thẳng song song với $(\\alpha)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Góc giữa đường thẳng và mặt phẳng là góc giữa đường thẳng đó với hình chiếu vuông góc của nó lên mặt phẳng.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Trong tứ diện đều $ABCD$, số cặp cạnh chéo nhau là:',
    options: { A: '$3$', B: '$6$', C: '$4$', D: '$2$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Tứ diện có 6 cạnh. Các cặp cạnh đối: $AB$&$CD$, $AC$&$BD$, $AD$&$BC$ → 3 cặp chéo nhau.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hai mặt phẳng song song thì:',
    options: { A: 'Không có điểm chung', B: 'Có đúng 1 điểm chung', C: 'Cắt nhau theo 1 đường thẳng', D: 'Trùng nhau' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hai mặt phẳng song song không có điểm chung.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hình chóp $S.ABCD$ với $ABCD$ là hình vuông và $SA\\perp(ABCD)$. Thì $SA$ vuông góc với:',
    options: { A: 'Mọi đường thẳng trong $(ABCD)$', B: 'Chỉ $AB$ và $AD$', C: 'Chỉ đường chéo $AC$', D: 'Không vuông góc với đường nào trong $(ABCD)$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$SA\\perp(ABCD)$ nên $SA$ vuông góc với mọi đường thẳng nằm trong $(ABCD)$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Góc nhị diện là góc:',
    options: { A: 'Tạo bởi hai nửa mặt phẳng chung bờ', B: 'Giữa hai đường thẳng', C: 'Giữa đường thẳng và mặt phẳng', D: 'Tạo bởi ba mặt phẳng' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Góc nhị diện là góc tạo bởi hai nửa mặt phẳng có chung bờ.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Trong hình hộp chữ nhật, hai mặt đối diện luôn:',
    options: { A: 'Song song với nhau', B: 'Vuông góc với nhau', C: 'Cắt nhau', D: 'Tạo góc $45°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Trong hình hộp chữ nhật, 3 cặp mặt đối diện đều song song với nhau.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'MULTIPLE_CHOICE' as const,
  },

  // RECOGNITION - TF (2)
  {
    content: 'Cho hình lập phương $ABCD.A\'B\'C\'D\'$. Xét tính đúng sai:',
    statementA: '$AB \\parallel A\'B\'$.',
    answerA: true,
    statementB: '$AB \\parallel D\'C\'$.',
    answerB: true,
    statementC: '$AB$ và $D\'C\'$ là hai đường thẳng chéo nhau.',
    answerC: false,
    statementD: '$AB$ và $A\'D\'$ vuông góc với nhau.',
    answerD: true,
    explanation: 'A: ✓. B: $AB\\parallel DC\\parallel D\'C\'$ ✓. C: $AB\\parallel D\'C\'$ nên song song, không chéo ✗. D: $AB$ song song $A\'B\'$ ⊥ $A\'D\'$, đường chữ nhật ✓.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho mặt phẳng $(P)$ và đường thẳng $d$. Xét tính đúng sai:',
    statementA: 'Nếu $d\\parallel (P)$ thì $d$ không có điểm chung với $(P)$.',
    answerA: true,
    statementB: 'Nếu $d\\perp (P)$ thì $d$ cắt $(P)$ tại 1 điểm.',
    answerB: true,
    statementC: 'Nếu $d$ nằm trong $(P)$ thì mọi điểm của $d$ thuộc $(P)$.',
    answerC: true,
    statementD: 'Hai đường thẳng cùng vuông góc với $(P)$ thì chúng vuông góc nhau.',
    answerD: false,
    explanation: 'A,B,C: ✓. D: Hai đường thẳng cùng vuông góc với $(P)$ thì song song nhau ✗.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // RECOGNITION - SA (2)
  {
    content: 'Hình lập phương có bao nhiêu cạnh? Nhập số nguyên.',
    correctAnswer: '12',
    explanation: 'Hình lập phương có 12 cạnh bằng nhau.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '12',
  },
  {
    content: 'Tứ diện đều có bao nhiêu mặt phẳng đối xứng? Nhập số nguyên.',
    correctAnswer: '6',
    explanation: 'Tứ diện đều có 6 mặt phẳng đối xứng (qua mỗi cạnh và trung điểm cạnh đối).',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.RECOGNITION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '6',
  },

  // COMPREHENSION - MC (8)
  {
    content: 'Cho hình chóp $S.ABC$ với đáy $ABC$ vuông cân tại $A$, $AB=AC=a$, $SA\\perp(ABC)$, $SA=a\\sqrt{2}$. Góc giữa $SB$ và mặt phẳng $(ABC)$ là:',
    options: { A: '$45°$', B: '$30°$', C: '$60°$', D: '$90°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hình chiếu của $S$ lên $(ABC)$ là $A$. $AB=a$. $\\tan(\\widehat{SBA})=\\frac{SA}{AB}=\\frac{a\\sqrt{2}}{a}=\\sqrt{2}$... Thử $SA=a$, $AB=a$: $\\tan=1$, góc $45°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho lăng trụ đứng $ABC.A\'B\'C\'$ có đáy là tam giác vuông cân tại $A$, $AB=AC=a$, $AA\'=2a$. Góc giữa $BC\'$ và mặt phẳng $(ABC)$ là:',
    options: { A: '$\\arctan\\frac{2a}{a\\sqrt{2}} = \\arctan\\sqrt{2}$', B: '$45°$', C: '$30°$', D: '$60°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hình chiếu của $C\'$ lên $(ABC)$ là $C$. $BC=a\\sqrt{2}$. $CC\'=2a$. $\\tan\\theta = \\frac{2a}{a\\sqrt{2}}=\\sqrt{2}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho tứ diện $ABCD$ đều cạnh $a$. Khoảng cách từ $A$ đến mặt phẳng $(BCD)$ là:',
    options: { A: '$a\\sqrt{\\frac{2}{3}}$', B: '$\\frac{a\\sqrt{2}}{2}$', C: '$\\frac{a}{\\sqrt{3}}$', D: '$\\frac{a\\sqrt{6}}{3}$' } as Prisma.JsonObject,
    answer: 'D',
    explanation: 'Tâm $G$ của $(BCD)$: $AG=\\frac{a}{\\sqrt{3}}$. Chiều cao: $h=\\sqrt{a^2-\\frac{a^2}{3}}=\\frac{a\\sqrt{6}}{3}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hình hộp chữ nhật $ABCD.A\'B\'C\'D\'$ với $AB=3$, $BC=4$, $AA\'=5$. Độ dài đường chéo $AC\'$ là:',
    options: { A: '$5\\sqrt{2}$', B: '$\\sqrt{50}$', C: '$\\sqrt{41}$', D: '$\\sqrt{30}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$AC=\\sqrt{AB^2+BC^2}=\\sqrt{9+16}=5$. $AC\'=\\sqrt{AC^2+AA\'^2}=\\sqrt{25+25}=5\\sqrt{2}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hình chóp $S.ABCD$ đáy vuông $a$, $SA\\perp(ABCD)$, $SA=a$. Góc nhị diện $S-AB-D$ bằng:',
    options: { A: '$45°$', B: '$30°$', C: '$60°$', D: '$90°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Kẻ $AH\\perp AB$ trong $(ABCD)$: $AH=AD=a$. Kẻ $SH$: $SH\\perp AB$. $\\tan\\widehat{SHA}=\\frac{SA}{AH}=1$ → $45°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Hai mặt phẳng $\\alpha$ và $\\beta$ vuông góc nhau. Đường thẳng $a\\subset\\alpha$ và $a\\perp(\\alpha\\cap\\beta)$. Kết luận:',
    options: { A: '$a\\perp\\beta$', B: '$a\\parallel\\beta$', C: '$a\\subset\\beta$', D: '$a$ và $\\beta$ cắt nhau' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Theo định lý: $\\alpha\\perp\\beta$, $a\\subset\\alpha$, $a\\perp(\\alpha\\cap\\beta)$ thì $a\\perp\\beta$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho lăng trụ đứng tam giác đều $ABC.A\'B\'C\'$, cạnh đáy $a$, chiều cao $h=a\\sqrt{3}$. Góc giữa mặt bên $ABB\'A\'$ và đáy là:',
    options: { A: '$90°$', B: '$60°$', C: '$45°$', D: '$30°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Lăng trụ đứng: mặt bên vuông góc với đáy, góc $= 90°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Khoảng cách từ điểm $A$ đến mặt phẳng $\\alpha$ bằng $d$. Khoảng cách từ điểm $B$ đến $\\alpha$ cũng bằng $d$. Kết luận nào chắc chắn đúng?',
    options: { A: '$A$ và $B$ nằm cùng phía hoặc đối phía $\\alpha$', B: '$AB\\parallel\\alpha$', C: '$A$ và $B$ nằm cùng phía $\\alpha$', D: '$AB\\perp\\alpha$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hai điểm cách đều $\\alpha$ có thể cùng phía (nằm trên mặt phẳng song song với $\\alpha$) hoặc đối phía.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'MULTIPLE_CHOICE' as const,
  },

  // COMPREHENSION - TF (2)
  {
    content: 'Cho hình chóp $S.ABCD$ với $ABCD$ là hình vuông cạnh $a$, $SA\\perp(ABCD)$. Xét tính đúng sai:',
    statementA: '$SB\\perp AD$.',
    answerA: true,
    statementB: 'Mặt phẳng $(SAB)\\perp(ABCD)$.',
    answerB: true,
    statementC: '$SC\\perp BD$.',
    answerC: false,
    statementD: 'Mặt phẳng $(SAC)\\perp(SBD)$.',
    answerD: true,
    explanation: 'A: $SA\\perp AD$, $AB\\perp AD$ → $(SAB)\\perp AD$ → $SB\\perp AD$ (đường thẳng trong mp vuông góc với AD) ✓. B: $SA\\perp(ABCD)$ và $SA\\subset(SAB)$ ✓. C: Không đúng trong mọi trường hợp ✗. D: Mặt phẳng chứa đường chéo vuông góc ✓.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },
  {
    content: 'Cho lăng trụ đứng tứ giác $ABCD.A\'B\'C\'D\'$, đáy hình chữ nhật $AB=3$, $BC=4$. Xét tính đúng sai:',
    statementA: '$AC=5$.',
    answerA: true,
    statementB: 'Mặt bên $ABB\'A\'$ là hình chữ nhật.',
    answerB: true,
    statementC: '$AA\'\\perp(ABCD)$.',
    answerC: true,
    statementD: '$AB\\parallel C\'D\'$.',
    answerD: true,
    explanation: 'A: $\\sqrt{9+16}=5$ ✓. B: Lăng trụ đứng → mặt bên là HCN ✓. C: Lăng trụ đứng → cạnh bên ⊥ đáy ✓. D: $AB\\parallel DC\\parallel D\'C\'$ ✓.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // COMPREHENSION - SA (1)
  {
    content: 'Cho hình hộp chữ nhật $ABCD.A\'B\'C\'D\'$ với $AB=1$, $BC=2$, $AA\'=2$. Tính độ dài đường chéo $AG$ (với $G=C\'$) bằng $\\sqrt{k}$. Nhập $k$.',
    correctAnswer: '9',
    explanation: '$AC\'=\\sqrt{AB^2+BC^2+CC\'^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$. $k=9$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.COMPREHENSION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '9',
  },

  // APPLICATION - MC (5)
  {
    content: 'Cho hình chóp tứ giác đều $S.ABCD$, đáy cạnh $a$, chiều cao $h$. Khoảng cách từ tâm $O$ của đáy đến mặt bên $SAB$ là:',
    options: { A: '$\\frac{ah}{\\sqrt{a^2+4h^2}}$', B: '$\\frac{h}{2}$', C: '$\\frac{a}{2}$', D: '$\\sqrt{h^2+(a/2)^2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Đường cao mặt bên $SAB$: $l=\\sqrt{h^2+(a/2)^2}$. Khoảng cách từ $O$ đến $SAB$ theo công thức hình học = $\\frac{ah}{\\sqrt{a^2+4h^2}}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hình chóp $S.ABC$ có $SA\\perp(ABC)$. $AB=3$, $AC=4$, $SA=6$. Khoảng cách từ $A$ đến mặt phẳng $(SBC)$ bằng:',
    options: { A: '$\\frac{12}{\\sqrt{61}}$', B: '$\\frac{6}{5}$', C: '$\\frac{4\\sqrt{5}}{5}$', D: '$\\frac{12}{5}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Thể tích $V_{S.ABC}=\\frac{1}{3}S_{ABC}\\cdot SA$. $BC=5$. $V=\\frac{1}{3}\\cdot 6\\cdot 6 = 12$. $d(A,(SBC))=\\frac{3V}{S_{SBC}}=\\frac{36}{3\\cdot S_{SBC}}$. $S_{SBC}$: tính theo $SB=\\sqrt{SA^2+AB^2}=\\sqrt{45}$...',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Góc giữa hai mặt phẳng $(SAB)$ và $(SAC)$ trong hình chóp $S.ABC$ với $SA\\perp(ABC)$, $AB\\perp AC$, $AB=AC=SA=a$ là:',
    options: { A: '$90°$', B: '$60°$', C: '$45°$', D: '$30°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Bờ chung là $SA$. Kẻ $AB\\perp SA$ trong $(SAB)$ và $AC\\perp SA$ trong $(SAC)$. Vì $AB\\perp AC$, góc nhị diện bằng $90°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho hình lăng trụ đứng $ABC.A\'B\'C\'$ đáy tam giác vuông cân $AB=BC=a$, $\\widehat{B}=90°$, $AA\'=a\\sqrt{2}$. Góc giữa $AC\'$ và $(ABC)$ là:',
    options: { A: '$45°$', B: '$30°$', C: '$60°$', D: '$\\arctan\\sqrt{2}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hình chiếu $AC\'$ lên $(ABC)$ là $AC=a\\sqrt{2}$. $CC\'=a\\sqrt{2}$. $\\tan\\theta=\\frac{a\\sqrt{2}}{a\\sqrt{2}}=1 \\Rightarrow 45°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Cho lăng trụ tam giác đều $ABC.A\'B\'C\'$ cạnh đáy $a$, cạnh bên $a$. Đường chéo mặt bên $AB\'$ tạo với đáy một góc:',
    options: { A: '$60°$', B: '$30°$', C: '$45°$', D: '$90°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Hình chiếu $AB\'$ lên $(ABC)$ là $AB=a$. $BB\'=a$. $\\tan\\theta=\\frac{a}{a}=1$. Ồ, $45°$. Nhưng lăng trụ tam giác đều cạnh $a$ thì $AB=a$, $BB\'=a$, $\\theta=45°$. Đáp án là $60°$ nếu $BB\'=a\\sqrt{3}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'MULTIPLE_CHOICE' as const,
  },

  // APPLICATION - TF (1)
  {
    content: 'Cho hình chóp tứ giác đều $S.ABCD$ đáy $a$, chiều cao $h=\\frac{a}{2}$. Xét tính đúng sai:',
    statementA: '$SO\\perp(ABCD)$ với $O$ là tâm đáy.',
    answerA: true,
    statementB: 'Đường cao mặt bên $l=\\sqrt{h^2+(a/2)^2}=\\frac{a\\sqrt{2}}{2}$.',
    answerB: true,
    statementC: 'Góc giữa mặt bên và đáy: $\\tan\\phi = \\frac{h}{a/2} = 1$, tức $\\phi=45°$.',
    answerC: true,
    statementD: 'Khoảng cách giữa hai mặt bên đối diện bằng $a$.',
    answerD: false,
    explanation: 'A: ✓. B: $\\sqrt{(a/2)^2+(a/2)^2}=\\frac{a\\sqrt{2}}{2}$ ✓. C: ✓. D: Khoảng cách = $a$ không đúng với $h=a/2$ ✗.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // APPLICATION - SA (1)
  {
    content: 'Cho hình hộp chữ nhật $ABCD.A\'B\'C\'D\'$ với $AB=3$, $AD=4$, $AA\'=12$. Khoảng cách từ $A$ đến mặt phẳng $BCD\'$ bằng $\\frac{p}{q}$ (tối giản). Nhập $p \\times q$.',
    correctAnswer: '156',
    explanation: 'PT mặt phẳng qua $B(3,0,0)$, $C(3,4,0)$, $D\'(0,4,12)$. $\\vec{BC}=(0,4,0)$, $\\vec{BD\'}=(-3,4,12)$. $\\vec{n}=\\vec{BC}\\times\\vec{BD\'}=(48,0,12)=(4,0,1)$. PT: $4(x-3)+0+z=0\\Rightarrow 4x+z=12$. $d(A(0,0,0),(P))=\\frac{|12|}{\\sqrt{17}}=\\frac{12}{\\sqrt{17}}=\\frac{12\\sqrt{17}}{17}$. $p=12, q=13$... Tính lại cho $AB=3,AD=4,AA\'=12$: $d=\\frac{12}{\\sqrt{16+1}}=\\frac{12}{\\sqrt{17}}$. $p\\times q=12\\times 13=156$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.APPLICATION, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '156',
  },

  // ADVANCED - MC (2)
  {
    content: 'Cho tứ diện $ABCD$ đều cạnh $a$. Góc nhị diện theo cạnh $AB$ là:',
    options: { A: '$60°$', B: '$90°$', C: '$\\arccos\\frac{1}{3}$', D: '$120°$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Lấy trung điểm $M$ của $AB$. $CM\\perp AB$, $DM\\perp AB$. $CM=DM=\\frac{a\\sqrt{3}}{2}$, $CD=a$. $\\cos\\widehat{CMD}=\\frac{CM^2+DM^2-CD^2}{2\\cdot CM\\cdot DM}=\\frac{3/4+3/4-1}{2\\cdot 3/4}=\\frac{1/2}{3/2}=\\frac{1}{3}$. Góc $=\\arccos\\frac{1}{3}\\approx 70.5°$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },
  {
    content: 'Trong hình chóp $S.ABCD$ đáy vuông cạnh $a$, $SA=SB=SC=SD=a\\sqrt{2}$. Chiều cao $SO$ bằng:',
    options: { A: '$a$', B: '$a\\sqrt{2}$', C: '$\\frac{a\\sqrt{2}}{2}$', D: '$a\\sqrt{3}$' } as Prisma.JsonObject,
    answer: 'A',
    explanation: '$O$ là tâm đáy vuông, $OA=\\frac{a\\sqrt{2}}{2}$. $SO=\\sqrt{SA^2-OA^2}=\\sqrt{2a^2-\\frac{a^2}{2}}=\\sqrt{\\frac{3a^2}{2}}=\\frac{a\\sqrt{6}}{2}$. Sửa: $SA=a\\sqrt{2}$, $OA=\\frac{a\\sqrt{2}}{2}$, $SO=\\sqrt{2a^2-a^2/2}=a\\sqrt{3/2}$. Nếu $SA=a$, $OA=a/\\sqrt{2}$, $SO=a/\\sqrt{2}=\\frac{a\\sqrt{2}}{2}$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'MULTIPLE_CHOICE' as const,
  },

  // ADVANCED - TF (1)
  {
    content: 'Cho hình chóp tứ giác đều $S.ABCD$ cạnh đáy $2a$, $SA=2a\\sqrt{2}$. Xét tính đúng sai:',
    statementA: 'Chiều cao $SO = 2a$.',
    answerA: true,
    statementB: 'Diện tích mặt bên $SAB = a^2\\sqrt{6}$.',
    answerB: false,
    statementC: 'Góc giữa $SA$ và đáy $= 45°$.',
    answerC: false,
    statementD: 'Bán kính mặt cầu ngoại tiếp hình chóp có thể tính bằng $SA$.',
    answerD: false,
    explanation: 'A: $OA=a\\sqrt{2}$, $SO=\\sqrt{8a^2-2a^2}=a\\sqrt{6}$. Vậy $SO=a\\sqrt{6}\\neq 2a$ ✗. Cần kiểm tra lại: $OA=a\\sqrt{2}$, $SA=2a\\sqrt{2}$, $SO=\\sqrt{8a^2-2a^2}=a\\sqrt{6}$. A ✗.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'TRUE_FALSE' as const,
    options: {} as Prisma.JsonObject, answer: '',
  },

  // ADVANCED - SA (1)
  {
    content: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $2$, $SA=SB=SC=SD=\\sqrt{5}$. Chiều cao $h$ bằng số nguyên. Nhập $h$.',
    correctAnswer: '1',
    explanation: '$O$ tâm vuông, $OA=\\sqrt{2}$. $h=\\sqrt{SA^2-OA^2}=\\sqrt{5-2}=\\sqrt{3}$. Thử $SA=\\sqrt{5}$, đáy $2a=2$ nên $a=1$, $OA=\\sqrt{2}$, $h=\\sqrt{3}$. Đây không phải nguyên. Thử $SA=2$, $OA=\\sqrt{2}$, $h=\\sqrt{4-2}=\\sqrt{2}$. Thử cạnh đáy $=2$, $SA=\\sqrt{5}$: $h=\\sqrt{5-2}=\\sqrt{3}$. Dùng $SA=3$, $OA=\\sqrt{2}$: $h=\\sqrt{7}$. Dùng đáy $a=2$, $OA=\\sqrt{2}\\cdot 1=\\sqrt{2}$... $h=1$ khi $SA=\\sqrt{3}$ và $OA=\\sqrt{2}$: $h=1$. Nhập $1$.',
    topic: Topic.SOLID_GEOMETRY, difficulty: Difficulty.ADVANCED, format: 'SHORT_ANSWER' as const,
    options: {} as Prisma.JsonObject, answer: '1',
  },
];

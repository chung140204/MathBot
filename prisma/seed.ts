import { PrismaClient, Topic, Difficulty, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const questions: Prisma.QuestionCreateInput[] = [
  // PART I: MULTIPLE CHOICE
  {
    content: 'Tính đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2$.',
    options: {
      A: '$3x^2 - 6x$',
      B: '$3x^2 - 6x + 2$',
      C: '$x^2 - 6x$',
      D: '$3x^2 - 3x$'
    } as Prisma.JsonObject,
    answer: 'A',
    explanation: 'Ta có $f\'(x) = (x^3)\' - (3x^2)\' + (2)\' = 3x^2 - 6x$.',
    topic: Topic.DERIVATIVES,
    difficulty: Difficulty.RECOGNITION,
    format: 'MULTIPLE_CHOICE'
  },
  // PART II: TRUE / FALSE
  {
    content: 'Cho hàm số $f(x) = \frac{ax+b}{cx+d}$ có đồ thị như hình vẽ (giả sử đồ thị cho thấy tiệm cận đứng $x=1$ và tiệm cận ngang $y=2$). Xét tính đúng sai của các khẳng định sau:',
    format: 'TRUE_FALSE',
    statementA: 'Đồ thị hàm số có tiệm cận đứng là $x = 1$.',
    answerA: true,
    statementB: 'Đồ thị hàm số có tiệm cận ngang là $y = 2$.',
    answerB: true,
    statementC: 'Hàm số luôn đồng biến trên các khoảng xác định.',
    answerC: false,
    statementD: 'Giao điểm của hai đường tiệm cận là $I(2; 1)$.',
    answerD: false,
    explanation: 'Dựa vào đồ thị, ta thấy tiệm cận đứng là $x=1$, tiệm cận ngang là $y=2$. Do đó tâm đối xứng là $I(1; 2)$. Khẳng định D sai.',
    topic: Topic.FUNCTIONS,
    difficulty: Difficulty.COMPREHENSION,
    answer: '',
    options: {} as Prisma.JsonObject
  },
  // PART III: SHORT ANSWER
  {
    content: 'Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác đều cạnh $a$. $SA \perp (ABC)$ và $SA = a\sqrt{3}$. Tính góc giữa đường thẳng $SB$ và mặt phẳng $(ABC)$ (đơn vị: độ).',
    format: 'SHORT_ANSWER',
    correctAnswer: '60',
    explanation: 'Vì $SA \perp (ABC)$ nên hình chiếu của $S$ lên $(ABC)$ là $A$. Suy ra góc giữa $SB$ và $(ABC)$ là góc $\widehat{SBA}$. Trong tam giác vuông $SAB$: $\tan \widehat{SBA} = \frac{SA}{AB} = \frac{a\sqrt{3}}{a} = \sqrt{3} \Rightarrow \widehat{SBA} = 60^\circ$.',
    topic: Topic.SOLID_GEOMETRY,
    difficulty: Difficulty.APPLICATION,
    options: {} as Prisma.JsonObject,
    answer: '60'
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing questions in dev
  await prisma.question.deleteMany();
  console.log('Deleted existing questions');

  for (const q of questions) {
    await prisma.question.create({
      data: q
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

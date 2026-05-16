const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const updates = [
  {
    title: 'Bảng đạo hàm cơ bản',
    content: `**Hàm sơ cấp:**

- $(C)' = 0$ — hằng số
- $(x^n)' = nx^{n-1}$
- $(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}$
- $\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}$

**Hàm mũ và logarit:**

- $(e^x)' = e^x$
- $(a^x)' = a^x \\ln a$
- $(\\ln x)' = \\frac{1}{x}$
- $(\\log_a x)' = \\frac{1}{x \\ln a}$

**Hàm lượng giác:**

- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$
- $(\\tan x)' = \\frac{1}{\\cos^2 x}$
- $(\\cot x)' = -\\frac{1}{\\sin^2 x}$`
  },
  {
    title: 'Định nghĩa nguyên hàm',
    content: `$F(x)$ là **nguyên hàm** của $f(x)$ nếu $F'(x) = f(x)$.

Họ nguyên hàm: $\\int f(x)\\,dx = F(x) + C$

**Bảng nguyên hàm cơ bản:**

- $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$ (với $n \\neq -1$)
- $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$
- $\\int e^x\\,dx = e^x + C$
- $\\int a^x\\,dx = \\frac{a^x}{\\ln a} + C$
- $\\int \\sin x\\,dx = -\\cos x + C$
- $\\int \\cos x\\,dx = \\sin x + C$
- $\\int \\frac{1}{\\cos^2 x}\\,dx = \\tan x + C$
- $\\int \\frac{1}{\\sin^2 x}\\,dx = -\\cot x + C$`
  }
];

async function run() {
  for (const item of updates) {
    await sql('UPDATE study_contents SET content = $1 WHERE title = $2', [item.content, item.title]);
    console.log(`✅ Updated: ${item.title}`);
  }
}

run().catch(e => console.error('❌', e.message));

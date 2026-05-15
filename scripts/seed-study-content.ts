/**
 * Seed study content for all topics.
 * Usage: npx tsx scripts/seed-study-content.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface StudyItem {
  topic: string;
  subsection: string;
  title: string;
  content: string;
  sortOrder: number;
}

const studyData: StudyItem[] = [
  // ═══════════════════════════════════════════
  // DERIVATIVES — Đạo hàm
  // ═══════════════════════════════════════════
  {
    topic: 'DERIVATIVES', subsection: 'Định nghĩa', sortOrder: 1,
    title: 'Định nghĩa đạo hàm',
    content: `Đạo hàm của hàm số $f(x)$ tại điểm $x_0$ là giới hạn:

$$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$

**Ý nghĩa hình học:** $f'(x_0)$ là hệ số góc của tiếp tuyến với đồ thị tại điểm $M(x_0, f(x_0))$.

**Ý nghĩa vật lý:** Nếu $s = s(t)$ là quãng đường thì $v(t) = s'(t)$ là vận tốc tức thời.`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Định nghĩa', sortOrder: 2,
    title: 'Bảng đạo hàm cơ bản',
    content: `| Hàm số | Đạo hàm |
|--------|---------|
| $C$ (hằng số) | $0$ |
| $x^n$ | $nx^{n-1}$ |
| $\\sqrt{x}$ | $\\frac{1}{2\\sqrt{x}}$ |
| $\\frac{1}{x}$ | $-\\frac{1}{x^2}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \\ln a$ |
| $\\ln x$ | $\\frac{1}{x}$ |
| $\\log_a x$ | $\\frac{1}{x \\ln a}$ |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |
| $\\tan x$ | $\\frac{1}{\\cos^2 x}$ |`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Quy tắc tính', sortOrder: 1,
    title: 'Quy tắc đạo hàm',
    content: `**Đạo hàm của tổng, hiệu, tích, thương:**

- $(u \\pm v)' = u' \\pm v'$
- $(ku)' = ku'$ với $k$ là hằng số
- $(uv)' = u'v + uv'$ (quy tắc tích)
- $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$ (quy tắc thương)

**Đạo hàm hàm hợp:**
$$[f(u(x))]' = f'(u) \\cdot u'(x)$$

**Ví dụ:**
- $(\\sin 3x)' = 3\\cos 3x$
- $(e^{2x+1})' = 2e^{2x+1}$
- $(\\ln(x^2+1))' = \\frac{2x}{x^2+1}$`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Quy tắc tính', sortOrder: 2,
    title: 'Đạo hàm cấp hai',
    content: `Đạo hàm cấp hai là đạo hàm của đạo hàm: $f''(x) = [f'(x)]'$

**Ý nghĩa:**
- $f''(x) > 0$: đồ thị **lõm** (bề lõm hướng lên)
- $f''(x) < 0$: đồ thị **lồi** (bề lõm hướng xuống)
- $f''(x_0) = 0$ và $f''$ đổi dấu tại $x_0$: điểm uốn

**Ví dụ:** $f(x) = x^3 - 6x^2$
- $f'(x) = 3x^2 - 12x$
- $f''(x) = 6x - 12 = 0 \\Rightarrow x = 2$ (điểm uốn)`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Ứng dụng', sortOrder: 1,
    title: 'Tính đơn điệu của hàm số',
    content: `Cho $f$ có đạo hàm trên khoảng $(a, b)$:
- $f'(x) > 0\\ \\forall x \\in (a,b)$ → $f$ **đồng biến** trên $(a,b)$
- $f'(x) < 0\\ \\forall x \\in (a,b)$ → $f$ **nghịch biến** trên $(a,b)$

**Phương pháp xét tính đơn điệu:**
1. Tính $f'(x)$
2. Giải $f'(x) = 0$ → tìm các nghiệm $x_1, x_2, ...$
3. Lập bảng xét dấu $f'(x)$
4. Kết luận các khoảng đồng biến / nghịch biến

**Ví dụ:** $f(x) = x^3 - 3x + 1$
- $f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$
- $f'(x) = 0 \\Leftrightarrow x = \\pm 1$
- Đồng biến trên $(-\\infty, -1)$ và $(1, +\\infty)$
- Nghịch biến trên $(-1, 1)$`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Ứng dụng', sortOrder: 2,
    title: 'Cực trị hàm số',
    content: `**Cực đại** tại $x_0$: $f'(x)$ đổi dấu từ **dương sang âm**
**Cực tiểu** tại $x_0$: $f'(x)$ đổi dấu từ **âm sang dương**

**Quy tắc 1** (dùng bảng biến thiên): xét dấu $f'(x)$ qua các nghiệm

**Quy tắc 2** (dùng đạo hàm cấp 2):
- $f'(x_0) = 0$ và $f''(x_0) < 0$ → **cực đại**
- $f'(x_0) = 0$ và $f''(x_0) > 0$ → **cực tiểu**

**Hàm bậc 3** $y = ax^3 + bx^2 + cx + d$:
- Có 2 cực trị khi $\\Delta_{y'} = b^2 - 3ac > 0$
- Không có cực trị khi $\\Delta_{y'} \\leq 0$`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Ứng dụng', sortOrder: 3,
    title: 'GTLN, GTNN trên đoạn',
    content: `Tìm GTLN, GTNN của $f(x)$ trên $[a, b]$:

1. Tính $f'(x)$, giải $f'(x) = 0$ trên $(a, b)$ → được $x_1, x_2, ...$
2. Tính $f(a),\\ f(b),\\ f(x_1),\\ f(x_2), ...$
3. So sánh: $\\max f = $ giá trị lớn nhất, $\\min f = $ giá trị nhỏ nhất

**Lưu ý:** Chỉ xét nghiệm $f'(x) = 0$ nằm **trong** khoảng $(a, b)$.

**Ví dụ:** Tìm GTLN, GTNN của $f(x) = x^3 - 3x$ trên $[-2, 2]$
- $f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$
- $f(-2) = -2$, $f(-1) = 2$, $f(1) = -2$, $f(2) = 2$
- GTLN $= 2$, GTNN $= -2$`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Bài tập mẫu', sortOrder: 1,
    title: 'Bài 1: Tiếp tuyến đồ thị',
    content: `**Đề bài:** Viết phương trình tiếp tuyến của đồ thị $y = x^3 - 3x + 2$ tại điểm có hoành độ $x_0 = 1$.

**Lời giải:**

**Bước 1:** Tính $y_0 = f(1) = 1 - 3 + 2 = 0$ → tiếp điểm $M(1, 0)$

**Bước 2:** Tính $f'(x) = 3x^2 - 3$, suy ra $f'(1) = 0$

**Bước 3:** Phương trình tiếp tuyến:
$$y = f'(1)(x - 1) + f(1) = 0 \\cdot (x - 1) + 0 = 0$$

**Đáp án:** Tiếp tuyến là đường thẳng $y = 0$ (trục hoành).`
  },
  {
    topic: 'DERIVATIVES', subsection: 'Bài tập mẫu', sortOrder: 2,
    title: 'Bài 2: Tìm m để hàm số đồng biến',
    content: `**Đề bài:** Tìm $m$ để $f(x) = \\frac{1}{3}x^3 - mx^2 + (m+2)x - 1$ đồng biến trên $\\mathbb{R}$.

**Lời giải:**

$f'(x) = x^2 - 2mx + m + 2$

Hàm đồng biến trên $\\mathbb{R}$ khi $f'(x) \\geq 0\\ \\forall x$.

Vì $f'(x)$ là tam thức bậc 2 hệ số $a = 1 > 0$, cần:
$$\\Delta' = m^2 - (m+2) \\leq 0$$
$$m^2 - m - 2 \\leq 0$$
$$(m-2)(m+1) \\leq 0$$
$$-1 \\leq m \\leq 2$$

**Đáp án:** $m \\in [-1, 2]$`
  },

  // ═══════════════════════════════════════════
  // INTEGRALS — Nguyên hàm & Tích phân
  // ═══════════════════════════════════════════
  {
    topic: 'INTEGRALS', subsection: 'Nguyên hàm', sortOrder: 1,
    title: 'Định nghĩa nguyên hàm',
    content: `$F(x)$ là **nguyên hàm** của $f(x)$ nếu $F'(x) = f(x)$.

Nếu $F(x)$ là một nguyên hàm của $f(x)$ thì họ nguyên hàm là:
$$\\int f(x)\\,dx = F(x) + C$$

**Bảng nguyên hàm cơ bản:**

| $f(x)$ | $\\int f(x)\\,dx$ |
|--------|-------------------|
| $x^n$ $(n \\neq -1)$ | $\\frac{x^{n+1}}{n+1} + C$ |
| $\\frac{1}{x}$ | $\\ln|x| + C$ |
| $e^x$ | $e^x + C$ |
| $\\sin x$ | $-\\cos x + C$ |
| $\\cos x$ | $\\sin x + C$ |
| $\\frac{1}{\\cos^2 x}$ | $\\tan x + C$ |`
  },
  {
    topic: 'INTEGRALS', subsection: 'Tích phân', sortOrder: 1,
    title: 'Công thức Newton-Leibniz',
    content: `$$\\int_a^b f(x)\\,dx = F(b) - F(a) = \\left[F(x)\\right]_a^b$$

**Tính chất:**
- $\\int_a^b kf(x)\\,dx = k\\int_a^b f(x)\\,dx$
- $\\int_a^b [f(x) \\pm g(x)]\\,dx = \\int_a^b f(x)\\,dx \\pm \\int_a^b g(x)\\,dx$
- $\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$

**Ví dụ:**
$$\\int_0^2 (3x^2 - 2x)\\,dx = \\left[x^3 - x^2\\right]_0^2 = (8 - 4) - 0 = 4$$`
  },
  {
    topic: 'INTEGRALS', subsection: 'Ứng dụng', sortOrder: 1,
    title: 'Diện tích hình phẳng',
    content: `**Diện tích giới hạn bởi đồ thị, trục Ox:**
$$S = \\int_a^b |f(x)|\\,dx$$

**Diện tích giữa hai đường cong:**
$$S = \\int_a^b |f(x) - g(x)|\\,dx$$

**Phương pháp:**
1. Tìm giao điểm: giải $f(x) = g(x)$
2. Xét dấu $f(x) - g(x)$ trên mỗi khoảng
3. Tách tích phân theo từng khoảng, bỏ trị tuyệt đối

**Lưu ý:** Diện tích luôn **dương**! Phải dùng trị tuyệt đối.`
  },
  {
    topic: 'INTEGRALS', subsection: 'Ứng dụng', sortOrder: 2,
    title: 'Thể tích vật thể tròn xoay',
    content: `**Quay quanh trục $Ox$:**
$$V = \\pi \\int_a^b [f(x)]^2\\,dx$$

**Quay quanh trục $Oy$:**
$$V = \\pi \\int_c^d [g(y)]^2\\,dy$$

**Ví dụ:** Quay $y = \\sqrt{x}$, $0 \\leq x \\leq 4$ quanh $Ox$:
$$V = \\pi \\int_0^4 x\\,dx = \\pi \\cdot \\frac{x^2}{2}\\Big|_0^4 = 8\\pi$$`
  },
  {
    topic: 'INTEGRALS', subsection: 'Phương pháp tính', sortOrder: 1,
    title: 'Phương pháp đổi biến',
    content: `Đặt $t = u(x)$, $dt = u'(x)\\,dx$:
$$\\int f(u(x)) \\cdot u'(x)\\,dx = \\int f(t)\\,dt$$

**Các dạng thường gặp:**
- $\\int \\frac{f'(x)}{f(x)}\\,dx = \\ln|f(x)| + C$
- $\\int f(x) \\cdot f'(x)\\,dx$: đặt $t = f(x)$
- $\\int \\sin^n x \\cos x\\,dx$: đặt $t = \\sin x$

**Lưu ý:** Tích phân xác định → phải **đổi cận** khi đổi biến!`
  },
  {
    topic: 'INTEGRALS', subsection: 'Phương pháp tính', sortOrder: 2,
    title: 'Tích phân từng phần',
    content: `$$\\int u\\,dv = uv - \\int v\\,du$$

**Quy tắc chọn $u$ (LIATE):**
- **L**ogarit → **A**lgebraic → **T**rig → **E**xponential

**Ví dụ mẫu:**
- $\\int x e^x\\,dx$: chọn $u = x$, $dv = e^x dx$
  $= xe^x - e^x + C$

- $\\int x\\ln x\\,dx$: chọn $u = \\ln x$, $dv = x\\,dx$
  $= \\frac{x^2}{2}\\ln x - \\frac{x^2}{4} + C$`
  },

  // ═══════════════════════════════════════════
  // FUNCTIONS — Khảo sát hàm số
  // ═══════════════════════════════════════════
  {
    topic: 'FUNCTIONS', subsection: 'Khảo sát', sortOrder: 1,
    title: 'Sơ đồ khảo sát hàm số',
    content: `**Các bước khảo sát:**
1. Tập xác định
2. Sự biến thiên: giới hạn, tiệm cận, $f'(x)$, bảng biến thiên, cực trị
3. Đồ thị: giao trục tọa độ, điểm đặc biệt, vẽ đồ thị

**Hàm bậc 3:** $y = ax^3 + bx^2 + cx + d$
- TXĐ: $\\mathbb{R}$
- $a > 0$: đồ thị đi từ $-\\infty$ lên $+\\infty$
- $a < 0$: đi từ $+\\infty$ xuống $-\\infty$
- Có cực trị khi $\\Delta_{y'} > 0$
- Điểm uốn: tâm đối xứng`
  },
  {
    topic: 'FUNCTIONS', subsection: 'Khảo sát', sortOrder: 2,
    title: 'Hàm phân thức',
    content: `**Dạng $y = \\frac{ax+b}{cx+d}$:**
- TCĐ: $x = -\\frac{d}{c}$, TCN: $y = \\frac{a}{c}$
- Tâm đối xứng: $I\\left(-\\frac{d}{c}, \\frac{a}{c}\\right)$
- $y' = \\frac{ad-bc}{(cx+d)^2}$ → không có cực trị

**Dạng $y = \\frac{ax^2+bx+c}{dx+e}$:**
- TCĐ: $x = -\\frac{e}{d}$
- Có tiệm cận xiên: chia đa thức → $y = (mx + n) + \\frac{r}{dx+e}$`
  },
  {
    topic: 'FUNCTIONS', subsection: 'Cực trị', sortOrder: 1,
    title: 'Cực trị và điều kiện',
    content: `**Điều kiện cần:** $f'(x_0) = 0$

**Điều kiện đủ:**
- $f'$ đổi dấu qua $x_0$ → cực trị
- Hoặc: $f'(x_0) = 0$ và $f''(x_0) \\neq 0$

**Hàm bậc 4 trùng phương** $y = ax^4 + bx^2 + c$:
- $y' = 4ax^3 + 2bx = 2x(2ax^2 + b)$
- $ab < 0$: 3 cực trị (1 cực đại + 2 cực tiểu hoặc ngược lại)
- $ab \\geq 0$: 1 cực trị tại $x = 0$`
  },
  {
    topic: 'FUNCTIONS', subsection: 'Tiệm cận', sortOrder: 1,
    title: 'Các loại tiệm cận',
    content: `**Tiệm cận đứng:** $x = a$ khi $\\lim_{x \\to a} f(x) = \\pm\\infty$

**Tiệm cận ngang:** $y = b$ khi $\\lim_{x \\to \\pm\\infty} f(x) = b$

**Tiệm cận xiên:** $y = kx + m$ khi:
$$k = \\lim_{x \\to \\infty} \\frac{f(x)}{x}, \\quad m = \\lim_{x \\to \\infty}[f(x) - kx]$$

**Mẹo nhanh:**
- $y = \\frac{P(x)}{Q(x)}$: TCĐ là nghiệm $Q(x) = 0$ (sau khi rút gọn)
- Bậc tử = bậc mẫu → có TCN
- Bậc tử = bậc mẫu + 1 → có TCX`
  },
  {
    topic: 'FUNCTIONS', subsection: 'Tương giao', sortOrder: 1,
    title: 'Bài toán tương giao và tham số',
    content: `**Dạng:** Tìm $m$ để $f(x) = m$ có $k$ nghiệm.

**Phương pháp:** Dựa vào bảng biến thiên, đếm số giao điểm $y = f(x)$ và $y = m$.

**Hàm bậc 3** có 2 cực trị ($y_{CT} < y_{CĐ}$):
- $m < y_{CT}$ hoặc $m > y_{CĐ}$: **1 nghiệm**
- $m = y_{CT}$ hoặc $m = y_{CĐ}$: **2 nghiệm**
- $y_{CT} < m < y_{CĐ}$: **3 nghiệm**

**Mẹo:** Nếu PT dạng $f(x) = mg(x)$ → chia 2 vế: $\\frac{f(x)}{g(x)} = m$ (ĐK: $g(x) \\neq 0$)`
  },

  // ═══════════════════════════════════════════
  // COMPLEX_NUMBERS — Số phức
  // ═══════════════════════════════════════════
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Định nghĩa', sortOrder: 1,
    title: 'Số phức và các khái niệm',
    content: `Số phức $z = a + bi$ với $a, b \\in \\mathbb{R}$, $i^2 = -1$

- **Phần thực:** $\\text{Re}(z) = a$
- **Phần ảo:** $\\text{Im}(z) = b$
- **Liên hợp:** $\\bar{z} = a - bi$
- **Mô-đun:** $|z| = \\sqrt{a^2 + b^2}$

**Hai số phức bằng nhau:** $a + bi = c + di \\Leftrightarrow a = c$ và $b = d$

**Biểu diễn hình học:** $z = a + bi$ ↔ điểm $M(a, b)$ trên mặt phẳng phức`
  },
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Phép toán', sortOrder: 1,
    title: 'Phép tính trên số phức',
    content: `- **Cộng:** $(a+bi) + (c+di) = (a+c) + (b+d)i$
- **Nhân:** $(a+bi)(c+di) = (ac-bd) + (ad+bc)i$
- **Chia:** $\\frac{a+bi}{c+di} = \\frac{(a+bi)(c-di)}{c^2+d^2}$

**Tính chất quan trọng:**
- $z \\cdot \\bar{z} = |z|^2 = a^2 + b^2$
- $|z_1 \\cdot z_2| = |z_1| \\cdot |z_2|$
- $\\overline{z_1 + z_2} = \\bar{z_1} + \\bar{z_2}$

**Lũy thừa của $i$:** $i^0 = 1$, $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$ (chu kỳ 4)`
  },
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Biểu diễn', sortOrder: 1,
    title: 'Biểu diễn hình học',
    content: `$z = a + bi$ ↔ điểm $M(a,b)$ ↔ vector $\\vec{OM}$

**Tập hợp điểm:**
- $|z - z_0| = R$: đường tròn tâm $z_0$, bán kính $R$
- $|z - z_1| = |z - z_2|$: trung trực đoạn $z_1 z_2$
- $|z - z_0| \\leq R$: hình tròn

**Dạng lượng giác:** $z = r(\\cos\\varphi + i\\sin\\varphi)$

**Công thức De Moivre:** $z^n = r^n(\\cos n\\varphi + i\\sin n\\varphi)$`
  },
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Phương trình', sortOrder: 1,
    title: 'Phương trình bậc hai số phức',
    content: `$az^2 + bz + c = 0$ (hệ số thực, $\\Delta < 0$):
$$z = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}$$

**Tính chất:** Hai nghiệm phức **liên hợp** nhau.

**Giải $z^2 = w$:** Đặt $z = x + yi$, khai triển, đồng nhất phần thực và ảo.

**Ví dụ:** $z^2 = 3 + 4i$
- $(x+yi)^2 = (x^2-y^2) + 2xyi = 3 + 4i$
- $x^2 - y^2 = 3$ và $2xy = 4$
- Kết hợp $x^2 + y^2 = |z|^2 = \\sqrt{9+16} = 5$
- Giải: $x = 2, y = 1$ hoặc $x = -2, y = -1$`
  },

  // ═══════════════════════════════════════════
  // PROBABILITY — Xác suất – Tổ hợp
  // ═══════════════════════════════════════════
  {
    topic: 'PROBABILITY', subsection: 'Tổ hợp', sortOrder: 1,
    title: 'Hoán vị, Chỉnh hợp, Tổ hợp',
    content: `**Hoán vị** (sắp xếp $n$ phần tử): $P_n = n!$

**Chỉnh hợp** (chọn $k$ từ $n$, có thứ tự): $A_n^k = \\frac{n!}{(n-k)!}$

**Tổ hợp** (chọn $k$ từ $n$, không thứ tự): $C_n^k = \\frac{n!}{k!(n-k)!}$

**Tính chất:** $C_n^k = C_n^{n-k}$, $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$

**Nhị thức Newton:**
$$(a+b)^n = \\sum_{k=0}^n C_n^k \\cdot a^{n-k} \\cdot b^k$$`
  },
  {
    topic: 'PROBABILITY', subsection: 'Xác suất', sortOrder: 1,
    title: 'Xác suất cổ điển và quy tắc',
    content: `$$P(A) = \\frac{n(A)}{n(\\Omega)}$$

**Quy tắc:**
- Biến cố đối: $P(\\bar{A}) = 1 - P(A)$
- Quy tắc cộng: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- Xung khắc: $P(A \\cup B) = P(A) + P(B)$
- Độc lập: $P(A \\cap B) = P(A) \\cdot P(B)$

**Mẹo:** "Ít nhất 1" → dùng biến cố đối: $P(X \\geq 1) = 1 - P(X = 0)$`
  },
  {
    topic: 'PROBABILITY', subsection: 'Biến ngẫu nhiên', sortOrder: 1,
    title: 'Biến ngẫu nhiên rời rạc',
    content: `**Kỳ vọng:** $E(X) = \\sum x_i \\cdot P(X = x_i)$

**Phương sai:** $D(X) = E(X^2) - [E(X)]^2$

**Phân phối nhị thức** $B(n, p)$:
$$P(X = k) = C_n^k \\cdot p^k \\cdot (1-p)^{n-k}$$
- $E(X) = np$
- $D(X) = np(1-p)$

**Nhận dạng:** "Lặp lại $n$ lần", "XS thành công mỗi lần là $p$"`
  },

  // ═══════════════════════════════════════════
  // EXPONENTIAL_LOG — Hàm mũ & Logarit
  // ═══════════════════════════════════════════
  {
    topic: 'EXPONENTIAL_LOG', subsection: 'Hàm mũ', sortOrder: 1,
    title: 'Hàm số mũ và tính chất',
    content: `$y = a^x$ ($a > 0, a \\neq 1$):
- TXĐ: $\\mathbb{R}$, tập giá trị: $(0, +\\infty)$
- $a > 1$: đồng biến, $0 < a < 1$: nghịch biến
- Luôn qua $(0, 1)$, TCN: $y = 0$

**Tính chất lũy thừa:**
- $a^m \\cdot a^n = a^{m+n}$
- $(a^m)^n = a^{mn}$
- $a^{-n} = \\frac{1}{a^n}$`
  },
  {
    topic: 'EXPONENTIAL_LOG', subsection: 'Logarit', sortOrder: 1,
    title: 'Logarit và tính chất',
    content: `$\\log_a x = b \\Leftrightarrow a^b = x$ ($a > 0, a \\neq 1, x > 0$)

**Tính chất:**
- $\\log_a(xy) = \\log_a x + \\log_a y$
- $\\log_a\\frac{x}{y} = \\log_a x - \\log_a y$
- $\\log_a x^n = n\\log_a x$
- Đổi cơ số: $\\log_a x = \\frac{\\ln x}{\\ln a}$

**Chú ý:** $\\log$ (cơ 10) = $\\lg$, $\\log_e$ = $\\ln$`
  },
  {
    topic: 'EXPONENTIAL_LOG', subsection: 'Phương trình', sortOrder: 1,
    title: 'Phương trình mũ và logarit',
    content: `**PT mũ:**
- $a^{f(x)} = a^{g(x)} \\Leftrightarrow f(x) = g(x)$
- Đặt $t = a^x > 0$: đưa về PT đại số

**PT logarit:**
- $\\log_a f(x) = \\log_a g(x) \\Leftrightarrow f(x) = g(x) > 0$
- Đặt $t = \\log_a x$

**BPT:** Lưu ý chiều:
- $a > 1$: cùng chiều ($\\log_a f > \\log_a g \\Leftrightarrow f > g > 0$)
- $0 < a < 1$: ngược chiều`
  },

  // ═══════════════════════════════════════════
  // SEQUENCES — Dãy số
  // ═══════════════════════════════════════════
  {
    topic: 'SEQUENCES', subsection: 'Cấp số cộng', sortOrder: 1,
    title: 'Cấp số cộng',
    content: `Dãy số $(u_n)$ là CSC khi $u_{n+1} - u_n = d$ (hằng số).

- **Số hạng tổng quát:** $u_n = u_1 + (n-1)d$
- **Tổng $n$ số hạng:** $S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$
- **Tính chất:** $u_k = \\frac{u_{k-1} + u_{k+1}}{2}$

**Ba số lập CSC:** đặt $a - d, a, a + d$`
  },
  {
    topic: 'SEQUENCES', subsection: 'Cấp số nhân', sortOrder: 1,
    title: 'Cấp số nhân',
    content: `Dãy số $(u_n)$ là CSN khi $\\frac{u_{n+1}}{u_n} = q$ (hằng số).

- **Số hạng tổng quát:** $u_n = u_1 \\cdot q^{n-1}$
- **Tổng $n$ số hạng:** $S_n = \\frac{u_1(1 - q^n)}{1 - q}$ ($q \\neq 1$)
- **Tính chất:** $u_k^2 = u_{k-1} \\cdot u_{k+1}$

**Ba số lập CSN:** đặt $\\frac{a}{q}, a, aq$

**Tổng vô hạn** ($|q| < 1$): $S = \\frac{u_1}{1-q}$`
  },
  {
    topic: 'SEQUENCES', subsection: 'Quy nạp', sortOrder: 1,
    title: 'Phương pháp quy nạp',
    content: `**Các bước:**
1. Kiểm tra mệnh đề đúng với $n = 1$
2. Giả sử đúng với $n = k$ (giả thiết quy nạp)
3. Chứng minh đúng với $n = k + 1$

**Ví dụ:** CM $1 + 2 + ... + n = \\frac{n(n+1)}{2}$
- $n=1$: $1 = \\frac{1 \\cdot 2}{2}$ ✓
- Giả sử đúng $n=k$: $S_k = \\frac{k(k+1)}{2}$
- Với $n=k+1$: $S_{k+1} = S_k + (k+1) = \\frac{k(k+1)}{2} + (k+1) = \\frac{(k+1)(k+2)}{2}$ ✓`
  },

  // ═══════════════════════════════════════════
  // LIMITS — Giới hạn – Liên tục
  // ═══════════════════════════════════════════
  {
    topic: 'LIMITS', subsection: 'Dãy số', sortOrder: 1,
    title: 'Giới hạn dãy số',
    content: `**Giới hạn cơ bản:**
- $\\lim \\frac{1}{n^k} = 0$ ($k > 0$)
- $\\lim q^n = 0$ ($|q| < 1$)

**Phân thức bậc cao:**
$$\\lim \\frac{a_p n^p + ...}{b_q n^q + ...} = \\begin{cases} 0 & p < q \\\\ \\frac{a_p}{b_q} & p = q \\\\ \\pm\\infty & p > q \\end{cases}$$

**Phương pháp:** Chia cả tử và mẫu cho $n$ bậc cao nhất.`
  },
  {
    topic: 'LIMITS', subsection: 'Hàm số', sortOrder: 1,
    title: 'Giới hạn hàm số',
    content: `**Giới hạn đặc biệt:**
- $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$
- $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$
- $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1$

**Dạng $\\frac{0}{0}$:** Phân tích nhân tử hoặc nhân liên hợp

**Dạng $\\frac{\\infty}{\\infty}$:** Chia cho lũy thừa cao nhất`
  },
  {
    topic: 'LIMITS', subsection: 'Liên tục', sortOrder: 1,
    title: 'Hàm số liên tục',
    content: `$f$ liên tục tại $x_0$ khi: $\\lim_{x \\to x_0} f(x) = f(x_0)$

**Định lý giá trị trung gian:**
Nếu $f$ liên tục trên $[a,b]$ và $f(a) \\cdot f(b) < 0$ thì tồn tại $c \\in (a,b)$: $f(c) = 0$.

**Ứng dụng:** Chứng minh phương trình có nghiệm trên $(a,b)$.`
  },
  {
    topic: 'LIMITS', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài tập mẫu giới hạn',
    content: `**Bài 1:** $\\lim_{x \\to 1} \\frac{\\sqrt{x} - 1}{x - 1}$

Nhân liên hợp: $= \\lim_{x \\to 1} \\frac{1}{\\sqrt{x} + 1} = \\frac{1}{2}$

**Bài 2:** $\\lim_{x \\to +\\infty} (\\sqrt{x^2 + x} - x)$

Nhân liên hợp: $= \\lim \\frac{x}{\\sqrt{x^2+x} + x} = \\frac{1}{2}$

**Bài 3:** Tìm $m$ để $f(x)$ liên tục tại $x = 1$:
$$f(x) = \\begin{cases} \\frac{x^2-1}{x-1} & x \\neq 1 \\\\ m & x = 1 \\end{cases}$$
$\\lim_{x \\to 1} f(x) = \\lim \\frac{(x-1)(x+1)}{x-1} = 2$ → $m = 2$`
  },

  // ═══════════════════════════════════════════
  // SOLID_GEOMETRY — Hình học không gian
  // ═══════════════════════════════════════════
  {
    topic: 'SOLID_GEOMETRY', subsection: 'Quan hệ song song', sortOrder: 1,
    title: 'Đường thẳng và mặt phẳng song song',
    content: `**Đường thẳng // mặt phẳng:**
- $d // (P) \\Leftrightarrow d$ song song với 1 đường thẳng trong $(P)$

**Hai mặt phẳng song song:**
- $(P) // (Q) \\Leftrightarrow (P)$ chứa 2 đường cắt nhau cùng song song $(Q)$
- Nếu $(P) // (Q)$: mọi mp cắt $(P)$ đều cắt $(Q)$, 2 giao tuyến song song

**Định lý Thales:** 3 mp song song cắt 2 đường thẳng → tỉ số bằng nhau`
  },
  {
    topic: 'SOLID_GEOMETRY', subsection: 'Quan hệ vuông góc', sortOrder: 1,
    title: 'Vuông góc trong không gian',
    content: `**Đường thẳng $\\perp$ mặt phẳng:**
$d \\perp (P) \\Leftrightarrow d \\perp$ hai đường cắt nhau trong $(P)$

**Hai mặt phẳng vuông góc:**
$(P) \\perp (Q) \\Leftrightarrow (P)$ chứa đường thẳng $\\perp (Q)$

**Góc giữa đường và mặt phẳng:**
= góc giữa $d$ và hình chiếu $d'$ trên $(P)$

**Góc nhị diện:** góc giữa 2 nửa mp có chung cạnh (giao tuyến)
→ Dựng 2 đường cùng $\\perp$ giao tuyến, mỗi đường nằm trong 1 mp`
  },

  // ═══════════════════════════════════════════
  // ANALYTIC_GEOMETRY — Hình học giải tích
  // ═══════════════════════════════════════════
  {
    topic: 'ANALYTIC_GEOMETRY', subsection: 'Tọa độ Oxy', sortOrder: 1,
    title: 'Đường thẳng và đường tròn trong Oxy',
    content: `**Đường thẳng:** $ax + by + c = 0$, VTPT $\\vec{n} = (a, b)$

**Khoảng cách:** $d(M, \\Delta) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$

**Đường tròn:** $(x-a)^2 + (y-b)^2 = R^2$, tâm $I(a,b)$

**Vị trí tương đối đường thẳng - đường tròn:**
- $d(I, \\Delta) > R$: không cắt
- $d(I, \\Delta) = R$: tiếp xúc
- $d(I, \\Delta) < R$: cắt 2 điểm`
  },
  {
    topic: 'ANALYTIC_GEOMETRY', subsection: 'Oxyz', sortOrder: 1,
    title: 'Hình học tọa độ Oxyz',
    content: `**Mặt phẳng:** $ax + by + cz + d = 0$, VTPT $\\vec{n} = (a,b,c)$

**Đường thẳng:** $\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$

**Khoảng cách điểm - mặt phẳng:**
$$d = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2+b^2+c^2}}$$

**Tích có hướng:** $\\vec{a} \\times \\vec{b}$ → VTPT, diện tích`
  },
  {
    topic: 'ANALYTIC_GEOMETRY', subsection: 'Mặt cầu', sortOrder: 1,
    title: 'Mặt cầu',
    content: `**PT mặt cầu** tâm $I(a,b,c)$, bán kính $R$:
$$(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$$

**Dạng khai triển:** $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$
- Tâm: $I(a, b, c)$, $R = \\sqrt{a^2 + b^2 + c^2 - d}$

**Tiếp xúc:** mặt cầu tiếp xúc mp $(P)$ khi $d(I, (P)) = R$`
  },

  // ═══════════════════════════════════════════
  // VOLUME — Thể tích
  // ═══════════════════════════════════════════
  {
    topic: 'VOLUME', subsection: 'Khối đa diện', sortOrder: 1,
    title: 'Thể tích khối đa diện',
    content: `- **Hình hộp chữ nhật:** $V = abc$
- **Hình lập phương:** $V = a^3$
- **Hình chóp:** $V = \\frac{1}{3} S_{đáy} \\cdot h$
- **Hình lăng trụ:** $V = S_{đáy} \\cdot h$

**Diện tích đáy thường gặp:**
- Tam giác đều: $S = \\frac{a^2\\sqrt{3}}{4}$
- Hình vuông: $S = a^2$
- Lục giác đều: $S = \\frac{3a^2\\sqrt{3}}{2}$

**Tỉ số thể tích khi cắt:** $\\frac{V_{nhỏ}}{V_{lớn}} = \\left(\\frac{h'}{h}\\right)^3$`
  },
  {
    topic: 'VOLUME', subsection: 'Khối tròn xoay', sortOrder: 1,
    title: 'Thể tích khối tròn xoay',
    content: `- **Hình trụ:** $V = \\pi r^2 h$
- **Hình nón:** $V = \\frac{1}{3}\\pi r^2 h$, đường sinh $l = \\sqrt{r^2 + h^2}$
- **Hình cầu:** $V = \\frac{4}{3}\\pi R^3$, $S = 4\\pi R^2$

**Mặt cầu ngoại tiếp hình hộp CN** $a \\times b \\times c$:
$$R = \\frac{\\sqrt{a^2 + b^2 + c^2}}{2}$$

**Mặt cầu ngoại tiếp khi $SA \\perp (ABC)$:**
Tâm nằm trên trục vuông góc qua tâm ngoại tiếp đáy`
  },
];

// ══════════════════════════════════
// Seed function
// ══════════════════════════════════
async function main() {
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaNeon } = await import('@prisma/adapter-neon');
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const ws = (await import('ws')).default;

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🚀 Seeding study content...\n');

  // Clear existing
  await prisma.$executeRawUnsafe('DELETE FROM study_contents');
  console.log('🗑️  Cleared existing study contents\n');

  let count = 0;
  for (const item of studyData) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO study_contents (id, topic, subsection, title, content, "sortOrder", "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())`,
      item.topic,
      item.subsection,
      item.title,
      item.content,
      item.sortOrder
    );
    count++;
    console.log(`  ✓ [${item.topic}] ${item.subsection} — ${item.title}`);
  }

  console.log(`\n═══════════════════════════════`);
  console.log(`✅ Done! ${count} study items inserted`);
  console.log(`═══════════════════════════════\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});

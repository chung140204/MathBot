# Đề thi VDC - Hàm số có tham số (DERIVATIVES)

---
[topic: DERIVATIVES]
[source: THPT QG 2024 - VDC Hàm số đơn điệu có tham số]

Bài: Tìm tất cả giá trị $m$ để hàm số $y = x^3 - 3mx^2 + (3m^2 - 3)x + 1$ đồng biến trên $(0, +\infty)$.

Lời giải:
$y' = 3x^2 - 6mx + 3m^2 - 3 = 3(x^2 - 2mx + m^2 - 1) = 3[(x-m)^2 - 1]$

Hàm đồng biến trên $(0, +\infty)$ khi $y' \geq 0$ với mọi $x > 0$.

$y' = 3(x - m - 1)(x - m + 1) = 0$ khi $x = m - 1$ hoặc $x = m + 1$

Cần $y' \geq 0$ trên $(0, +\infty)$:
- TH1: $m - 1 \geq 0$ và cả 2 nghiệm $\leq 0$ → vô lý vì $m + 1 > 0$
- TH2: $m + 1 \leq 0$ tức $m \leq -1$ → cả 2 nghiệm $\leq 0$ → $y' > 0$ trên $(0, +\infty)$ ✓
- TH3: $m - 1 \leq 0 < m + 1$: cần kiểm tra $y'(0) \geq 0$
  $y'(0) = 3(m^2 - 1) \geq 0$ → $m \leq -1$ hoặc $m \geq 1$
  Kết hợp $-1 < m < 1$: chỉ $m = -1$

Vậy $m \leq -1$.

Phương pháp: Giải $y' = 0$, phân tích vị trí nghiệm so với khoảng đồng biến.

---
[topic: DERIVATIVES]
[source: THPT QG 2023 - VDC Số giao điểm đồ thị]

Bài: Tìm $m$ để đường thẳng $y = m$ cắt đồ thị $y = |x^3 - 3x|$ tại 6 điểm phân biệt.

Lời giải:
Đặt $f(x) = x^3 - 3x$. Ta có $f'(x) = 3x^2 - 3 = 0 \Rightarrow x = \pm 1$.
- $f(-1) = 2$ (cực đại), $f(1) = -2$ (cực tiểu)

Đồ thị $y = |f(x)|$: lấy phần $f(x) < 0$ lật lên trên trục Ox.
- Phần $f(x) < 0$ (tức $x \in (-\sqrt{3}, 0) \cup (1, \sqrt{3})$) → lật lên
- Cực tiểu mới tại $x = 0$: $|f(0)| = 0$
- Cực đại mới: $|f(\pm 1)| = 2$

Đồ thị $y = |x^3 - 3x|$ có dạng "sóng" với đỉnh cao = 2.

Đường $y = m$ cắt tại 6 điểm ↔ $0 < m < 2$.

Phương pháp: Vẽ đồ thị $y = |f(x)|$ từ $f(x)$, đếm giao điểm theo $m$.

---
[topic: DERIVATIVES]
[source: THPT QG 2022 - VDC GTLN GTNN trên đoạn có tham số]

Bài: Cho hàm số $f(x) = x^4 - 2x^2 + m$. Tìm $m$ để $\max_{[-2,3]} f(x) = 10$.

Lời giải:
$f'(x) = 4x^3 - 4x = 4x(x^2 - 1) = 0 \Rightarrow x = 0, \pm 1$

Tính giá trị:
- $f(-2) = 16 - 8 + m = 8 + m$
- $f(-1) = 1 - 2 + m = -1 + m$
- $f(0) = m$
- $f(1) = -1 + m$
- $f(3) = 81 - 18 + m = 63 + m$

$\max_{[-2,3]} f(x) = f(3) = 63 + m$ (vì $63 + m > 8 + m > m > -1 + m$)

$63 + m = 10 \Rightarrow m = -53$

Kiểm tra: $f(3) = 10$, $f(-2) = -45$, $f(0) = -53$, $f(\pm 1) = -54$. Max = 10 ✓

Phương pháp: Tính $f$ tại các điểm cực trị và đầu mút, so sánh.

---
[topic: DERIVATIVES]
[source: THPT QG 2024 - VDC Hàm hợp cho đồ thị f'(x)]

Bài: Cho hàm $f(x)$ có đạo hàm $f'(x)$ liên tục, đồ thị $y = f'(x)$ như hình. Hỏi hàm $g(x) = f(x^2 - 2x)$ có bao nhiêu cực trị?

Phương pháp giải dạng này:
$g'(x) = f'(x^2 - 2x) \cdot (2x - 2)$

$g'(x) = 0$ khi:
- $2x - 2 = 0 \Rightarrow x = 1$
- $f'(x^2 - 2x) = 0$: đặt $t = x^2 - 2x$, giải $f'(t) = 0$ → được các giá trị $t_1, t_2, ...$

Với mỗi $t_i$: giải $x^2 - 2x = t_i$ tức $(x-1)^2 = t_i + 1$
- $t_i + 1 > 0$: 2 nghiệm $x$
- $t_i + 1 = 0$: 1 nghiệm $x = 1$ (trùng)
- $t_i + 1 < 0$: vô nghiệm

Xét dấu $g'(x)$: lập bảng xét dấu tích $f'(t) \cdot (2x-2)$, đếm số lần đổi dấu = số cực trị.

Mẹo: Vẽ parabol $t = x^2 - 2x$ và đánh dấu các giá trị $t_i$ trên trục $t$.

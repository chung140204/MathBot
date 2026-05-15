# Hàm mũ và Logarit (EXPONENTIAL_LOG)

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Tính chất lũy thừa]

Tính chất lũy thừa ($a > 0$):
- $a^m \cdot a^n = a^{m+n}$
- $\frac{a^m}{a^n} = a^{m-n}$
- $(a^m)^n = a^{mn}$
- $(ab)^n = a^n \cdot b^n$
- $a^0 = 1$, $a^{-n} = \frac{1}{a^n}$
- $a^{1/n} = \sqrt[n]{a}$
- $a^{m/n} = \sqrt[n]{a^m}$

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Tính chất logarit]

Tính chất logarit ($a > 0, a \neq 1, x > 0, y > 0$):
- $\log_a 1 = 0$
- $\log_a a = 1$
- $\log_a(xy) = \log_a x + \log_a y$
- $\log_a\frac{x}{y} = \log_a x - \log_a y$
- $\log_a x^n = n\log_a x$
- $\log_a \sqrt[n]{x} = \frac{1}{n}\log_a x$

Đổi cơ số:
- $\log_a x = \frac{\log_b x}{\log_b a} = \frac{\ln x}{\ln a}$
- $\log_a b \cdot \log_b a = 1$
- $\log_{a^k} x = \frac{1}{k}\log_a x$
- $a^{\log_a x} = x$

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Hàm số mũ]

Hàm số mũ $y = a^x$ ($a > 0, a \neq 1$):
- TXĐ: $\mathbb{R}$, tập giá trị: $(0, +\infty)$
- Luôn dương: $a^x > 0$ với mọi $x$
- $a > 1$: đồng biến (đồ thị tăng)
- $0 < a < 1$: nghịch biến (đồ thị giảm)
- Đồ thị luôn đi qua $(0, 1)$
- Tiệm cận ngang: $y = 0$ (trục Ox)

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Hàm số logarit]

Hàm số logarit $y = \log_a x$ ($a > 0, a \neq 1$):
- TXĐ: $(0, +\infty)$, tập giá trị: $\mathbb{R}$
- $a > 1$: đồng biến
- $0 < a < 1$: nghịch biến
- Đồ thị luôn đi qua $(1, 0)$
- Tiệm cận đứng: $x = 0$ (trục Oy)
- Là hàm ngược của hàm mũ: $y = \log_a x \Leftrightarrow x = a^y$

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Phương trình mũ]

Phương trình mũ:

Dạng 1: $a^{f(x)} = a^{g(x)} \Leftrightarrow f(x) = g(x)$ (cùng cơ số)

Dạng 2: $a^{f(x)} = b$: lấy logarit hai vế
$f(x) = \log_a b$

Dạng 3: Đặt ẩn phụ $t = a^x > 0$
Ví dụ: $4^x - 3 \cdot 2^x + 2 = 0$
- Đặt $t = 2^x > 0$: $t^2 - 3t + 2 = 0$ → $t = 1$ hoặc $t = 2$
- $2^x = 1 \Rightarrow x = 0$; $2^x = 2 \Rightarrow x = 1$

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Phương trình logarit]

Phương trình logarit:

Điều kiện: đối số > 0

Dạng 1: $\log_a f(x) = \log_a g(x) \Leftrightarrow f(x) = g(x) > 0$

Dạng 2: $\log_a f(x) = b \Leftrightarrow f(x) = a^b$ (với $f(x) > 0$)

Dạng 3: Đặt $t = \log_a x$
Ví dụ: $\log_2^2 x - 3\log_2 x + 2 = 0$
- Đặt $t = \log_2 x$: $t^2 - 3t + 2 = 0$ → $t = 1, t = 2$
- $\log_2 x = 1 \Rightarrow x = 2$; $\log_2 x = 2 \Rightarrow x = 4$

---
[topic: EXPONENTIAL_LOG]
[source: SGK Toán 12 - Bất phương trình mũ và logarit]

Bất phương trình mũ:
- $a > 1$: $a^{f(x)} > a^{g(x)} \Leftrightarrow f(x) > g(x)$ (cùng chiều)
- $0 < a < 1$: $a^{f(x)} > a^{g(x)} \Leftrightarrow f(x) < g(x)$ (ngược chiều)

Bất phương trình logarit:
- $a > 1$: $\log_a f(x) > \log_a g(x) \Leftrightarrow f(x) > g(x) > 0$ (cùng chiều)
- $0 < a < 1$: $\log_a f(x) > \log_a g(x) \Leftrightarrow 0 < f(x) < g(x)$ (ngược chiều)

Lưu ý: Luôn kiểm tra điều kiện logarit (đối số > 0)!

---
[topic: EXPONENTIAL_LOG]
[source: Toán 12 - Mẹo thi: Mũ và Logarit]

Mẹo thi nhanh:

1. So sánh $a^x$ và $a^y$: nếu $a > 1$ thì cùng chiều, nếu $0 < a < 1$ thì ngược chiều

2. $\log$ cơ số 10 viết là $\lg$, cơ số $e$ viết là $\ln$
   Máy tính: dùng nút $\log$ (cơ 10) và $\ln$ (cơ e)

3. Bài toán lãi suất kép: $A = A_0(1+r)^n$
   - $A$: số tiền sau $n$ kỳ
   - $A_0$: vốn gốc
   - $r$: lãi suất mỗi kỳ

4. Tìm thời gian: $n = \frac{\ln(A/A_0)}{\ln(1+r)}$

5. Bất PT mũ phức tạp: đặt $t = a^x$ rồi giải BPT theo $t > 0$, cuối cùng quay lại $x$

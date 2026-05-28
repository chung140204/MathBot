# Giới hạn (LIMITS)

---
[topic: LIMITS]
[source: SGK Toán 12 - Giới hạn dãy số]
[difficulty: COMPREHENSION]
[subTopic: toan_12_gioi_han_day_so]
[relatedTopics: SEQUENCES]

Giới hạn dãy số cơ bản:
- $\lim \frac{1}{n^k} = 0$ (với $k > 0$)
- $\lim q^n = 0$ (với $|q| < 1$)
- $\lim \frac{a_n}{b_n}$: chia cả tử và mẫu cho $n$ bậc cao nhất

Dãy số có giới hạn $+\infty$: $\lim u_n = +\infty$ khi $u_n$ tăng không bị chặn
Dãy số có giới hạn $-\infty$: $\lim u_n = -\infty$ khi $u_n$ giảm không bị chặn

Giới hạn phân thức đa thức bậc cao:
$$\lim \frac{a_p n^p + ...}{b_q n^q + ...} = \begin{cases} 0 & \text{nếu } p < q \\ \frac{a_p}{b_q} & \text{nếu } p = q \\ \pm\infty & \text{nếu } p > q \end{cases}$$

---
[topic: LIMITS]
[source: SGK Toán 12 - Giới hạn hàm số]
[difficulty: COMPREHENSION]
[subTopic: toan_12_gioi_han_ham_so]
[relatedTopics: FUNCTIONS]

Giới hạn hàm số tại một điểm:
$$\lim_{x \to a} f(x) = L$$

Các phép tính:
- $\lim [f(x) \pm g(x)] = \lim f(x) \pm \lim g(x)$
- $\lim [f(x) \cdot g(x)] = \lim f(x) \cdot \lim g(x)$
- $\lim \frac{f(x)}{g(x)} = \frac{\lim f(x)}{\lim g(x)}$ (nếu $\lim g(x) \neq 0$)

Giới hạn đặc biệt:
- $\lim_{x \to 0} \frac{\sin x}{x} = 1$
- $\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2}$
- $\lim_{x \to 0} \frac{e^x - 1}{x} = 1$
- $\lim_{x \to 0} \frac{\ln(1+x)}{x} = 1$

---
[topic: LIMITS]
[source: SGK Toán 12 - Giới hạn dạng vô định 0/0]
[difficulty: COMPREHENSION]
[subTopic: toan_12_gioi_han_dang_vo_dinh_0_0]

Giới hạn dạng $\frac{0}{0}$:

Phương pháp 1: Phân tích nhân tử
- $\lim_{x \to a} \frac{f(x)}{g(x)}$ khi $f(a) = g(a) = 0$
- Phân tích: $f(x) = (x-a) \cdot f_1(x)$, $g(x) = (x-a) \cdot g_1(x)$
- Rút gọn $(x-a)$

Phương pháp 2: Nhân liên hợp (có căn thức)
- $\frac{\sqrt{A} - \sqrt{B}}{C}$: nhân cả tử mẫu với $(\sqrt{A} + \sqrt{B})$
- Dùng: $(\sqrt{A} - \sqrt{B})(\sqrt{A} + \sqrt{B}) = A - B$

Ví dụ: $\lim_{x \to 1} \frac{\sqrt{x} - 1}{x - 1} = \lim_{x \to 1} \frac{1}{\sqrt{x} + 1} = \frac{1}{2}$

---
[topic: LIMITS]
[source: SGK Toán 12 - Giới hạn dạng vô định ∞/∞]
[difficulty: COMPREHENSION]
[subTopic: toan_12_gioi_han_dang_vo_dinh]

Giới hạn dạng $\frac{\infty}{\infty}$:

Phương pháp: Chia cả tử và mẫu cho lũy thừa cao nhất của $x$

$$\lim_{x \to \infty} \frac{2x^3 + x - 1}{3x^3 + 5} = \lim_{x \to \infty} \frac{2 + \frac{1}{x^2} - \frac{1}{x^3}}{3 + \frac{5}{x^3}} = \frac{2}{3}$$

Quy tắc nhanh: $\lim_{x \to \infty} \frac{a_n x^n + ...}{b_m x^m + ...}$
- $n = m$: kết quả = $\frac{a_n}{b_m}$
- $n < m$: kết quả = $0$
- $n > m$: kết quả = $\pm\infty$

---
[topic: LIMITS]
[source: SGK Toán 12 - Giới hạn có căn thức]
[difficulty: COMPREHENSION]
[subTopic: toan_12_gioi_han_co_can_thuc]

Giới hạn dạng $\infty - \infty$ có căn:

Phương pháp: Nhân liên hợp

Ví dụ 1: $\lim_{x \to +\infty} (\sqrt{x^2 + x} - x)$
$$= \lim \frac{(\sqrt{x^2+x} - x)(\sqrt{x^2+x} + x)}{\sqrt{x^2+x} + x} = \lim \frac{x}{\sqrt{x^2+x} + x} = \frac{1}{2}$$

Ví dụ 2: $\lim_{x \to +\infty} (\sqrt{x^2 + 2x} - \sqrt{x^2 - 2x})$
$$= \lim \frac{4x}{\sqrt{x^2+2x} + \sqrt{x^2-2x}} = 2$$

Mẹo: Chia cho $x > 0$ (khi $x \to +\infty$): $\sqrt{x^2 + ax} = x\sqrt{1 + \frac{a}{x}}$

---
[topic: LIMITS]
[source: SGK Toán 12 - Hàm số liên tục]
[difficulty: COMPREHENSION]
[subTopic: toan_12_ham_so_lien_tuc]
[relatedTopics: FUNCTIONS]

Hàm số liên tục tại $x_0$: $\lim_{x \to x_0} f(x) = f(x_0)$

Điều kiện liên tục:
1. $f(x_0)$ xác định
2. $\lim_{x \to x_0} f(x)$ tồn tại
3. $\lim_{x \to x_0} f(x) = f(x_0)$

Hàm số liên tục trên đoạn $[a,b]$: liên tục tại mọi điểm trong $(a,b)$, liên tục phải tại $a$, liên tục trái tại $b$.

Định lý giá trị trung gian: Nếu $f$ liên tục trên $[a,b]$ và $f(a) \cdot f(b) < 0$ thì tồn tại $c \in (a,b)$ sao cho $f(c) = 0$.
→ Ứng dụng: chứng minh phương trình có nghiệm.

---
[topic: LIMITS]
[source: Toán 12 - Mẹo thi: Giới hạn]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_gioi_han]

Mẹo thi nhanh cho giới hạn:

1. $\lim_{x \to a} \frac{x^n - a^n}{x - a} = na^{n-1}$

2. Giới hạn vô cùng của phân thức: chỉ cần nhìn bậc cao nhất
   $\lim \frac{3x^2 + ...}{5x^2 + ...} = \frac{3}{5}$

3. Giới hạn dãy $\lim \frac{1+2+...+n}{n^2} = \lim \frac{n(n+1)/2}{n^2} = \frac{1}{2}$

4. Tìm $m$ để hàm liên tục: cho $\lim_{x \to x_0} f(x) = f(x_0)$, giải tìm $m$

5. Dùng L'Hôpital (nếu biết): $\lim \frac{f}{g} = \lim \frac{f'}{g'}$ khi dạng $\frac{0}{0}$

# Đề thi VDC - Mũ Logarit (EXPONENTIAL_LOG)

---
[topic: EXPONENTIAL_LOG]
[source: THPT QG 2024 - VDC PT Mũ có tham số]

Bài: Tìm $m$ để phương trình $4^x - 2^{x+1} + m = 0$ có 2 nghiệm phân biệt.

Lời giải:
Đặt $t = 2^x > 0$: $t^2 - 2t + m = 0$ → $m = -t^2 + 2t = f(t)$

Khảo sát $f(t) = -t^2 + 2t$ trên $(0, +\infty)$:
$f'(t) = -2t + 2 = 0 \Rightarrow t = 1$
$f(1) = 1$ (cực đại)
$f(0) = 0$, $\lim_{t \to +\infty} f(t) = -\infty$

PT có 2 nghiệm $x$ phân biệt ↔ PT $f(t) = m$ có 2 nghiệm $t > 0$ phân biệt.

Từ BBT: $0 < m < 1$ → $f(t) = m$ có 2 nghiệm $t_1, t_2 > 0$ → 2 giá trị $x$ tương ứng.

Vậy $0 < m < 1$.

---
[topic: EXPONENTIAL_LOG]
[source: THPT QG 2023 - VDC BPT Logarit]

Bài: Giải bất phương trình $\log_2(x+1) + \log_2(x-1) > 3$.

Lời giải:
ĐK: $x + 1 > 0$ và $x - 1 > 0$ → $x > 1$

$\log_2(x+1) + \log_2(x-1) > 3$
$\log_2[(x+1)(x-1)] > 3$
$\log_2(x^2 - 1) > 3$
$x^2 - 1 > 2^3 = 8$
$x^2 > 9$
$x > 3$ hoặc $x < -3$

Kết hợp ĐK $x > 1$: $x > 3$.

---
[topic: EXPONENTIAL_LOG]
[source: THPT QG 2022 - VDC Phương trình mũ-logarit hỗn hợp]

Bài: Giải phương trình $2^x \cdot 3^{x^2} = 6$.

Lời giải:
Lấy $\log$ hai vế:
$x \ln 2 + x^2 \ln 3 = \ln 6 = \ln 2 + \ln 3$

$x^2 \ln 3 + x \ln 2 - \ln 2 - \ln 3 = 0$

Coi là PT bậc 2 theo $x$:
$(\ln 3) x^2 + (\ln 2) x - (\ln 2 + \ln 3) = 0$

$\Delta = \ln^2 2 + 4\ln 3(\ln 2 + \ln 3)$
$= \ln^2 2 + 4\ln 2 \cdot \ln 3 + 4\ln^2 3$
$= (\ln 2 + 2\ln 3)^2$

$x = \frac{-\ln 2 \pm (\ln 2 + 2\ln 3)}{2\ln 3}$

$x_1 = \frac{2\ln 3}{2\ln 3} = 1$

$x_2 = \frac{-2\ln 2 - 2\ln 3}{2\ln 3} = \frac{-\ln 2 - \ln 3}{\ln 3} = -1 - \log_3 2$

Phương pháp: Logarit hóa → PT bậc 2 theo $x$.

---
[topic: EXPONENTIAL_LOG]
[source: THPT QG 2021 - VDC Tìm m để PT logarit có nghiệm]

Bài: Tìm $m$ để PT $\log_3^2 x - 2m\log_3 x + m + 2 = 0$ có 2 nghiệm $x_1, x_2$ sao cho $x_1 \cdot x_2 = 81$.

Lời giải:
Đặt $t = \log_3 x$: $t^2 - 2mt + m + 2 = 0$ (*)

$x_1 \cdot x_2 = 81 \Rightarrow \log_3(x_1 x_2) = 4 \Rightarrow t_1 + t_2 = 4$

Viète cho (*): $t_1 + t_2 = 2m$ → $2m = 4 \Rightarrow m = 2$

Kiểm tra: $m = 2$: $t^2 - 4t + 4 = 0 \Rightarrow t = 2$ (nghiệm kép)
→ $x_1 = x_2 = 9$ → $x_1 x_2 = 81$ ✓

Nhưng 2 nghiệm trùng → nếu đề yêu cầu "2 nghiệm phân biệt" → cần kiểm tra $\Delta > 0$.

$\Delta = 4m^2 - 4(m + 2) = 4m^2 - 4m - 8 > 0$ → $m > 2$ hoặc $m < -1$

Vì $m = 2$ cho nghiệm kép → nếu yêu cầu phân biệt thì vô nghiệm (không có $m$).

Phương pháp: Đặt ẩn phụ → Viète → giải theo $m$ → kiểm tra ĐK.

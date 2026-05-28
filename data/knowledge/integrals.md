# Tích phân (INTEGRALS)

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Nguyên hàm cơ bản]
[difficulty: COMPREHENSION]
[subTopic: toan_12_nguyen_ham_co_ban]
[relatedTopics: DERIVATIVES]

Bảng nguyên hàm cơ bản:
- $\int 0 \, dx = C$
- $\int x^n dx = \frac{x^{n+1}}{n+1} + C$ (với $n \neq -1$)
- $\int \frac{1}{x} dx = \ln|x| + C$
- $\int e^x dx = e^x + C$
- $\int a^x dx = \frac{a^x}{\ln a} + C$
- $\int \sin x \, dx = -\cos x + C$
- $\int \cos x \, dx = \sin x + C$
- $\int \frac{1}{\cos^2 x} dx = \tan x + C$
- $\int \frac{1}{\sin^2 x} dx = -\cot x + C$

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Nguyên hàm mở rộng]
[difficulty: COMPREHENSION]
[subTopic: toan_12_nguyen_ham_mo_rong]
[relatedTopics: DERIVATIVES]

Nguyên hàm mở rộng (dạng hàm hợp):
- $\int (ax+b)^n dx = \frac{(ax+b)^{n+1}}{a(n+1)} + C$
- $\int \frac{1}{ax+b} dx = \frac{1}{a}\ln|ax+b| + C$
- $\int e^{ax+b} dx = \frac{1}{a}e^{ax+b} + C$
- $\int \sin(ax+b) dx = -\frac{1}{a}\cos(ax+b) + C$
- $\int \cos(ax+b) dx = \frac{1}{a}\sin(ax+b) + C$

Quy tắc: $\int f(ax+b) dx = \frac{1}{a}F(ax+b) + C$

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Công thức Newton-Leibniz]
[difficulty: RECOGNITION]
[subTopic: toan_12_cong_thuc_newton_leibniz]

Công thức Newton-Leibniz:
$$\int_a^b f(x) dx = F(b) - F(a)$$

trong đó $F(x)$ là nguyên hàm của $f(x)$.

Tính chất tích phân:
- $\int_a^b kf(x) dx = k\int_a^b f(x) dx$
- $\int_a^b [f(x) \pm g(x)] dx = \int_a^b f(x) dx \pm \int_a^b g(x) dx$
- $\int_a^b f(x) dx = \int_a^c f(x) dx + \int_c^b f(x) dx$
- $\int_a^b f(x) dx = -\int_b^a f(x) dx$
- $\int_a^a f(x) dx = 0$

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Phương pháp đổi biến]
[difficulty: APPLICATION]
[subTopic: toan_12_phuong_phap_doi_bien]

Phương pháp đổi biến số:

Dạng 1: Đặt $t = u(x)$, $dt = u'(x)dx$
$$\int f(u(x)) \cdot u'(x) dx = \int f(t) dt$$

Các đổi biến thường gặp:
- $\int \frac{f'(x)}{f(x)} dx$: đặt $t = f(x)$ → $\ln|f(x)| + C$
- $\int f(x) \cdot f'(x) dx$: đặt $t = f(x)$ → $\frac{t^2}{2} + C$
- $\int \sin^n x \cos x \, dx$: đặt $t = \sin x$
- $\int \cos^n x \sin x \, dx$: đặt $t = \cos x$

Lưu ý với tích phân xác định: đổi cận khi đổi biến!

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Phương pháp tích phân từng phần]
[difficulty: APPLICATION]
[subTopic: toan_12_phuong_phap_tich_phan_tung_phan]

Tích phân từng phần:
$$\int u \, dv = uv - \int v \, du$$

Quy tắc chọn $u$ (LIATE):
- **L**ogarit: $\ln x$, $\log x$
- **I**nverse trig (ít dùng ở cấp 3)
- **A**lgebraic: $x$, $x^2$, đa thức
- **T**rig: $\sin x$, $\cos x$
- **E**xponential: $e^x$, $a^x$

Ví dụ thường gặp:
- $\int x e^x dx$: chọn $u = x$, $dv = e^x dx$
- $\int x \sin x \, dx$: chọn $u = x$, $dv = \sin x \, dx$
- $\int x \ln x \, dx$: chọn $u = \ln x$, $dv = x \, dx$
- $\int x^2 e^x dx$: từng phần 2 lần

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Diện tích hình phẳng]
[difficulty: COMPREHENSION]
[subTopic: toan_12_dien_tich_hinh_phang]
[relatedTopics: FUNCTIONS, ANALYTIC_GEOMETRY]

Diện tích hình phẳng:

1. Diện tích giới hạn bởi $y = f(x)$, trục $Ox$, $x = a$, $x = b$:
$$S = \int_a^b |f(x)| dx$$

2. Diện tích giữa hai đường cong $y = f(x)$ và $y = g(x)$:
$$S = \int_a^b |f(x) - g(x)| dx$$

Phương pháp tính:
- Tìm giao điểm: giải $f(x) = g(x)$ (hoặc $f(x) = 0$)
- Xét dấu hiệu trên mỗi khoảng
- Tách thành tổng các tích phân với giá trị tuyệt đối

Lưu ý: Diện tích luôn dương! Phải dùng trị tuyệt đối.

---
[topic: INTEGRALS]
[source: SGK Toán 12 - Thể tích vật thể tròn xoay]
[difficulty: APPLICATION]
[subTopic: toan_12_the_tich_vat_the_tron_xoay]
[relatedTopics: FUNCTIONS, VOLUME]

Thể tích vật thể tròn xoay:

Quay quanh trục $Ox$:
$$V = \pi \int_a^b [f(x)]^2 dx$$

Quay quanh trục $Oy$ (đổi biến):
$$V = \pi \int_c^d [g(y)]^2 dy$$

Thể tích giữa hai đường quay quanh $Ox$:
$$V = \pi \int_a^b |[f(x)]^2 - [g(x)]^2| dx$$

Ví dụ: Quay $y = \sqrt{x}$ quanh $Ox$ từ $x=0$ đến $x=4$:
$$V = \pi \int_0^4 x \, dx = \pi \cdot \frac{x^2}{2}\Big|_0^4 = 8\pi$$

---
[topic: INTEGRALS]
[source: Toán 12 - Tích phân lượng giác]
[difficulty: COMPREHENSION]
[subTopic: toan_12_tich_phan_luong_giac]

Tích phân hàm lượng giác:

Công thức hạ bậc:
- $\sin^2 x = \frac{1 - \cos 2x}{2}$
- $\cos^2 x = \frac{1 + \cos 2x}{2}$
- $\sin x \cos x = \frac{\sin 2x}{2}$

Các dạng thường gặp:
- $\int \sin^2 x \, dx = \frac{x}{2} - \frac{\sin 2x}{4} + C$
- $\int \cos^2 x \, dx = \frac{x}{2} + \frac{\sin 2x}{4} + C$
- $\int \sin^3 x \, dx$: tách $\sin^2 x \cdot \sin x = (1-\cos^2 x)\sin x$, đặt $t = \cos x$

---
[topic: INTEGRALS]
[source: Toán 12 - Mẹo thi: Tích phân]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_tich_phan]

Mẹo thi nhanh cho tích phân:

1. Nhận dạng $\int \frac{f'(x)}{f(x)} dx = \ln|f(x)| + C$
   Ví dụ: $\int \frac{2x}{x^2+1} dx = \ln(x^2+1) + C$

2. Tích phân đối xứng: nếu $f$ lẻ trên $[-a, a]$: $\int_{-a}^a f(x) dx = 0$

3. King's rule: $\int_a^b f(x) dx = \int_a^b f(a+b-x) dx$
   Dùng cho: $\int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x} dx = \frac{\pi}{4}$

4. Tách phân thức trước khi tích phân:
   $\frac{x^2+1}{x+1}$: chia đa thức trước

5. Tính nhanh: $\int_0^1 x^n(1-x)^m dx = \frac{n! \cdot m!}{(n+m+1)!}$

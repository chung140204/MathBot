# Vận dụng cao - Tích phân (INTEGRALS)

---
[topic: INTEGRALS]
[source: Vận dụng cao - Tích phân đặc biệt]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_tich_phan_dac_biet]

Dạng: Tính tích phân bằng kỹ thuật đặc biệt.

Kỹ thuật King's Rule:
$$\int_a^b f(x) dx = \int_a^b f(a + b - x) dx$$

Ứng dụng:
$$I = \int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x} dx$$
Đặt $x = \frac{\pi}{2} - t$:
$$I = \int_0^{\pi/2} \frac{\cos t}{\cos t + \sin t} dt$$
Cộng 2 vế: $2I = \int_0^{\pi/2} 1 \, dt = \frac{\pi}{2}$ → $I = \frac{\pi}{4}$

Tương tự: $\int_0^{\pi/2} \frac{\sin^n x}{\sin^n x + \cos^n x} dx = \frac{\pi}{4}$ với mọi $n > 0$

---
[topic: INTEGRALS]
[source: Vận dụng cao - Tích phân chứa tham số]
[difficulty: ADVANCED]
[subTopic: van_dung_cao_tich_phan_chua_tham_so]

Dạng: Tìm $m$ để $\int_a^b f(x, m) dx = k$.

Phương pháp:
1. Tính tích phân (kết quả là hàm theo $m$)
2. Giải phương trình/bất phương trình theo $m$

Ví dụ: Tìm $m > 0$ để $\int_0^m (3x^2 - 2mx) dx = 0$
$$\left[x^3 - mx^2\right]_0^m = m^3 - m^3 = 0$$
→ Đúng với mọi $m > 0$ (bẫy! kiểm tra lại đề)

Dạng khó hơn: Tìm $m$ để $S = \int_0^1 |x^2 - mx| dx$ nhỏ nhất
- Xét 2 TH: $0 \leq m \leq 1$ và $m > 1$
- Tính $S(m)$ cho mỗi TH, khảo sát tìm min

---
[topic: INTEGRALS]
[source: Vận dụng cao - Diện tích và thể tích phức tạp]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_dien_tich_va_the_tich_phuc_]
[relatedTopics: FUNCTIONS, ANALYTIC_GEOMETRY]

Diện tích giới hạn bởi nhiều đường:

Phương pháp:
1. Vẽ phác đồ thị (hoặc xác định vị trí tương đối)
2. Tìm tất cả giao điểm
3. Tách thành từng vùng, tính diện tích từng phần

Ví dụ: Diện tích giới hạn bởi $y = x^2$ và $y = 2x - x^2$
- Giao: $x^2 = 2x - x^2 \Rightarrow 2x^2 - 2x = 0 \Rightarrow x = 0, 1$
- $S = \int_0^1 |(2x - x^2) - x^2| dx = \int_0^1 (2x - 2x^2) dx$
- $= \left[x^2 - \frac{2x^3}{3}\right]_0^1 = 1 - \frac{2}{3} = \frac{1}{3}$

Thể tích tròn xoay nâng cao:
$$V = \pi \int_a^b |[f(x)]^2 - [g(x)]^2| dx$$

---
[topic: INTEGRALS]
[source: Vận dụng cao - Tích phân từng phần nhiều lần]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_tich_phan_tung_phan_nhieu_l]

Dạng: Tích phân cần từng phần 2-3 lần hoặc quay vòng.

Quay vòng (cyclic):
$$I = \int e^x \sin x \, dx$$
- Từng phần 2 lần: $I = e^x \sin x - e^x \cos x - I$
- $2I = e^x(\sin x - \cos x)$
- $I = \frac{e^x(\sin x - \cos x)}{2} + C$

Công thức truy hồi:
$$I_n = \int_0^{\pi/2} \sin^n x \, dx$$
- $I_n = \frac{n-1}{n} I_{n-2}$
- $I_0 = \frac{\pi}{2}$, $I_1 = 1$
- $I_4 = \frac{3}{4} \cdot \frac{1}{2} \cdot \frac{\pi}{2} = \frac{3\pi}{16}$

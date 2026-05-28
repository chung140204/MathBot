# Đề thi VDC - Tích phân ứng dụng (INTEGRALS)

---
[topic: INTEGRALS]
[source: THPT QG 2024 - VDC Thể tích khối tròn xoay]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2024_vdc_the_tich_khoi_tron_xoay]
[relatedTopics: FUNCTIONS, VOLUME]

Bài: Cho hình phẳng $(H)$ giới hạn bởi $y = \sqrt{x}$, $y = 0$, $x = 4$. Tính thể tích vật thể tròn xoay khi quay $(H)$ quanh trục $Ox$.

Lời giải:
$$V = \pi \int_0^4 (\sqrt{x})^2 dx = \pi \int_0^4 x \, dx = \pi \cdot \frac{x^2}{2}\Big|_0^4 = 8\pi$$

Dạng nâng cao: Quay quanh trục $Oy$:
$x = y^2$ (đổi biến), $y$ từ $0$ đến $2$
$$V = \pi \int_0^2 (4^2 - (y^2)^2) dy = \pi \int_0^2 (16 - y^4) dy = \pi \left[16y - \frac{y^5}{5}\right]_0^2 = \frac{128\pi}{5}$$

---
[topic: INTEGRALS]
[source: THPT QG 2023 - VDC Diện tích giữa hai đường cong]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2023_vdc_dien_tich_giua_hai_duon]
[relatedTopics: FUNCTIONS, ANALYTIC_GEOMETRY]

Bài: Tính diện tích hình phẳng giới hạn bởi $y = x^2 - 1$ và $y = x + 1$.

Lời giải:
Giao điểm: $x^2 - 1 = x + 1 \Rightarrow x^2 - x - 2 = 0 \Rightarrow x = -1, x = 2$

Trên $[-1, 2]$: $x + 1 \geq x^2 - 1$ (thử $x = 0$: $1 > -1$ ✓)

$$S = \int_{-1}^2 [(x+1) - (x^2-1)] dx = \int_{-1}^2 (-x^2 + x + 2) dx$$

$$= \left[-\frac{x^3}{3} + \frac{x^2}{2} + 2x\right]_{-1}^2 = \left(-\frac{8}{3} + 2 + 4\right) - \left(\frac{1}{3} + \frac{1}{2} - 2\right) = \frac{9}{2}$$

---
[topic: INTEGRALS]
[source: THPT QG 2022 - VDC Tích phân chứa tham số]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2022_vdc_tich_phan_chua_tham_so]

Bài: Tìm $m$ để $\int_0^1 |x^2 - m| dx$ đạt giá trị nhỏ nhất.

Lời giải:
Đặt $I(m) = \int_0^1 |x^2 - m| dx$

TH1: $m \leq 0$ → $|x^2 - m| = x^2 - m$ trên $[0,1]$
$I(m) = \frac{1}{3} - m$ → giảm theo $m$ → min khi $m = 0$: $I = \frac{1}{3}$

TH2: $0 < m < 1$ → $x^2 = m$ tại $x = \sqrt{m} \in (0,1)$
$$I(m) = \int_0^{\sqrt{m}} (m - x^2) dx + \int_{\sqrt{m}}^1 (x^2 - m) dx$$
$$= \frac{4m\sqrt{m}}{3} - m + \frac{1}{3}$$

$I'(m) = 2\sqrt{m} - 1 = 0 \Rightarrow m = \frac{1}{4}$

$I(\frac{1}{4}) = \frac{4 \cdot \frac{1}{4} \cdot \frac{1}{2}}{3} - \frac{1}{4} + \frac{1}{3} = \frac{1}{4}$

TH3: $m \geq 1$ → $I(m) = m - \frac{1}{3}$ → tăng → min khi $m = 1$: $I = \frac{2}{3}$

So sánh: $I(\frac{1}{4}) = \frac{1}{4} < \frac{1}{3} < \frac{2}{3}$

Vậy min $I$ đạt tại $m = \frac{1}{4}$.

Phương pháp: Chia TH theo vị trí $m$ so với $[0,1]$, tính $I(m)$ cho mỗi TH, khảo sát.

---
[topic: INTEGRALS]
[source: THPT QG 2021 - VDC Ứng dụng tích phân thực tế]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2021_vdc_ung_dung_tich_phan_thuc]
[relatedTopics: FUNCTIONS, VOLUME]

Bài: Một bể nước có tiết diện ngang hình tròn bán kính $R = 2$ (m). Mực nước cao $h$ (m). Tính thể tích nước trong bể.

Lời giải:
Bể nằm ngang, tiết diện tròn: $x^2 + y^2 = 4$

Mực nước cao $h$ tính từ đáy → mặt nước ở $y = h - 2$ (gốc tại tâm tròn).

Diện tích mặt cắt tại $y$: dây cung dài $2\sqrt{4 - y^2}$

$$V = L \cdot \int_{-2}^{h-2} 2\sqrt{4 - y^2} \, dy$$

Đặt $y = 2\sin t$:
$$\int 2\sqrt{4 - y^2} \, dy = \int 4\cos^2 t \, dt = 2t + \sin 2t + C$$

Thay cận và nhân với chiều dài $L$ của bể.

Phương pháp: Thiết lập tích phân từ bài toán thực tế → đổi biến lượng giác.

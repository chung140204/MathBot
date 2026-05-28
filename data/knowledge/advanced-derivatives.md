# Vận dụng cao - Đạo hàm và Hàm số (DERIVATIVES)

---
[topic: DERIVATIVES]
[source: Vận dụng cao - Bài toán cực trị có tham số]
[difficulty: ADVANCED]
[subTopic: van_dung_cao_bai_toan_cuc_tri_co_tham_so]
[relatedTopics: FUNCTIONS]

Dạng: Tìm m để hàm $y = f(x, m)$ có cực đại, cực tiểu thỏa điều kiện.

Phương pháp:
1. Tính $y' = 0$ → nghiệm $x_1, x_2$ theo $m$
2. Điều kiện có 2 cực trị: $\Delta_{y'} > 0$ (hoặc $y'$ đổi dấu)
3. Tính $y_{CĐ}, y_{CT}$ theo $m$
4. Áp dụng điều kiện đề bài → giải tìm $m$

Ví dụ: Tìm $m$ để $y = x^3 - 3mx + 2$ có cực đại, cực tiểu và $y_{CĐ} \cdot y_{CT} < 0$
- $y' = 3x^2 - 3m = 0 \Rightarrow x = \pm\sqrt{m}$ (cần $m > 0$)
- $y_{CĐ} = 2 + 2m\sqrt{m}$, $y_{CT} = 2 - 2m\sqrt{m}$
- $(2 + 2m\sqrt{m})(2 - 2m\sqrt{m}) < 0$
- $4 - 4m^3 < 0 \Rightarrow m > 1$

---
[topic: DERIVATIVES]
[source: Vận dụng cao - Tiếp tuyến và khoảng cách]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_tiep_tuyen_va_khoang_cach]
[relatedTopics: ANALYTIC_GEOMETRY]

Dạng: Viết phương trình tiếp tuyến thỏa điều kiện khoảng cách, diện tích.

Kỹ thuật:
- Tiếp tuyến tại $M(x_0, f(x_0))$: $y = f'(x_0)(x - x_0) + f(x_0)$
- Giao với Ox: $x_A = x_0 - \frac{f(x_0)}{f'(x_0)}$
- Giao với Oy: $y_B = f(x_0) - x_0 f'(x_0)$
- Diện tích tam giác OAB: $S = \frac{1}{2}|x_A \cdot y_B|$

Ví dụ: Tiếp tuyến $y = \frac{1}{x}$ tạo tam giác nhỏ nhất với 2 trục tọa độ:
- $y' = -\frac{1}{x_0^2}$, tiếp tuyến: $y = -\frac{1}{x_0^2}(x - x_0) + \frac{1}{x_0}$
- $S = \frac{1}{2} \cdot 2x_0 \cdot \frac{2}{x_0} = 2$ (không phụ thuộc $x_0$!)

---
[topic: DERIVATIVES]
[source: Vận dụng cao - Đếm số nghiệm phương trình]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_dem_so_nghiem_phuong_trinh]

Dạng: Tìm $m$ để phương trình $f(x) = g(m)$ có đúng $k$ nghiệm.

Phương pháp đồ thị:
1. Khảo sát $y = f(x)$: tính $f'$, bảng biến thiên
2. Kẻ đường $y = g(m)$ trên BBT
3. Đếm số giao điểm theo giá trị $m$

Dạng nâng cao: $f(x) = m$ có $k$ nghiệm phân biệt trên đoạn $[a, b]$
- Khảo sát $f$ trên $[a, b]$
- Tìm GTLN, GTNN trên $[a, b]$
- Số nghiệm phụ thuộc vị trí $m$ so với cực trị

Mẹo: Nếu PT dạng $f(x) = m \cdot g(x)$ → chia 2 vế: $\frac{f(x)}{g(x)} = m$ (chú ý ĐK $g(x) \neq 0$)

---
[topic: DERIVATIVES]
[source: Vận dụng cao - Min/Max biểu thức phức tạp]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_min_max_bieu_thuc_phuc_tap]

Dạng: Tìm GTLN/GTNN của biểu thức phức tạp.

Kỹ thuật đặt ẩn phụ:
- Đặt $t = f(x)$, xác định miền giá trị $t \in [a, b]$
- Biểu diễn biểu thức cần tìm theo $t$
- Khảo sát hàm 1 biến $t$ trên $[a, b]$

Kỹ thuật dùng BĐT:
- AM-GM: $a + b \geq 2\sqrt{ab}$
- Cauchy-Schwarz: $(a^2 + b^2)(c^2 + d^2) \geq (ac + bd)^2$
- Bunhiacopxki cho tích phân: $\left(\int fg\right)^2 \leq \int f^2 \cdot \int g^2$

Ví dụ: Tìm min $P = \frac{x^2 + 2}{\sqrt{x^2 + 1}}$
- Đặt $t = \sqrt{x^2 + 1} \geq 1$, thì $x^2 = t^2 - 1$
- $P = \frac{t^2 + 1}{t} = t + \frac{1}{t} \geq 2$ (AM-GM, đẳng thức khi $t = 1$, tức $x = 0$)

---
[topic: DERIVATIVES]
[source: Vận dụng cao - Hàm hợp và đồ thị f'(x)]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_ham_hop_va_do_thi_f_x]
[relatedTopics: FUNCTIONS]

Dạng: Cho đồ thị $f'(x)$, xét tính đơn điệu/cực trị của $g(x) = f(h(x))$.

Phương pháp:
- $g'(x) = f'(h(x)) \cdot h'(x)$
- $g'(x) = 0$ khi $f'(h(x)) = 0$ hoặc $h'(x) = 0$
- Xét dấu $g'(x)$ = tích dấu của $f'(h(x))$ và $h'(x)$

Ví dụ: $g(x) = f(x^2 - 2x)$, biết $f'(t) = 0$ khi $t = -1, 3$
- $g'(x) = f'(x^2 - 2x) \cdot (2x - 2)$
- $g'(x) = 0$: giải $x^2 - 2x = -1$ và $x^2 - 2x = 3$ và $x = 1$
- $x^2 - 2x = -1 \Rightarrow x = 1$
- $x^2 - 2x = 3 \Rightarrow x = 3$ hoặc $x = -1$
- Nghiệm: $x \in \{-1, 1, 3\}$, xét dấu $g'$ trên từng khoảng

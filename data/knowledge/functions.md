# Khảo sát hàm số (FUNCTIONS)

---
[topic: FUNCTIONS]
[source: SGK Toán 12 - Sơ đồ khảo sát hàm số]
[difficulty: COMPREHENSION]
[subTopic: toan_12_so_do_khao_sat_ham_so]
[relatedTopics: DERIVATIVES]

Sơ đồ khảo sát hàm số:
1. Tập xác định
2. Sự biến thiên:
   - Giới hạn, tiệm cận
   - Đạo hàm $f'(x)$, nghiệm, bảng biến thiên
   - Cực trị
3. Đồ thị:
   - Giao với trục tọa độ
   - Điểm đặc biệt
   - Vẽ đồ thị

---
[topic: FUNCTIONS]
[source: SGK Toán 12 - Hàm bậc 3]
[difficulty: COMPREHENSION]
[subTopic: toan_12_ham_bac_3]
[relatedTopics: DERIVATIVES]

Hàm bậc 3: $y = ax^3 + bx^2 + cx + d$ $(a \neq 0)$

- TXĐ: $\mathbb{R}$
- $\lim_{x \to +\infty} y = +\infty$ và $\lim_{x \to -\infty} y = -\infty$ (khi $a > 0$)
- $y' = 3ax^2 + 2bx + c$
- $\Delta_{y'} = 4b^2 - 12ac$
  - $\Delta_{y'} > 0$: có 2 cực trị
  - $\Delta_{y'} \leq 0$: không có cực trị, hàm đơn điệu
- Điểm uốn: $x = -\frac{b}{3a}$, là tâm đối xứng của đồ thị

---
[topic: FUNCTIONS]
[source: SGK Toán 12 - Hàm bậc 4 trùng phương]
[difficulty: COMPREHENSION]
[subTopic: toan_12_ham_bac_4_trung_phuong]
[relatedTopics: DERIVATIVES]

Hàm bậc 4 trùng phương: $y = ax^4 + bx^2 + c$ $(a \neq 0)$

- TXĐ: $\mathbb{R}$
- Đồ thị nhận $Oy$ làm trục đối xứng (hàm chẵn)
- $y' = 4ax^3 + 2bx = 2x(2ax^2 + b)$
- Cực trị:
  - Luôn có $y'(0) = 0$ → $x = 0$ là cực trị
  - Nếu $ab < 0$: thêm 2 cực trị tại $x = \pm\sqrt{-\frac{b}{2a}}$
  - Nếu $ab \geq 0$: chỉ có 1 cực trị tại $x = 0$

---
[topic: FUNCTIONS]
[source: SGK Toán 12 - Hàm phân thức bậc nhất/bậc nhất]
[difficulty: COMPREHENSION]
[subTopic: toan_12_ham_phan_thuc_bac_nhat_bac_nhat]

Hàm phân thức: $y = \frac{ax + b}{cx + d}$ $(c \neq 0, ad - bc \neq 0)$

- TXĐ: $\mathbb{R} \setminus \{-\frac{d}{c}\}$
- TCĐ: $x = -\frac{d}{c}$
- TCN: $y = \frac{a}{c}$
- $y' = \frac{ad - bc}{(cx+d)^2}$
  - $ad - bc > 0$: đồng biến trên mỗi khoảng TXĐ
  - $ad - bc < 0$: nghịch biến trên mỗi khoảng TXĐ
- Không có cực trị
- Tâm đối xứng: $I(-\frac{d}{c}, \frac{a}{c})$ (giao 2 tiệm cận)

---
[topic: FUNCTIONS]
[source: SGK Toán 12 - Hàm phân thức bậc hai/bậc nhất]
[difficulty: COMPREHENSION]
[subTopic: toan_12_ham_phan_thuc_bac_hai_bac_nhat]

Hàm phân thức: $y = \frac{ax^2 + bx + c}{dx + e}$ $(d \neq 0)$

Cách khảo sát:
1. TXĐ: $\mathbb{R} \setminus \{-\frac{e}{d}\}$
2. TCĐ: $x = -\frac{e}{d}$
3. Tiệm cận xiên: chia đa thức $y = (mx + n) + \frac{r}{dx + e}$
   - TCX: $y = mx + n$
4. $y' = 0$ → giải tìm cực trị

Đặc biệt: Đồ thị nhận giao điểm 2 tiệm cận làm tâm đối xứng.

---
[topic: FUNCTIONS]
[source: Toán 12 - Nhận dạng đồ thị]
[difficulty: COMPREHENSION]
[subTopic: toan_12_nhan_dang_do_thi]
[relatedTopics: DERIVATIVES]

Nhận dạng đồ thị hàm số (dạng trắc nghiệm):

Hàm bậc 3 $y = ax^3 + ...$:
- $a > 0$: đầu trái xuống, đầu phải lên
- $a < 0$: đầu trái lên, đầu phải xuống
- Có 2 cực trị ↔ đồ thị có "gờ" (1 đỉnh + 1 đáy)

Hàm bậc 4 $y = ax^4 + ...$:
- $a > 0$: hai đầu đi lên
- $a < 0$: hai đầu đi xuống
- Trùng phương: đối xứng qua $Oy$

Hàm phân thức $y = \frac{ax+b}{cx+d}$:
- Có 2 tiệm cận vuông góc
- Đồ thị là hyperbol, 2 nhánh đối xứng qua tâm $I$

---
[topic: FUNCTIONS]
[source: Toán 12 - Tương giao đồ thị với đường thẳng]
[difficulty: APPLICATION]
[subTopic: toan_12_tuong_giao_do_thi_voi_duong_than]
[relatedTopics: DERIVATIVES]

Số giao điểm đồ thị $y = f(x)$ với đường $y = m$:

Phương pháp: Số nghiệm PT $f(x) = m$ = số giao điểm

Dựa vào bảng biến thiên:
- Kẻ đường $y = m$ nằm ngang
- Đếm số lần cắt đồ thị/bảng biến thiên

Hàm bậc 3 (có CĐ, CT):
- $m > y_{CĐ}$ hoặc $m < y_{CT}$: 1 nghiệm
- $m = y_{CĐ}$ hoặc $m = y_{CT}$: 2 nghiệm
- $y_{CT} < m < y_{CĐ}$: 3 nghiệm

---
[topic: FUNCTIONS]
[source: Toán 12 - Biện luận phương trình chứa tham số]
[difficulty: COMPREHENSION]
[subTopic: toan_12_bien_luan_phuong_trinh_chua_tham]
[relatedTopics: DERIVATIVES]

Biện luận số nghiệm PT chứa tham số $m$:

Bước 1: Biến đổi PT về dạng $g(x) = m$ (tách $m$ ra 1 vế)
Bước 2: Khảo sát hàm $y = g(x)$ (tính $g'$, bảng biến thiên)
Bước 3: Dựa vào bảng biến thiên, kết luận:
- Số nghiệm PT theo giá trị của $m$

Lưu ý: Nếu không tách được $m$, dùng phương pháp:
- Đặt ẩn phụ $t = f(x)$
- Xét hàm $h(x) = f(x) - m$ và đếm số lần $h$ đổi dấu

---
[topic: FUNCTIONS]
[source: Toán 12 - Mẹo thi: Hàm số]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_ham_so]
[relatedTopics: DERIVATIVES]

Mẹo thi nhanh cho hàm số:

1. Hàm bậc 3 $y = ax^3 + bx^2 + cx + d$ đồng biến trên $\mathbb{R}$:
   $\Delta_{y'} \leq 0 \Leftrightarrow b^2 - 3ac \leq 0$

2. Đồ thị hàm $y = |f(x)|$: lấy phần $f(x) \geq 0$ giữ nguyên, phần $f(x) < 0$ lật lên

3. Đồ thị hàm $y = f(|x|)$: giữ phần $x \geq 0$, đối xứng qua $Oy$

4. Đếm nghiệm PT $|f(x)| = m$: số giao điểm $y = |f(x)|$ và $y = m \geq 0$

5. Cực trị hàm $y = f(u(x))$: $y' = f'(u) \cdot u'(x) = 0$ → giải cả $f'(u) = 0$ và $u'(x) = 0$

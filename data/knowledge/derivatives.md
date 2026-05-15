# Đạo hàm (DERIVATIVES)

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Công thức đạo hàm cơ bản]

Bảng đạo hàm cơ bản:
- $(C)' = 0$ (hằng số)
- $(x^n)' = nx^{n-1}$
- $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$
- $(\frac{1}{x})' = -\frac{1}{x^2}$
- $(e^x)' = e^x$
- $(a^x)' = a^x \ln a$
- $(\ln x)' = \frac{1}{x}$
- $(\log_a x)' = \frac{1}{x \ln a}$
- $(\sin x)' = \cos x$
- $(\cos x)' = -\sin x$
- $(\tan x)' = \frac{1}{\cos^2 x}$
- $(\cot x)' = -\frac{1}{\sin^2 x}$

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Quy tắc đạo hàm]

Quy tắc tính đạo hàm:
- $(u + v)' = u' + v'$
- $(u - v)' = u' - v'$
- $(ku)' = ku'$ (k là hằng số)
- $(uv)' = u'v + uv'$ (đạo hàm tích)
- $\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$ (đạo hàm thương)
- $(f(u))' = f'(u) \cdot u'$ (đạo hàm hàm hợp)

Ví dụ đạo hàm hàm hợp:
- $(\sin 2x)' = 2\cos 2x$
- $(e^{3x})' = 3e^{3x}$
- $(\ln(x^2+1))' = \frac{2x}{x^2+1}$

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Đạo hàm cấp hai]

Đạo hàm cấp hai: $f''(x) = (f'(x))'$

Ý nghĩa:
- $f''(x) > 0$: đồ thị lõm (bề lõm hướng lên)
- $f''(x) < 0$: đồ thị lồi (bề lõm hướng xuống)
- Điểm uốn: $f''(x) = 0$ và $f''$ đổi dấu

Ví dụ: $f(x) = x^3 - 3x$
- $f'(x) = 3x^2 - 3$
- $f''(x) = 6x$
- Điểm uốn tại $x = 0$

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Ứng dụng: Tính đơn điệu]

Tính đơn điệu của hàm số:
- Hàm số đồng biến trên $(a,b)$ khi $f'(x) > 0$ với mọi $x \in (a,b)$
- Hàm số nghịch biến trên $(a,b)$ khi $f'(x) < 0$ với mọi $x \in (a,b)$

Phương pháp xét tính đơn điệu:
1. Tính $f'(x)$
2. Giải $f'(x) = 0$ → tìm nghiệm
3. Lập bảng xét dấu $f'(x)$
4. Kết luận khoảng đồng biến/nghịch biến

Ví dụ: $f(x) = x^3 - 3x + 2$
- $f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$
- $f'(x) = 0 \Leftrightarrow x = \pm 1$
- Đồng biến trên $(-\infty, -1)$ và $(1, +\infty)$
- Nghịch biến trên $(-1, 1)$

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Ứng dụng: Cực trị]

Cực trị hàm số:
- Cực đại tại $x_0$: $f'(x)$ đổi dấu từ $+$ sang $-$ khi qua $x_0$
- Cực tiểu tại $x_0$: $f'(x)$ đổi dấu từ $-$ sang $+$ khi qua $x_0$

Điều kiện cần: $f'(x_0) = 0$ hoặc $f'(x_0)$ không tồn tại

Quy tắc 2 (dùng đạo hàm cấp 2):
- Nếu $f'(x_0) = 0$ và $f''(x_0) < 0$ → cực đại
- Nếu $f'(x_0) = 0$ và $f''(x_0) > 0$ → cực tiểu

Số cực trị của hàm bậc 3 $y = ax^3 + bx^2 + cx + d$:
- Có 2 cực trị khi $\Delta_{f'} = b^2 - 3ac > 0$
- Không có cực trị khi $\Delta_{f'} \leq 0$

---
[topic: DERIVATIVES]
[source: SGK Toán 12 - Ứng dụng: GTLN GTNN]

Giá trị lớn nhất, nhỏ nhất trên đoạn $[a,b]$:

Phương pháp:
1. Tính $f'(x)$, giải $f'(x) = 0$ trên $(a,b)$ → được $x_1, x_2, ...$
2. Tính $f(a), f(b), f(x_1), f(x_2), ...$
3. So sánh: giá trị lớn nhất = max, nhỏ nhất = min

Công thức nhanh cho hàm bậc 2 $f(x) = ax^2 + bx + c$ trên $[a,b]$:
- Đỉnh parabol tại $x = -\frac{b}{2a}$
- Nếu đỉnh nằm trong $[a,b]$ → so sánh 3 giá trị
- Nếu đỉnh nằm ngoài → so sánh $f(a)$ và $f(b)$

---
[topic: DERIVATIVES]
[source: Toán 12 - Tiệm cận đồ thị]

Tiệm cận:
- Tiệm cận đứng $x = a$: $\lim_{x \to a} f(x) = \pm\infty$
- Tiệm cận ngang $y = b$: $\lim_{x \to \pm\infty} f(x) = b$
- Tiệm cận xiên $y = kx + m$: $k = \lim_{x \to \infty}\frac{f(x)}{x}$, $m = \lim_{x \to \infty}(f(x) - kx)$

Hàm phân thức $y = \frac{ax+b}{cx+d}$:
- TCĐ: $x = -\frac{d}{c}$
- TCN: $y = \frac{a}{c}$
- Tâm đối xứng: giao 2 tiệm cận $I(-\frac{d}{c}, \frac{a}{c})$

Hàm $y = \frac{ax^2+bx+c}{dx+e}$:
- TCĐ: $x = -\frac{e}{d}$
- Tiệm cận xiên (chia đa thức)

---
[topic: DERIVATIVES]
[source: Toán 12 - Đồ thị hàm bậc 3]

Khảo sát hàm bậc 3: $y = ax^3 + bx^2 + cx + d$

Dạng đồ thị:
- $a > 0$: đi từ $-\infty$ lên $+\infty$
- $a < 0$: đi từ $+\infty$ xuống $-\infty$
- Có 2 cực trị khi $b^2 - 3ac > 0$
- Điểm uốn: $I(-\frac{b}{3a}, f(-\frac{b}{3a}))$ — trung điểm của 2 cực trị

Tính chất quan trọng:
- Đồ thị nhận điểm uốn làm tâm đối xứng
- $y_{CĐ} + y_{CT} = 2y_I$ (y điểm uốn)
- Khoảng cách 2 cực trị: dùng công thức khoảng cách 2 điểm

---
[topic: DERIVATIVES]
[source: Toán 12 - Đồ thị hàm bậc 4 trùng phương]

Khảo sát hàm bậc 4 trùng phương: $y = ax^4 + bx^2 + c$

Đặt $t = x^2 \geq 0$: $y = at^2 + bt + c$

Các trường hợp ($a > 0$):
- $b \geq 0$: hàm chỉ có 1 cực tiểu tại $x = 0$
- $b < 0$: hàm có 1 cực đại ($x=0$) và 2 cực tiểu ($x = \pm\sqrt{-\frac{b}{2a}}$)

Tính chất:
- Đồ thị nhận trục $Oy$ làm trục đối xứng
- $y'(x) = 4ax^3 + 2bx = 2x(2ax^2 + b)$

---
[topic: DERIVATIVES]
[source: Toán 12 - Bài toán tương giao]

Bài toán tương giao: Tìm $m$ để phương trình $f(x) = m$ có $k$ nghiệm.

Phương pháp: Vẽ đồ thị $y = f(x)$ và đường thẳng $y = m$, đếm giao điểm.

Quy tắc:
- Số nghiệm = số giao điểm giữa $y = f(x)$ và $y = m$
- Đường $y = m$ cắt đồ thị tại $k$ điểm ↔ PT có $k$ nghiệm

Với hàm bậc 3 có 2 cực trị ($y_{CT} < y_{CĐ}$):
- $m < y_{CT}$ hoặc $m > y_{CĐ}$: 1 nghiệm
- $m = y_{CT}$ hoặc $m = y_{CĐ}$: 2 nghiệm
- $y_{CT} < m < y_{CĐ}$: 3 nghiệm

---
[topic: DERIVATIVES]
[source: Toán 12 - Bài toán tiếp tuyến]

Phương trình tiếp tuyến tại điểm $M(x_0, y_0)$:
$$y = f'(x_0)(x - x_0) + y_0$$

Các dạng bài:
1. Tiếp tuyến tại điểm trên đồ thị: thay $x_0$ vào $f'(x_0)$
2. Tiếp tuyến có hệ số góc $k$: giải $f'(x_0) = k$
3. Tiếp tuyến đi qua điểm $A(a,b)$ ngoài đồ thị:
   - Viết PT tiếp tuyến tại $M(x_0, f(x_0))$
   - Thay $A(a,b)$ vào → giải tìm $x_0$

Số tiếp tuyến = số nghiệm $x_0$ tìm được.

---
[topic: DERIVATIVES]
[source: Toán 12 - Đạo hàm trong bài toán thực tế]

Bài toán tối ưu (GTLN/GTNN thực tế):

Phương pháp:
1. Đặt biến số, xác định miền xác định
2. Biểu diễn đại lượng cần tối ưu theo biến đã chọn
3. Tìm GTLN/GTNN trên miền xác định

Các dạng thường gặp:
- Cắt tấm tôn gấp hộp có thể tích lớn nhất
- Chia đoạn thành các phần để tổng/tích đạt max/min
- Chi phí sản xuất nhỏ nhất
- Quãng đường, vận tốc tối ưu

Lưu ý: Luôn kiểm tra đáp án có thuộc miền xác định không.

---
[topic: DERIVATIVES]
[source: Toán 12 - Mẹo thi: Đạo hàm]

Mẹo thi nhanh cho đạo hàm:

1. Đếm số cực trị từ đồ thị $f'(x)$: đếm số lần $f'$ đổi dấu (cắt trục Ox)
2. Từ đồ thị $f'(x)$ suy ra $f(x)$:
   - $f' > 0$ → $f$ tăng
   - $f' < 0$ → $f$ giảm
   - $f' = 0$ và đổi dấu → cực trị

3. Hàm $y = |f(x)|$: cực trị tại điểm $f(x) = 0$ (nếu $f'$ đổi dấu) và tại cực trị của $f$ (nếu $f > 0$ hoặc $f < 0$)

4. Bất đẳng thức dùng đạo hàm: chứng minh $f(x) \geq g(x)$ bằng cách xét $h(x) = f(x) - g(x)$, tìm GTNN $h$ ≥ 0

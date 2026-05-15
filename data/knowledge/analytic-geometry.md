# Hình học giải tích Oxy (ANALYTIC_GEOMETRY)

---
[topic: ANALYTIC_GEOMETRY]
[source: SGK Toán 12 - Phương trình đường thẳng]

Phương trình đường thẳng trong Oxy:

Dạng tổng quát: $ax + by + c = 0$ (với $a^2 + b^2 \neq 0$)
- VTPT: $\vec{n} = (a, b)$
- VTCP: $\vec{u} = (-b, a)$

Dạng chính tắc: $\frac{x - x_0}{a_1} = \frac{y - y_0}{b_1}$
- Qua $M(x_0, y_0)$, VTCP $\vec{u} = (a_1, b_1)$

Dạng tham số: $\begin{cases} x = x_0 + a_1 t \\ y = y_0 + b_1 t \end{cases}$

Đường thẳng qua 2 điểm $A(x_1, y_1)$, $B(x_2, y_2)$:
$$\frac{x - x_1}{x_2 - x_1} = \frac{y - y_1}{y_2 - y_1}$$

---
[topic: ANALYTIC_GEOMETRY]
[source: SGK Toán 12 - Khoảng cách và góc]

Khoảng cách từ điểm $M(x_0, y_0)$ đến đường thẳng $ax + by + c = 0$:
$$d(M, \Delta) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}$$

Khoảng cách giữa 2 đường thẳng song song $ax + by + c_1 = 0$ và $ax + by + c_2 = 0$:
$$d = \frac{|c_1 - c_2|}{\sqrt{a^2 + b^2}}$$

Góc giữa 2 đường thẳng (VTPT $\vec{n_1}$, $\vec{n_2}$):
$$\cos\alpha = \frac{|\vec{n_1} \cdot \vec{n_2}|}{|\vec{n_1}| \cdot |\vec{n_2}|} = \frac{|a_1 a_2 + b_1 b_2|}{\sqrt{a_1^2+b_1^2} \cdot \sqrt{a_2^2+b_2^2}}$$

---
[topic: ANALYTIC_GEOMETRY]
[source: SGK Toán 12 - Phương trình đường tròn]

Phương trình đường tròn tâm $I(a,b)$, bán kính $R$:
$$(x-a)^2 + (y-b)^2 = R^2$$

Dạng khai triển: $x^2 + y^2 - 2ax - 2by + c = 0$
- Tâm: $I(a, b)$
- Bán kính: $R = \sqrt{a^2 + b^2 - c}$ (điều kiện $a^2 + b^2 - c > 0$)

Phương trình tiếp tuyến đường tròn tại $M(x_0, y_0)$:
$$(x_0 - a)(x - x_0) + (y_0 - b)(y - y_0) = 0$$

---
[topic: ANALYTIC_GEOMETRY]
[source: SGK Toán 12 - Vị trí tương đối đường thẳng và đường tròn]

Vị trí tương đối đường thẳng $\Delta$ và đường tròn $(C)$ tâm $I$ bán kính $R$:

Gọi $d = d(I, \Delta)$:
- $d > R$: không giao điểm (không cắt)
- $d = R$: tiếp xúc (1 điểm chung)
- $d < R$: cắt tại 2 điểm

Độ dài dây cung khi $d < R$:
$$AB = 2\sqrt{R^2 - d^2}$$

Tiếp tuyến từ điểm $M$ ngoài đường tròn:
- Độ dài đoạn tiếp tuyến: $MT = \sqrt{MI^2 - R^2}$

---
[topic: ANALYTIC_GEOMETRY]
[source: SGK Toán 12 - Phương trình elip]

Phương trình chính tắc elip: $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ ($a > b > 0$)

Các yếu tố:
- Đỉnh: $A_1(-a, 0)$, $A_2(a, 0)$, $B_1(0, -b)$, $B_2(0, b)$
- Tiêu điểm: $F_1(-c, 0)$, $F_2(c, 0)$ với $c^2 = a^2 - b^2$
- Tâm sai: $e = \frac{c}{a} < 1$
- Trục lớn $= 2a$, trục nhỏ $= 2b$, tiêu cự $= 2c$

Tính chất tiêu điểm: $MF_1 + MF_2 = 2a$ (với mọi $M$ trên elip)

---
[topic: ANALYTIC_GEOMETRY]
[source: Toán 12 - Phương trình parabol và hyperbol]

Parabol: $y^2 = 2px$ ($p > 0$)
- Đỉnh: $O(0,0)$
- Tiêu điểm: $F(\frac{p}{2}, 0)$
- Đường chuẩn: $x = -\frac{p}{2}$
- Tính chất: $MF = x_M + \frac{p}{2}$ (khoảng cách đến tiêu = khoảng cách đến chuẩn)

Hyperbol: $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$
- Tiêu điểm: $F_1(-c, 0)$, $F_2(c, 0)$ với $c^2 = a^2 + b^2$
- Tiệm cận: $y = \pm\frac{b}{a}x$
- Tính chất: $|MF_1 - MF_2| = 2a$

---
[topic: ANALYTIC_GEOMETRY]
[source: Toán 12 - Bài toán quỹ tích]

Các dạng quỹ tích thường gặp:

1. Tập hợp điểm cách đều 2 điểm: đường trung trực
2. Tập hợp điểm cách 1 điểm khoảng $R$: đường tròn
3. Tập hợp điểm nhìn đoạn thẳng dưới góc vuông: đường tròn đường kính
4. Tập hợp trung điểm dây cung: đường tròn nhỏ hơn

Ví dụ: Tìm quỹ tích trung điểm $M$ của $AB$ khi $A$ di chuyển trên đường tròn tâm $I$ bán kính $R$:
- $M$ là trung điểm $AB$ → $\vec{OM} = \frac{\vec{OA} + \vec{OB}}{2}$
- Quỹ tích $M$: đường tròn tâm là trung điểm $IB$, bán kính $\frac{R}{2}$

---
[topic: ANALYTIC_GEOMETRY]
[source: Toán 12 - Mẹo thi: Hình giải tích]

Mẹo thi nhanh:

1. Đường thẳng qua $A(x_1, y_1)$ hệ số góc $k$: $y - y_1 = k(x - x_1)$

2. Đường thẳng cắt trục hoành tại $A(a,0)$, trục tung tại $B(0,b)$: $\frac{x}{a} + \frac{y}{b} = 1$

3. Đối xứng điểm $M$ qua đường thẳng $\Delta$:
   - Tìm $M'$ sao cho $\Delta$ là trung trực $MM'$

4. Tìm điểm trên đường thẳng gần đường tròn nhất: hạ vuông góc từ tâm

5. Diện tích tam giác $A(x_1,y_1), B(x_2,y_2), C(x_3,y_3)$:
$$S = \frac{1}{2}|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)|$$

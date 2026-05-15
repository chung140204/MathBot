# Số phức (COMPLEX_NUMBERS)

---
[topic: COMPLEX_NUMBERS]
[source: SGK Toán 12 - Khái niệm số phức]

Số phức: $z = a + bi$ với $a, b \in \mathbb{R}$, $i^2 = -1$
- Phần thực: $\text{Re}(z) = a$
- Phần ảo: $\text{Im}(z) = b$
- Số phức liên hợp: $\bar{z} = a - bi$
- Mô-đun: $|z| = \sqrt{a^2 + b^2}$

Hai số phức bằng nhau: $a + bi = c + di \Leftrightarrow a = c$ và $b = d$

Biểu diễn hình học: $z = a + bi$ ↔ điểm $M(a, b)$ trên mặt phẳng phức

---
[topic: COMPLEX_NUMBERS]
[source: SGK Toán 12 - Phép tính số phức]

Phép tính trên số phức:
- Cộng: $(a+bi) + (c+di) = (a+c) + (b+d)i$
- Trừ: $(a+bi) - (c+di) = (a-c) + (b-d)i$
- Nhân: $(a+bi)(c+di) = (ac-bd) + (ad+bc)i$
- Chia: $\frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{c^2+d^2} = \frac{ac+bd}{c^2+d^2} + \frac{bc-ad}{c^2+d^2}i$

Tính chất:
- $z \cdot \bar{z} = |z|^2 = a^2 + b^2$
- $|z_1 \cdot z_2| = |z_1| \cdot |z_2|$
- $\overline{z_1 + z_2} = \bar{z_1} + \bar{z_2}$
- $\overline{z_1 \cdot z_2} = \bar{z_1} \cdot \bar{z_2}$

---
[topic: COMPLEX_NUMBERS]
[source: SGK Toán 12 - Phương trình bậc hai số phức]

Phương trình bậc hai $az^2 + bz + c = 0$ (hệ số thực):

$\Delta = b^2 - 4ac$
- $\Delta > 0$: 2 nghiệm thực phân biệt
- $\Delta = 0$: nghiệm kép thực
- $\Delta < 0$: 2 nghiệm phức liên hợp
  $$z = \frac{-b \pm i\sqrt{|\Delta|}}{2a}$$

Tính chất nghiệm phức: Nếu $z_0$ là nghiệm thì $\bar{z_0}$ cũng là nghiệm.

Hệ thức Viète: $z_1 + z_2 = -\frac{b}{a}$, $z_1 \cdot z_2 = \frac{c}{a}$

---
[topic: COMPLEX_NUMBERS]
[source: SGK Toán 12 - Lũy thừa của i]

Lũy thừa của $i$:
- $i^0 = 1$
- $i^1 = i$
- $i^2 = -1$
- $i^3 = -i$
- $i^4 = 1$ (chu kỳ 4)

Quy tắc: $i^n = i^{n \mod 4}$

Ví dụ: $i^{2023} = i^{4 \times 505 + 3} = i^3 = -i$

Công thức $(1+i)^2 = 2i$ → $(1+i)^{2n} = (2i)^n = 2^n \cdot i^n$

---
[topic: COMPLEX_NUMBERS]
[source: SGK Toán 12 - Biểu diễn hình học số phức]

Biểu diễn hình học:
- Số phức $z = a + bi$ ↔ điểm $M(a,b)$ ↔ vector $\vec{OM}$
- $|z|$ = khoảng cách từ $M$ đến gốc $O$
- $|z_1 - z_2|$ = khoảng cách giữa 2 điểm biểu diễn $z_1$ và $z_2$

Tập hợp điểm:
- $|z - z_0| = R$: đường tròn tâm $z_0$, bán kính $R$
- $|z - z_1| = |z - z_2|$: đường trung trực của đoạn $z_1 z_2$
- $|z - z_0| \leq R$: hình tròn tâm $z_0$, bán kính $R$

---
[topic: COMPLEX_NUMBERS]
[source: Toán 12 - Dạng lượng giác số phức]

Dạng lượng giác: $z = r(\cos\varphi + i\sin\varphi)$
- $r = |z|$ (mô-đun)
- $\varphi$ = argument (góc với trục thực)
- $\tan\varphi = \frac{b}{a}$

Nhân: $z_1 \cdot z_2 = r_1 r_2[\cos(\varphi_1+\varphi_2) + i\sin(\varphi_1+\varphi_2)]$

Chia: $\frac{z_1}{z_2} = \frac{r_1}{r_2}[\cos(\varphi_1-\varphi_2) + i\sin(\varphi_1-\varphi_2)]$

Công thức De Moivre:
$$z^n = r^n(\cos n\varphi + i\sin n\varphi)$$

---
[topic: COMPLEX_NUMBERS]
[source: Toán 12 - Bài toán GTLN GTNN mô-đun]

Tìm GTLN, GTNN của $|z|$ với điều kiện:

Phương pháp hình học: biểu diễn điều kiện trên mặt phẳng phức

Ví dụ: Tìm max/min $|z|$ biết $|z - 2 - i| = 3$
- Tập hợp điểm M: đường tròn tâm $I(2, 1)$, $R = 3$
- $|z|_{min} = OI - R = \sqrt{5} - 3$ (nếu $OI > R$)
- $|z|_{max} = OI + R = \sqrt{5} + 3$

Ví dụ: Tìm min $|z - 1 + 2i|$ biết $|z + 2 - i| = 1$
- Khoảng cách ngắn nhất từ điểm $A(1,-2)$ đến đường tròn tâm $B(-2,1)$ bán kính 1
- Min = $AB - R = \sqrt{9+9} - 1 = 3\sqrt{2} - 1$

---
[topic: COMPLEX_NUMBERS]
[source: Toán 12 - Mẹo thi: Số phức]

Mẹo thi nhanh cho số phức:

1. Nhân nhanh: $(a+bi)(a-bi) = a^2 + b^2$

2. Chia nhanh: nhân tử mẫu với liên hợp mẫu

3. Phương trình $z^2 = w$:
   - Đặt $z = x + yi$, khai triển, đồng nhất phần thực và ảo

4. $|z|^2 = z \cdot \bar{z}$: hữu ích khi biến đổi biểu thức

5. Điểm đối xứng qua trục thực: $z \to \bar{z}$
   Điểm đối xứng qua gốc O: $z \to -z$
   Điểm đối xứng qua trục ảo: $z \to -\bar{z}$

6. Quay điểm $z$ quanh gốc O góc $\alpha$: nhân với $e^{i\alpha} = \cos\alpha + i\sin\alpha$

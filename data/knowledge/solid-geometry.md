# Hình học không gian (SOLID_GEOMETRY)

---
[topic: SOLID_GEOMETRY]
[source: SGK Toán 12 - Quan hệ song song]
[difficulty: COMPREHENSION]
[subTopic: toan_12_quan_he_song_song]

Đường thẳng song song mặt phẳng:
- $d // (P) \Leftrightarrow d$ song song với 1 đường trong $(P)$
- $d // (P) \Leftrightarrow d \subset (Q)$ và $(P) // (Q)$

Hai mặt phẳng song song:
- $(P) // (Q) \Leftrightarrow (P)$ chứa 2 đường cắt nhau song song $(Q)$
- Nếu $(P) // (Q)$, mọi mp cắt $(P)$ đều cắt $(Q)$ và 2 giao tuyến song song

Định lý Thales: 3 mp song song cắt 2 đường thẳng tạo tỉ số bằng nhau

---
[topic: SOLID_GEOMETRY]
[source: SGK Toán 12 - Quan hệ vuông góc]
[difficulty: COMPREHENSION]
[subTopic: toan_12_quan_he_vuong_goc]

Đường thẳng vuông góc mặt phẳng:
- $d \perp (P) \Leftrightarrow d$ vuông góc với 2 đường cắt nhau trong $(P)$
- $d \perp (P)$ → $d$ vuông góc mọi đường trong $(P)$

Hai mặt phẳng vuông góc:
- $(P) \perp (Q) \Leftrightarrow (P)$ chứa đường thẳng vuông góc $(Q)$

Định lý 3 đường vuông góc:
- $a \subset (P)$, $b \perp (P)$ tại $H$, $c$ là hình chiếu của $a$ lên $(P)$
- Thì: $a \perp b$ (hiển nhiên), và $a \perp c \Leftrightarrow a \perp$ đường chiếu

---
[topic: SOLID_GEOMETRY]
[source: SGK Toán 12 - Góc giữa đường và mặt phẳng]
[difficulty: COMPREHENSION]
[subTopic: toan_12_goc_giua_duong_va_mat_phang]

Góc giữa đường thẳng $d$ và mặt phẳng $(P)$:
- = góc giữa $d$ và hình chiếu $d'$ của $d$ lên $(P)$
- $0° \leq \alpha \leq 90°$
- Nếu $d \perp (P)$: $\alpha = 90°$
- Nếu $d // (P)$ hoặc $d \subset (P)$: $\alpha = 0°$

Cách tìm:
1. Tìm hình chiếu $H$ của 1 điểm trên $d$ xuống $(P)$
2. Nối $H$ với chân $d$ trên $(P)$ → được $d'$
3. Góc cần tìm = góc$(d, d')$

Ví dụ: Chóp $S.ABC$, $SA \perp (ABC)$
- Góc $(SB, (ABC))$ = góc $\widehat{SBA}$
- $\tan\widehat{SBA} = \frac{SA}{AB}$

---
[topic: SOLID_GEOMETRY]
[source: SGK Toán 12 - Góc giữa hai mặt phẳng]
[difficulty: COMPREHENSION]
[subTopic: toan_12_goc_giua_hai_mat_phang]

Góc giữa 2 mặt phẳng $(P)$ và $(Q)$:
- = góc giữa 2 đường thẳng cùng vuông góc giao tuyến, mỗi đường nằm trong 1 mp
- $0° \leq \alpha \leq 90°$

Cách tìm:
1. Xác định giao tuyến $\Delta = (P) \cap (Q)$
2. Lấy điểm $I \in \Delta$
3. Trong $(P)$: dựng $a \perp \Delta$ tại $I$
4. Trong $(Q)$: dựng $b \perp \Delta$ tại $I$
5. Góc $(P, Q) = \widehat{(a, b)}$

---
[topic: SOLID_GEOMETRY]
[source: SGK Toán 12 - Khoảng cách]
[difficulty: COMPREHENSION]
[subTopic: toan_12_khoang_cach]
[relatedTopics: VOLUME]

Khoảng cách từ điểm đến mặt phẳng:
- $d(M, (P))$ = độ dài đoạn vuông góc từ $M$ hạ lên $(P)$
- Công thức: $d = \frac{3V}{S_{đáy}}$ (dùng thể tích)

Khoảng cách giữa 2 đường thẳng chéo nhau:
- = khoảng cách giữa 2 mp song song chứa 2 đường thẳng
- = khoảng cách từ 1 điểm trên đường này đến mp chứa đường kia (và song song đường này)

Khoảng cách giữa đường thẳng và mặt phẳng song song:
- = khoảng cách từ 1 điểm trên đường thẳng đến mặt phẳng

---
[topic: SOLID_GEOMETRY]
[source: Toán 12 - Phương pháp tọa độ không gian]
[difficulty: COMPREHENSION]
[subTopic: toan_12_phuong_phap_toa_do_khong_gian]

Hệ tọa độ Oxyz:

Vector: $\vec{a} = (a_1, a_2, a_3)$
- $|\vec{a}| = \sqrt{a_1^2 + a_2^2 + a_3^2}$
- $\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 + a_3 b_3$
- $\vec{a} \perp \vec{b} \Leftrightarrow \vec{a} \cdot \vec{b} = 0$

Tích có hướng: $\vec{a} \times \vec{b} = (a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1)$
- $\vec{a} \times \vec{b} \perp \vec{a}$ và $\perp \vec{b}$
- $|\vec{a} \times \vec{b}| = |\vec{a}||\vec{b}|\sin\theta$ = diện tích hình bình hành

---
[topic: SOLID_GEOMETRY]
[source: Toán 12 - PT mặt phẳng và đường thẳng trong Oxyz]
[difficulty: COMPREHENSION]
[subTopic: toan_12_pt_mat_phang_va_duong_thang_tron]

Phương trình mặt phẳng: $ax + by + cz + d = 0$
- VTPT: $\vec{n} = (a, b, c)$
- Khoảng cách từ $M(x_0, y_0, z_0)$: $d = \frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}$

Phương trình đường thẳng qua $M(x_0, y_0, z_0)$, VTCP $\vec{u} = (a, b, c)$:
$$\frac{x-x_0}{a} = \frac{y-y_0}{b} = \frac{z-z_0}{c}$$

Góc giữa đường thẳng (VTCP $\vec{u}$) và mặt phẳng (VTPT $\vec{n}$):
$$\sin\alpha = \frac{|\vec{u} \cdot \vec{n}|}{|\vec{u}||\vec{n}|}$$

---
[topic: SOLID_GEOMETRY]
[source: Toán 12 - Mặt cầu trong Oxyz]
[difficulty: COMPREHENSION]
[subTopic: toan_12_mat_cau_trong_oxyz]

Phương trình mặt cầu tâm $I(a,b,c)$ bán kính $R$:
$$(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$$

Dạng khai triển: $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$
- Tâm: $I(a, b, c)$
- Bán kính: $R = \sqrt{a^2 + b^2 + c^2 - d}$

Mặt phẳng tiếp xúc mặt cầu tại $M(x_0, y_0, z_0)$:
- Vuông góc với $\vec{IM}$
- PT: $(x_0-a)(x-x_0) + (y_0-b)(y-y_0) + (z_0-c)(z-z_0) = 0$

---
[topic: SOLID_GEOMETRY]
[source: Toán 12 - Thiết diện]
[difficulty: COMPREHENSION]
[subTopic: toan_12_thiet_dien]

Thiết diện (mặt cắt):
- Là giao của mặt phẳng cắt với khối đa diện
- Thiết diện luôn là đa giác

Cách xác định thiết diện:
1. Tìm giao điểm mp cắt với các cạnh
2. Nối các giao điểm theo thứ tự (trên cùng 1 mặt)
3. Dùng tính chất: giao 2 mp là đường thẳng

Thiết diện có diện tích lớn nhất:
- Hình chóp: thường đi qua 1 cạnh và trung điểm cạnh đối
- Hình lăng trụ: thiết diện song song cạnh bên

---
[topic: SOLID_GEOMETRY]
[source: Toán 12 - Mẹo thi: Hình không gian]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_hinh_khong_gian]
[relatedTopics: VOLUME]

Mẹo thi nhanh:

1. Tìm góc nhanh: dùng $\tan$ (không cần tính cạnh huyền)
   $\tan\alpha = \frac{\text{đối}}{\text{kề}}$

2. Khoảng cách bằng thể tích: $h = \frac{3V}{S}$

3. Hình chiếu vuông góc:
   - $SA \perp (ABC)$: chiếu mọi thứ xuống $(ABC)$, $A$ là chân đường cao

4. Dựng hệ tọa độ: chọn gốc tại đỉnh có 3 cạnh vuông góc đôi một

5. Góc nhị diện: tìm 2 đường cùng vuông góc giao tuyến, tính góc giữa chúng

6. Hai đường chéo nhau: khoảng cách = khoảng cách giữa 2 mp song song chứa chúng

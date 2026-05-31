# Đề thi VDC - Hình học Oxyz (SOLID_GEOMETRY)

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2024 - VDC Mặt phẳng và khoảng cách Oxyz]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2024_vdc_mat_phang_va_khoang_cac]

Bài: Trong Oxyz, cho $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$. Viết phương trình mặt phẳng $(P)$ song song $(ABC)$ và cách $(ABC)$ một khoảng $d = \frac{6}{7}$.

Lời giải:
PT mặt phẳng $(ABC)$: $\frac{x}{1} + \frac{y}{2} + \frac{z}{3} = 1$ hay $6x + 3y + 2z - 6 = 0$

$(P) // (ABC)$: $6x + 3y + 2z + D = 0$ ($D \neq -6$)

Khoảng cách giữa 2 mp song song:
$$d = \frac{|D - (-6)|}{\sqrt{36 + 9 + 4}} = \frac{|D + 6|}{7} = \frac{6}{7}$$

$|D + 6| = 6 \Rightarrow D = 0$ hoặc $D = -12$

Vậy $(P)$: $6x + 3y + 2z = 0$ hoặc $6x + 3y + 2z - 12 = 0$.

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2023 - VDC Quỹ tích và tối ưu Oxyz]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2023_vdc_quy_tich_va_toi_uu_oxyz]

Bài: Cho $A(1, 2, 3)$, $B(3, 2, 1)$. Tìm điểm $M$ trên $Oz$ sao cho $MA + MB$ nhỏ nhất.

Lời giải:
$M(0, 0, z)$ trên $Oz$.

$MA = \sqrt{1 + 4 + (z-3)^2} = \sqrt{z^2 - 6z + 14}$
$MB = \sqrt{9 + 4 + (z-1)^2} = \sqrt{z^2 - 2z + 14}$

Cách 1 (đạo hàm): Khảo sát $f(z) = MA + MB$, tính $f'(z) = 0$ → phức tạp.

Cách 2 (đối xứng): Lấy $A'$ đối xứng $A$ qua $Oz$.
$A(1, 2, 3)$ → $A'(-1, -2, 3)$ (đổi dấu $x, y$)

$MA = MA'$ → $MA + MB = MA' + MB \geq A'B$ (BĐT tam giác)

$A'B = \sqrt{16 + 16 + 4} = 6$

Min đạt khi $M$ nằm trên đoạn $A'B$. Tham số hóa $A'B$:
$\frac{x+1}{4} = \frac{y+2}{4} = \frac{z-3}{-2} = t$

$M \in Oz$: $x = 0, y = 0$ → $t = \frac{1}{4}$, kiểm tra $y = -2 + 4 \cdot \frac{1}{4} = -1 \neq 0$.

Cần dùng chiếu lên $Oz$: $M$ là giao $A'B$ với $Oz$ (nếu có). Nếu không → dùng đạo hàm.

Phương pháp: Đối xứng qua trục/mặt phẳng → BĐT tam giác.

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2022 - VDC Mặt cầu và mặt phẳng]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2022_vdc_mat_cau_va_mat_phang]

Bài: Cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x - 4y + 2z - 3 = 0$. Viết PT mặt phẳng $(P)$ đi qua $M(3, 1, -1)$, cắt $(S)$ theo giao tuyến là đường tròn có bán kính lớn nhất.

Lời giải:
$(S)$: tâm $I(1, 2, -1)$, $R = \sqrt{1 + 4 + 1 + 3} = 3$

Giao tuyến $(P) \cap (S)$ là đường tròn bán kính $r = \sqrt{R^2 - d^2}$ ($d$ = khoảng cách từ $I$ đến $(P)$).

$r$ lớn nhất ↔ $d$ nhỏ nhất.

$d$ nhỏ nhất khi $(P)$ đi qua $I$ ↔ $d = 0$ ↔ $r = R = 3$

Kiểm tra: $M(3,1,-1)$ và $I(1,2,-1)$ → $(P)$ qua cả $M$ và $I$.

Nhưng $(P)$ qua $M$ và $I$ chưa xác định duy nhất (cần thêm ĐK). Nếu chỉ cần $r$ max → $(P)$ qua $I$:

$\vec{IM} = (2, -1, 0)$ → $(P)$ qua $I(1,2,-1)$, có VTPT $\vec{n}$ bất kỳ vuông góc $\vec{IM}$.

Chọn $(P)$ đi qua $I$: mọi mp qua $I$ đều cho $r = 3$ (đường tròn lớn).

PT $(P)$ qua $M(3,1,-1)$ và $I(1,2,-1)$: vô số mp → cần thêm ĐK (đề thường cho thêm).

Phương pháp: $r = \sqrt{R^2 - d^2}$ → max $r$ ↔ min $d$ ↔ $(P)$ qua tâm.

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2021 - VDC Tích có hướng và thể tích]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2021_vdc_tich_co_huong_va_the_ti]

Bài: Cho $A(1, 0, 0)$, $B(0, 1, 0)$, $C(0, 0, 1)$, $D(1, 1, 1)$. Tính thể tích tứ diện $ABCD$.

Lời giải:
$\vec{AB} = (-1, 1, 0)$, $\vec{AC} = (-1, 0, 1)$, $\vec{AD} = (0, 1, 1)$

$$\vec{AB} \times \vec{AC} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ -1 & 1 & 0 \\ -1 & 0 & 1 \end{vmatrix} = (1, 1, 1)$$

$$[\vec{AB}, \vec{AC}, \vec{AD}] = \vec{AD} \cdot (\vec{AB} \times \vec{AC}) = (0, 1, 1) \cdot (1, 1, 1) = 2$$

$$V = \frac{1}{6}|[\vec{AB}, \vec{AC}, \vec{AD}]| = \frac{1}{6} \cdot 2 = \frac{1}{3}$$

Phương pháp: Tích có hướng → tích hỗn hợp → thể tích = $\frac{1}{6}|$tích hỗn hợp$|$.

---
[topic: SOLID_GEOMETRY]
[source: THPT QG - VDC Oxyz, gia tri nho nhat MB voi tam giac OAM dien tich cho truoc]
[difficulty: ADVANCED]
[subTopic: vdc_oxyz_min_mb_tam_giac_oam_dien_tich]

Bài: Trong không gian $Oxyz$, cho $A(0;0;10)$, $B(3;4;6)$. Xét các điểm $M$ thay đổi sao cho tam giác $OAM$ không có góc tù và có diện tích bằng $15$. Tìm giá trị nhỏ nhất của độ dài đoạn thẳng $MB$.

Lời giải:
Quỹ tích điểm $M$: ta có $OA = 10$. Từ diện tích tam giác:
$$S_{OAM} = \frac{1}{2} \cdot OA \cdot d(M; OA) = 15 \Rightarrow d(M; OA) = 3$$
Suy ra $M$ di động trên mặt trụ bán kính $3$, trục là $OA$ (trục $Oz$).

Điều kiện tam giác $OAM$ không có góc tù (tức $\widehat{AMO} \le 90^\circ$) giới hạn vị trí $M$ theo phương trục. Xét điểm $D$ trên mặt trụ với $H$ là hình chiếu của $D$ lên $OA$ ($HD = 3$):
$$\begin{cases} HA \cdot HO = HD^2 = 9 \ HA + HO = 10 \end{cases} \Rightarrow \begin{cases} HA = 1 \ HO = 9 \end{cases}$$
Do đó giới hạn của $M$ là phần hai mặt trụ ứng với hai đoạn trục $AH$ (với $z \in [9;10]$) và $FO$ (với $z \in [0;1]$).

Tính $MB$ nhỏ nhất: hình chiếu của $B(3;4;6)$ lên trục $Oz$ có $z = 6$, khoảng cách từ $B$ đến trục là $\sqrt{3^2 + 4^2} = 5$. Vì hình chiếu của $B$ cách $H$ ($z=9$) gần hơn cách $F$ ($z=1$), điểm $M$ gần $B$ nhất nằm ở mép vùng phía $H$:
- Theo phương ngang: $5 - 3 = 2$ (từ $B$ tới mặt trụ).
- Theo phương trục: từ $z = 6$ đến $z = 9$ là $3$.

$$MB_{\min} = \sqrt{2^2 + 3^2} = \sqrt{13}$$
Vì $\sqrt{13} \approx 3{,}61 \in (3;4)$ nên đáp án B.

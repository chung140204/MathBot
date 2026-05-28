# Đề thi VDC - Hình học không gian + Thể tích (SOLID_GEOMETRY + VOLUME)

---
[topic: VOLUME]
[source: THPT QG 2024 - VDC Thể tích khối chóp cắt]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2024_vdc_the_tich_khoi_chop_cat]
[relatedTopics: SOLID_GEOMETRY]

Bài: Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \perp (ABCD)$, $SA = a\sqrt{2}$. Gọi $M$ là trung điểm $SC$. Tính thể tích tứ diện $ABMD$.

Lời giải:
Đặt hệ tọa độ: $A = (0,0,0)$, $B = (a,0,0)$, $D = (0,a,0)$, $S = (0,0,a\sqrt{2})$
$C = (a,a,0)$, $M = \frac{S+C}{2} = (\frac{a}{2}, \frac{a}{2}, \frac{a\sqrt{2}}{2})$

$V_{ABMD} = \frac{1}{6}|[\vec{AB}, \vec{AM}, \vec{AD}]|$

$\vec{AB} = (a, 0, 0)$, $\vec{AM} = (\frac{a}{2}, \frac{a}{2}, \frac{a\sqrt{2}}{2})$, $\vec{AD} = (0, a, 0)$

$\vec{AB} \times \vec{AM} = (0 \cdot \frac{a\sqrt{2}}{2} - 0 \cdot \frac{a}{2}, 0 \cdot \frac{a}{2} - a \cdot \frac{a\sqrt{2}}{2}, a \cdot \frac{a}{2} - 0 \cdot \frac{a}{2})$
$= (0, -\frac{a^2\sqrt{2}}{2}, \frac{a^2}{2})$

$[\vec{AB}, \vec{AM}, \vec{AD}] = \vec{AD} \cdot (0, -\frac{a^2\sqrt{2}}{2}, \frac{a^2}{2}) = -\frac{a^3\sqrt{2}}{2}$

$V = \frac{1}{6} \cdot \frac{a^3\sqrt{2}}{2} = \frac{a^3\sqrt{2}}{12}$

Cách 2: $V_{ABMD} = \frac{V_{S.ABCD}}{k}$ (tỉ số thể tích)
$V_{S.ABCD} = \frac{1}{3}a^2 \cdot a\sqrt{2} = \frac{a^3\sqrt{2}}{3}$
$M$ trung điểm $SC$ → $V_{ABMD} = \frac{1}{2}V_{ABCD.S} - ...$ (cần phân tích cẩn thận)

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2023 - VDC Góc và khoảng cách không gian]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2023_vdc_goc_va_khoang_cach_khon]
[relatedTopics: VOLUME]

Bài: Cho hình chóp $S.ABC$ có $SA = SB = SC = a$, tam giác $ABC$ đều cạnh $a$. Tính khoảng cách từ $S$ đến mặt phẳng $(ABC)$.

Lời giải:
$SA = SB = SC$ → $S$ cách đều 3 đỉnh đáy → hình chiếu $H$ của $S$ lên $(ABC)$ là tâm đường tròn ngoại tiếp tam giác $ABC$.

Tam giác $ABC$ đều cạnh $a$: bán kính ngoại tiếp $R = \frac{a}{\sqrt{3}}$

$SH^2 = SA^2 - AH^2 = a^2 - \frac{a^2}{3} = \frac{2a^2}{3}$

$SH = a\sqrt{\frac{2}{3}} = \frac{a\sqrt{6}}{3}$

---
[topic: VOLUME]
[source: THPT QG 2022 - VDC Mặt cầu ngoại tiếp hình chóp]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2022_vdc_mat_cau_ngoai_tiep_hinh]
[relatedTopics: SOLID_GEOMETRY]

Bài: Cho hình chóp $S.ABC$ có $SA \perp (ABC)$, $SA = 3$, tam giác $ABC$ vuông tại $B$, $AB = 4$, $BC = 3$. Tính bán kính mặt cầu ngoại tiếp.

Lời giải:
$SA \perp (ABC)$ → tứ diện $SABC$ có $SA$ vuông góc đáy.

Đường tròn ngoại tiếp tam giác vuông $ABC$: tâm $I$ = trung điểm $AC$
$AC = \sqrt{16 + 9} = 5$, $R_{ABC} = \frac{5}{2}$, $I$ = trung điểm $AC$

Tâm mặt cầu ngoại tiếp $O$ nằm trên đường thẳng qua $I$ vuông góc $(ABC)$.
$O$ là trung điểm $SJ$ trong đó $J$ là chân đường vuông góc...

Cách nhanh: $SA \perp (ABC)$ và $ABC$ vuông → $SABC$ có 3 cạnh vuông góc đôi một tại $A$ (SA, AB) và tại $B$ (AB, BC).

$SB = \sqrt{SA^2 + AB^2} = 5$, $SC = \sqrt{SA^2 + AC^2} = \sqrt{9 + 25} = \sqrt{34}$

Tâm mặt cầu $O$ = trung điểm $SC$ (vì $\angle SAC$ và $\angle SBC$ nhìn $SC$...).

Thực ra: đường kính mặt cầu = $SC$ khi $\angle SAC = 90°$ (đúng vì $SA \perp AC$... sai, $SA \perp (ABC)$ nên $SA \perp AC$ ✓)

$R = \frac{SC}{2} = \frac{\sqrt{34}}{2}$

Kiểm tra: $OA = OS = OB = OC = \frac{\sqrt{34}}{2}$ ✓

Phương pháp: Khi $SA \perp (ABC)$ → tâm cầu ngoại tiếp nằm trên trục vuông góc qua tâm ngoại tiếp đáy.

---
[topic: SOLID_GEOMETRY]
[source: THPT QG 2020 - VDC Thiết diện và thể tích]
[difficulty: ADVANCED]
[subTopic: thpt_qg_2020_vdc_thiet_dien_va_the_tich]

Bài: Cho hình lập phương $ABCD.A'B'C'D'$ cạnh $a$. Mặt phẳng $(P)$ đi qua $A$, trung điểm $M$ của $BB'$, trung điểm $N$ của $DD'$. Tính diện tích thiết diện.

Lời giải:
Đặt tọa độ: $A = (0,0,0)$, $B = (a,0,0)$, $D = (0,a,0)$, $A' = (0,0,a)$
$M = (a, 0, \frac{a}{2})$, $N = (0, a, \frac{a}{2})$

$\vec{AM} = (a, 0, \frac{a}{2})$, $\vec{AN} = (0, a, \frac{a}{2})$

$(P)$ qua $A$, $M$, $N$: VTPT $\vec{n} = \vec{AM} \times \vec{AN}$
$\vec{n} = (0 \cdot \frac{a}{2} - \frac{a}{2} \cdot a, \frac{a}{2} \cdot 0 - a \cdot \frac{a}{2}, a \cdot a - 0) = (-\frac{a^2}{2}, -\frac{a^2}{2}, a^2)$
Rút gọn: $\vec{n} = (-1, -1, 2)$

PT $(P)$: $-x - y + 2z = 0$ hay $x + y - 2z = 0$

Tìm giao $(P)$ với các cạnh còn lại:
- $B'C' = \{(t, a-t+a, a) : ...\}$... Cần tìm giao $(P)$ với mỗi cạnh hình lập phương.

Thiết diện $AMNQ...$ → tính diện tích bằng tích có hướng.

Phương pháp: Tọa độ hóa → tìm giao điểm $(P)$ với các cạnh → tính diện tích đa giác.

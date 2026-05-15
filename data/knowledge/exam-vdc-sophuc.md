# Đề thi VDC - Số phức (COMPLEX_NUMBERS)

---
[topic: COMPLEX_NUMBERS]
[source: THPT QG 2024 - VDC Mô-đun max/min với ràng buộc]

Bài: Cho số phức $z$ thỏa $|z - 2 - i| = 1$. Tìm giá trị lớn nhất của $|z + 1 - 3i|$.

Lời giải:
$|z - 2 - i| = 1$ → $M$ biểu diễn $z$ nằm trên đường tròn tâm $I(2, 1)$, bán kính $R = 1$.

Cần tìm max $|z + 1 - 3i| = MA$ với $A(-1, 3)$.

$IA = \sqrt{(2-(-1))^2 + (1-3)^2} = \sqrt{9 + 4} = \sqrt{13}$

Max $MA = IA + R = \sqrt{13} + 1$ (khi $M$ nằm trên tia $IA$ kéo dài, phía xa $A$)

Phương pháp: Biểu diễn hình học → tìm khoảng cách lớn nhất từ điểm đến đường tròn.

---
[topic: COMPLEX_NUMBERS]
[source: THPT QG 2023 - VDC Số phức thỏa 2 điều kiện]

Bài: Tìm số phức $z$ thỏa $|z| = |z - 4|$ và $|z - 1 - i| = \sqrt{5}$.

Lời giải:
ĐK1: $|z| = |z - 4|$ → $M(x, y)$ cách đều $O(0,0)$ và $A(4,0)$
→ $M$ nằm trên trung trực $OA$: $x = 2$

ĐK2: $|z - 1 - i| = \sqrt{5}$ → đường tròn tâm $B(1, 1)$, bán kính $\sqrt{5}$

Thay $x = 2$ vào đường tròn:
$(2-1)^2 + (y-1)^2 = 5$
$1 + (y-1)^2 = 5$
$(y-1)^2 = 4$
$y = 3$ hoặc $y = -1$

Vậy $z = 2 + 3i$ hoặc $z = 2 - i$.

Phương pháp: Mỗi điều kiện cho 1 tập hợp điểm → tìm giao.

---
[topic: COMPLEX_NUMBERS]
[source: THPT QG 2022 - VDC Biểu thức số phức có tham số]

Bài: Cho $z = a + bi$ ($a, b \in \mathbb{R}$) thỏa $|z - 1| = 2$ và $P = z\bar{z} + 2z + 2\bar{z}$. Tìm max $P$.

Lời giải:
$|z - 1| = 2$ → $(a-1)^2 + b^2 = 4$

$z\bar{z} = |z|^2 = a^2 + b^2$
$z + \bar{z} = 2a$

$P = a^2 + b^2 + 2(2a) = a^2 + b^2 + 4a$

Từ $(a-1)^2 + b^2 = 4$: $b^2 = 4 - (a-1)^2 = 3 + 2a - a^2$

$P = a^2 + (3 + 2a - a^2) + 4a = 6a + 3$

ĐK: $b^2 \geq 0 \Rightarrow 3 + 2a - a^2 \geq 0 \Rightarrow -1 \leq a \leq 3$

$P = 6a + 3$ tăng theo $a$ → max khi $a = 3$: $P_{max} = 21$

Khi $a = 3$: $b = 0$ → $z = 3$.

Phương pháp: Biểu diễn $P$ theo 1 biến (dùng ĐK ràng buộc để khử biến), khảo sát trên miền ĐK.

---
[topic: COMPLEX_NUMBERS]
[source: THPT QG 2020 - VDC Phương trình số phức]

Bài: Tìm tất cả số phức $z$ thỏa $z^2 + |z|^2 = 8 - 6i$.

Lời giải:
Đặt $z = a + bi$. Thì $|z|^2 = a^2 + b^2$.

$z^2 = (a+bi)^2 = (a^2 - b^2) + 2abi$

$z^2 + |z|^2 = (a^2 - b^2 + a^2 + b^2) + 2abi = 2a^2 + 2abi$

Đồng nhất: $2a^2 = 8$ và $2ab = -6$
$a^2 = 4 \Rightarrow a = \pm 2$
$ab = -3$

- $a = 2$: $b = -\frac{3}{2}$ → $z = 2 - \frac{3}{2}i$
- $a = -2$: $b = \frac{3}{2}$ → $z = -2 + \frac{3}{2}i$

Phương pháp: Khai triển $z^2$, đồng nhất phần thực và phần ảo.

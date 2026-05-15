# Vận dụng cao - Hình học (SOLID_GEOMETRY + ANALYTIC_GEOMETRY + VOLUME)

---
[topic: SOLID_GEOMETRY]
[source: Vận dụng cao - Khoảng cách giữa hai đường chéo nhau]

Phương pháp 1: Dựng mặt phẳng song song
- Dựng mp $(P)$ chứa $d_1$ và song song $d_2$
- $d(d_1, d_2) = d(\text{điểm trên } d_2, (P))$

Phương pháp 2: Dùng thể tích
- Tìm đoạn vuông góc chung $MN$ ($M \in d_1$, $N \in d_2$, $MN \perp d_1$, $MN \perp d_2$)
- Hoặc: $d = \frac{6V}{S \cdot \text{cạnh tương ứng}}$

Phương pháp 3: Tọa độ hóa (Oxyz)
- VTCP $d_1 = \vec{u}$, VTCP $d_2 = \vec{v}$
- $A \in d_1$, $B \in d_2$
$$d(d_1, d_2) = \frac{|\vec{AB} \cdot (\vec{u} \times \vec{v})|}{|\vec{u} \times \vec{v}|}$$

---
[topic: SOLID_GEOMETRY]
[source: Vận dụng cao - Góc nhị diện]

Góc nhị diện: góc giữa 2 nửa mặt phẳng có chung cạnh (giao tuyến).

Phương pháp:
1. Xác định giao tuyến $\Delta$ của 2 mp
2. Chọn điểm $I \in \Delta$
3. Dựng $a \perp \Delta$ trong mp thứ nhất
4. Dựng $b \perp \Delta$ trong mp thứ hai
5. Góc nhị diện = $\widehat{(a, b)}$

Mẹo tìm nhanh:
- Nếu biết $SA \perp (ABC)$: hạ $AH \perp BC$, thì góc nhị diện $[S, BC, A]$ = $\widehat{SHA}$
- Dùng $\tan$: $\tan\alpha = \frac{\text{khoảng cách}}{...}$

Phương pháp tọa độ:
- VTPT $(P) = \vec{n_1}$, VTPT $(Q) = \vec{n_2}$
$$\cos\alpha = \frac{|\vec{n_1} \cdot \vec{n_2}|}{|\vec{n_1}||\vec{n_2}|}$$

---
[topic: SOLID_GEOMETRY]
[source: Vận dụng cao - Tọa độ hóa hình không gian]

Khi nào nên tọa độ hóa:
- Hình chóp có cạnh vuông góc đáy ($SA \perp (ABC)$)
- Hình hộp chữ nhật
- Bài yêu cầu khoảng cách, góc phức tạp

Cách đặt hệ trục:
- Chọn gốc O tại đỉnh có 3 cạnh vuông góc đôi một
- 3 trục Ox, Oy, Oz theo 3 cạnh vuông góc

Ví dụ: Chóp $S.ABCD$, $ABCD$ vuông, $SA \perp (ABCD)$
- $A = (0,0,0)$, $B = (a,0,0)$, $D = (0,a,0)$, $S = (0,0,h)$
- $C = (a,a,0)$

Tính khoảng cách từ $A$ đến mp $(SBC)$:
- VTPT $(SBC)$: $\vec{n} = \vec{SB} \times \vec{SC}$
- $d = \frac{|\vec{n} \cdot \vec{SA}|}{|\vec{n}|}$

---
[topic: VOLUME]
[source: Vận dụng cao - Thể tích khối chóp có tham số]

Dạng: Tìm $m$ để thể tích hình chóp đạt GTLN/GTNN.

Phương pháp:
1. Biểu diễn $V$ theo tham số $m$
2. Khảo sát hàm $V(m)$ → tìm cực trị

Ví dụ: Chóp $S.ABC$ có $SA \perp (ABC)$, $ABC$ tam giác vuông tại $B$, $AB = a$, $\widehat{SAC} = \alpha$. Tìm $V$ theo $\alpha$.
- $SA = AC \cdot \tan\alpha$... (triển khai theo $\alpha$)
- Dùng AM-GM hoặc đạo hàm tìm max $V$

Mẹo: $V = \frac{1}{3}Sh$, nếu $S$ cố định → max $V$ ↔ max $h$
Nếu $h$ cố định → max $V$ ↔ max $S$

---
[topic: ANALYTIC_GEOMETRY]
[source: Vận dụng cao - Đường tròn và tiếp tuyến]

Dạng: Bài toán tiếp tuyến đường tròn phức tạp.

Tiếp tuyến từ điểm ngoài $M$ đến $(C)$ tâm $I$ bán kính $R$:
- Khoảng cách: $d(I, \text{tiếp tuyến}) = R$
- Độ dài đoạn tiếp tuyến: $MT = \sqrt{MI^2 - R^2}$

Đường tròn tiếp xúc ngoài/trong:
- Tiếp xúc ngoài: $d(I_1, I_2) = R_1 + R_2$
- Tiếp xúc trong: $d(I_1, I_2) = |R_1 - R_2|$

Ví dụ: Tìm đường tròn $(C)$ tiếp xúc $Ox$, đi qua $A(1, 2)$ và $B(3, 4)$:
- Tâm $I(a, b)$, tiếp xúc $Ox$ → $R = |b|$, $b > 0$ → $R = b$
- $IA^2 = R^2$: $(a-1)^2 + (b-2)^2 = b^2$ → $(a-1)^2 = 4b - 4$
- $IB^2 = R^2$: $(a-3)^2 + (b-4)^2 = b^2$ → $(a-3)^2 = 8b - 16$
- Giải hệ 2 PT tìm $a, b$

---
[topic: ANALYTIC_GEOMETRY]
[source: Vận dụng cao - Cực trị hình học phẳng]

Dạng: Tìm GTLN/GTNN biểu thức hình học.

Kỹ thuật: Biểu diễn theo tham số → khảo sát hàm

Ví dụ: $M$ di chuyển trên đường tròn $(x-1)^2 + (y-2)^2 = 4$. Tìm max/min $|OM|^2 + |MA|^2$ ($A(3, 0)$).

Đặt $M = (1 + 2\cos t, 2 + 2\sin t)$:
- $|OM|^2 = (1 + 2\cos t)^2 + (2 + 2\sin t)^2 = 9 + 4\cos t + 8\sin t$
- $|MA|^2 = (2\cos t - 2)^2 + (2 + 2\sin t)^2 = 12 - 8\cos t + 8\sin t$
- Tổng $= 21 - 4\cos t + 16\sin t$
- Dùng $a\cos t + b\sin t$: biên độ $= \sqrt{16 + 256} = \sqrt{272}$
- Max/min = $21 \pm \sqrt{272}$

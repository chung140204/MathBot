# VDC - Hình học Oxyz (SOLID_GEOMETRY) — Đề THPT QG 2021, Mã 101

---

[topic: SOLID_GEOMETRY]
[source: THPT QG 2021 - Mã 101 - Câu 45]
[difficulty: APPLICATION]
[subTopic: hinh_chieu_vuong_goc_duong_thang_len_mat_phang]
[embedKey: Trong Oxyz cho đường thẳng d: x/1 = (y-1)/1 = (z-2)/(-1) và mặt phẳng (P): x + 2y + z - 4 = 0. Tìm phương trình hình chiếu vuông góc của d lên (P). Dạng: hình chiếu vuông góc của đường thẳng lên mặt phẳng.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho đường thẳng $d: \dfrac{x}{1} = \dfrac{y-1}{1} = \dfrac{z-2}{-1}$ và mặt phẳng $(P): x + 2y + z - 4 = 0$. Hình chiếu vuông góc của $d$ lên $(P)$ là đường thẳng có phương trình nào?

Dạng: Viết phương trình hình chiếu vuông góc của một đường thẳng lên một mặt phẳng.

Phương pháp: Tìm giao điểm $A = d \cap (P)$; chọn một điểm $M \in d$ rồi chiếu vuông góc $M$ xuống $(P)$ được $H$; hình chiếu $d'$ đi qua $A$ với vectơ chỉ phương $\vec{AH}$.

Lời giải:
Giao điểm $A = d \cap (P)$: điểm trên $d$ có dạng $(t;\ 1+t;\ 2-t)$; thay vào $(P)$: $t + 2(1+t) + (2 - t) - 4 = 2t = 0 \Rightarrow t = 0 \Rightarrow A(0; 1; 2)$.

Lấy $M(2; 3; 0) \in d$ (ứng với $t = 2$). Gọi $\Delta$ là đường thẳng qua $M$ vuông góc $(P)$, có vectơ chỉ phương là pháp tuyến $\vec{n} = (1; 2; 1)$: $\Delta: \dfrac{x-2}{1} = \dfrac{y-3}{2} = \dfrac{z}{1}$.

Hình chiếu $H = \Delta \cap (P)$: $H(2 + s;\ 3 + 2s;\ s)$, thay vào $(P)$: $(2+s) + 2(3+2s) + s - 4 = 4 + 6s = 0 \Rightarrow s = -\dfrac23 \Rightarrow H\left(\dfrac43;\ \dfrac53;\ -\dfrac23\right)$.

$\vec{AH} = \left(\dfrac43;\ \dfrac23;\ -\dfrac83\right)$ cùng phương $(2; 1; -4)$.

Vậy $d'$ đi qua $A(0; 1; 2)$ với vectơ chỉ phương $(2; 1; -4)$: $\dfrac{x}{2} = \dfrac{y-1}{1} = \dfrac{z-2}{-4}$.

Đáp số: $\dfrac{x}{2} = \dfrac{y-1}{1} = \dfrac{z-2}{-4}$ (đáp án C).

Dạng tương tự: Hình chiếu vuông góc của $d$ lên $(P)$: (1) tìm giao $A = d \cap (P)$; (2) chiếu một điểm $M \in d$ xuống $(P)$ được $H$ (qua đường thẳng vuông góc $(P)$); (3) $d'$ qua $A$ với vectơ chỉ phương $\vec{AH}$. Nếu $d \parallel (P)$ thì chiếu hai điểm.

---

[topic: SOLID_GEOMETRY]
[source: THPT QG 2021 - Mã 101 - Câu 49]
[difficulty: ADVANCED]
[subTopic: cuc_tri_hieu_khoang_cach_oxyz_doi_xung_quy_tich]
[embedKey: Trong Oxyz cho A(1;-3;-4), B(-2;1;2). M, N thuộc (Oxy), MN = 2. Tìm giá trị lớn nhất của |AM - BN|. Dạng: cực trị hiệu khoảng cách trong Oxyz dùng đối xứng và quỹ tích.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho hai điểm $A(1; -3; -4)$ và $B(-2; 1; 2)$. Xét hai điểm $M$ và $N$ thay đổi thuộc mặt phẳng $(Oxy)$ sao cho $MN = 2$. Tìm giá trị lớn nhất của $|AM - BN|$. [có hình]

Dạng: Cực trị (giá trị lớn nhất) của hiệu khoảng cách $|AM - BN|$ với ràng buộc $M, N$ trên một mặt phẳng và $MN$ cố định.

Phương pháp: Dùng đối xứng để $AM = A'M$; tịnh tiến $\vec{BK} = \vec{NM}$ để $BN = KM$; áp bất đẳng thức tam giác $|A'M - KM| \le A'K$; chặn $A'K$ qua quỹ tích đường tròn của $K$.

Lời giải:
$A, B$ nằm hai phía mặt phẳng $(Oxy)$ (cao độ $-4$ và $2$). Gọi $A'$ đối xứng $A$ qua $(Oxy)$: $A'(1; -3; 4)$, khi đó $AM = A'M$.

Gọi $E, F$ là hình chiếu của $A', B$ lên $(Oxy)$: $E(1; -3; 0)$, $F(-2; 1; 0)$, nên $\vec{EF} = (-3; 4; 0) \Rightarrow EF = 5$.

Dựng $\vec{BK} = \vec{NM}$ thì $BN = KM$, do đó $|AM - BN| = |A'M - KM| \le A'K$.

Vì $MN \subset (Oxy)$ và $BK \parallel NM$ nên $BK \parallel (Oxy)$; suy ra $K$ thuộc mặt phẳng song song $(Oxy)$ đi qua $B$, với $BK = MN = 2$, nên quỹ tích $K$ là đường tròn $(B; 2)$.

Kẻ $BH \perp AA'$ (chân $H$ trên đường thẳng $AA'$, cùng cao độ với $B$) thì $A'H = 2$ và $HB = EF = 5$. Do $K$ thuộc đường tròn $(B; 2)$ nên $HK \le HB + BK = 5 + 2 = 7$.

$A'K^2 = A'H^2 + HK^2 \le 2^2 + 7^2 = 53 \Rightarrow A'K \le \sqrt{53}$ (đạt khi $B$ nằm giữa $H$ và $K$).

Đáp số: $\sqrt{53}$ (đáp án D).

Dạng tương tự: Cực trị $|AM - BN|$ hoặc $AM + BN$ với $M, N$ ràng buộc trên một mặt phẳng: (1) đối xứng đưa $AM$ về $A'M$ khi $A, B$ khác phía; (2) tịnh tiến $\vec{BK} = \vec{NM}$ đưa $BN$ thành $KM$; (3) dùng bất đẳng thức tam giác và chặn đoạn còn lại qua quỹ tích (đường tròn) của điểm phụ $K$.

---

[topic: SOLID_GEOMETRY]
[source: Đề ôn 2022 - Câu 42]
[difficulty: APPLICATION]
[subTopic: mat_phang_chua_truc_ox_khoang_cach_lon_nhat]
[embedKey: Trong Oxyz cho A(1;2;-2). Mặt phẳng (P) chứa trục Ox sao cho khoảng cách từ A đến (P) lớn nhất. Viết phương trình (P). Dạng: mặt phẳng chứa một trục, khoảng cách từ điểm đến mặt phẳng lớn nhất.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho điểm $A(1; 2; -2)$. Gọi $(P)$ là mặt phẳng chứa trục $Ox$ sao cho khoảng cách từ $A$ đến $(P)$ lớn nhất. Phương trình của $(P)$ là gì?

Dạng: Mặt phẳng chứa một trục toạ độ sao cho khoảng cách từ một điểm cho trước đến nó lớn nhất.

Phương pháp: Gọi $K$ là hình chiếu của $A$ lên trục $Ox$, $H$ là hình chiếu của $A$ lên $(P)$. Vì $d(A,(P)) = AH \le AK$ nên khoảng cách lớn nhất khi $H \equiv K$, tức $(P)$ nhận $\vec{AK}$ làm vectơ pháp tuyến.

Lời giải:
Gọi $H, K$ lần lượt là hình chiếu của $A$ lên $(P)$ và lên trục $Ox$. Ta có $d(A,(P)) = AH \le AK$ ($AH$ là đường vuông góc, $AK$ là đường xiên).

Khoảng cách lớn nhất khi $H \equiv K$; khi đó $(P)$ nhận $\vec{AK}$ làm pháp tuyến.

$K$ là hình chiếu của $A(1; 2; -2)$ lên $Ox$ nên $K(1; 0; 0)$, suy ra $\vec{AK} = (0; -2; 2)$.

$(P)$ đi qua $K(1; 0; 0)$ với pháp tuyến $(0; -2; 2)$: $-2(y - 0) + 2(z - 0) = 0 \Leftrightarrow y - z = 0$.
(Mặt phẳng $y - z = 0$ chứa $Ox$ vì mọi điểm $(t; 0; 0)$ đều thỏa.)

Đáp số: $y - z = 0$ (đáp án D).

Dạng tương tự: "Mặt phẳng chứa trục/đường thẳng $\Delta$ sao cho khoảng cách từ điểm $A$ đến nó lớn nhất". Khoảng cách lớn nhất bằng khoảng cách từ $A$ đến $\Delta$, đạt khi mặt phẳng vuông góc với $AK$ ($K$ là hình chiếu của $A$ lên $\Delta$); lấy $\vec{AK}$ làm pháp tuyến.

---

[topic: SOLID_GEOMETRY]
[source: Đề ôn 2022 - Câu 49]
[difficulty: ADVANCED]
[subTopic: tiep_tuyen_mat_cau_va_mat_cau_ngoai_tiep_tu_dien_oxyz]
[embedKey: Oxyz, mặt cầu (S) tâm I(1;3;9) bán kính 3. M thuộc Ox, N thuộc Oz, MN tiếp xúc (S), mặt cầu ngoại tiếp OIMN bán kính 13/2. A là tiếp điểm. Tính AM.AN. Dạng: tiếp tuyến mặt cầu kết hợp mặt cầu ngoại tiếp tứ diện trong Oxyz.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho mặt cầu $(S)$ tâm $I(1; 3; 9)$ bán kính bằng $3$. Gọi $M, N$ là hai điểm lần lượt thuộc hai trục $Ox$, $Oz$ sao cho đường thẳng $MN$ tiếp xúc với $(S)$, đồng thời mặt cầu ngoại tiếp tứ diện $OIMN$ có bán kính bằng $\dfrac{13}{2}$. Gọi $A$ là tiếp điểm của $MN$ và $(S)$, giá trị $AM \cdot AN$ bằng bao nhiêu?

Dạng: Tiếp tuyến của mặt cầu kết hợp mặt cầu ngoại tiếp tứ diện trong Oxyz; quy về hệ phương trình theo toạ độ $M, N$.

Phương pháp: Nhận ra $(OMN)$ là mặt phẳng $y=0$, tính $d(I,(OMN)) = 3 = R$ nên $(S)$ tiếp xúc $(OMN)$ tại $A$ (hình chiếu của $I$); đặt $M(m;0;0), N(0;0;n)$, dùng $A,M,N$ thẳng hàng (1) và công thức bán kính mặt cầu ngoại tiếp cho $IM\cdot IN$ (2); đặt $u=(m-1)^2, v=(n-9)^2$ giải hệ; tính $AM\cdot AN$.

Lời giải:
$M, N$ thuộc $Ox, Oz$ nên $(OMN)$ là mặt phẳng $y = 0$; $d(I,(OMN)) = 3 = R$, suy ra $(S)$ tiếp xúc $(OMN)$ tại $A(1; 0; 9)$ (hình chiếu của $I$ lên $y = 0$).

Đặt $M(m; 0; 0)$, $N(0; 0; n)$: $\vec{AM} = (m-1; 0; -9)$, $\vec{AN} = (-1; 0; n-9)$.

$A, M, N$ thẳng hàng nên $(m-1)(n-9) = 9$ $(1)$.

Mặt cầu ngoại tiếp $OIMN$ có bán kính $\dfrac{13}{2}$; qua hệ thức diện tích/bán kính của tam giác $IMN$ dẫn đến $IM \cdot IN = 39$, tức
$$\big((m-1)^2 + 90\big)\big((n-9)^2 + 10\big) = 39^2 = 1521 \quad (2),$$
trong đó $IM^2 = (m-1)^2 + 90$, $IN^2 = (n-9)^2 + 10$.

Đặt $u = (m-1)^2$, $v = (n-9)^2$. Từ $(1)$: $uv = 81$. Khai triển $(2)$: $uv + 10u + 90v + 900 = 1521 \Rightarrow 10u + 90v = 540 \Rightarrow u + 9v = 54$. Giải hệ $\{uv = 81;\ u + 9v = 54\}$ được $u = 27$, $v = 3$.

Do đó:
$$AM = \sqrt{(m-1)^2 + 81} = \sqrt{27 + 81} = 6\sqrt3,\qquad AN = \sqrt{1 + (n-9)^2} = \sqrt{1 + 3} = 2.$$
$$AM \cdot AN = 6\sqrt3 \cdot 2 = 12\sqrt3.$$

Đáp số: $12\sqrt3$ (đáp án B).

Dạng tương tự: Bài tiếp tuyến mặt cầu + mặt cầu ngoại tiếp tứ diện trong Oxyz. Khai thác mặt phẳng đặc biệt (chứa hai trục → $y=0$), điều kiện tiếp xúc ($d = R$), điều kiện thẳng hàng của tiếp điểm, và công thức bán kính mặt cầu/đường tròn ngoại tiếp; đặt ẩn phụ bình phương để hạ bậc hệ.

---

[topic: SOLID_GEOMETRY]
[source: Đề ôn 2023 - Câu 46]
[difficulty: ADVANCED]
[subTopic: mat_phang_qua_diem_chua_duong_thang_khoang_cach]
[embedKey: Oxyz, A(0;1;2), đường thẳng d. (P) qua A và chứa d. Khoảng cách từ M(5;-1;3) đến (P). Dạng: viết mặt phẳng qua điểm chứa đường thẳng rồi tính khoảng cách.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho điểm $A(0; 1; 2)$ và đường thẳng $d: \dfrac{x-2}{2} = \dfrac{y-1}{2} = \dfrac{z-1}{-3}$. Gọi $(P)$ là mặt phẳng đi qua $A$ và chứa $d$. Khoảng cách từ điểm $M(5; -1; 3)$ đến $(P)$ bằng bao nhiêu?

Dạng: Viết phương trình mặt phẳng đi qua một điểm và chứa một đường thẳng, rồi tính khoảng cách từ một điểm đến mặt phẳng.

Phương pháp: Lấy điểm $B \in d$, tính $\vec{AB}$ và VTCP $\vec{u_d}$; pháp tuyến $\vec{n_P} = [\vec{AB}, \vec{u_d}]$; viết $(P)$ qua $A$; dùng công thức khoảng cách.

Lời giải:
Lấy $B(2; 1; 1) \in d$, ta có $\vec{AB} = (2; 0; -1)$ và VTCP $\vec{u_d} = (2; 2; -3)$.

$[\vec{AB}, \vec{u_d}] = (2; 4; 4) = 2(1; 2; 2)$, nên $(P)$ có pháp tuyến $\vec{n_P} = (1; 2; 2)$.

$(P)$ đi qua $A(0; 1; 2)$: $1(x - 0) + 2(y - 1) + 2(z - 2) = 0 \Leftrightarrow x + 2y + 2z - 6 = 0$.

$$d(M,(P)) = \dfrac{|5 + 2(-1) + 2\cdot 3 - 6|}{\sqrt{1^2 + 2^2 + 2^2}} = \dfrac{3}{3} = 1.$$

Đáp số: $1$ (đáp án C).

Dạng tương tự: Mặt phẳng qua điểm $A$ và chứa đường thẳng $d$ có pháp tuyến $= [\vec{AB}, \vec{u_d}]$ với $B \in d$. Sau đó áp công thức $d(M,(P)) = \dfrac{|ax_M + by_M + cz_M + D|}{\sqrt{a^2+b^2+c^2}}$.

---

[topic: SOLID_GEOMETRY]
[source: Đề ôn 2023 - Câu 49]
[difficulty: ADVANCED]
[subTopic: cuc_tri_khoang_cach_diem_tren_mat_tru_dieu_kien_goc_oxyz]
[relatedTopics: VOLUME]
[embedKey: Oxyz, A(0;0;10), B(3;4;6). Tam giác OAM không góc tù, diện tích 15. Tìm giá trị nhỏ nhất của MB. Dạng: cực trị khoảng cách khi M nằm trên mặt trụ với ràng buộc góc.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho $A(0; 0; 10)$, $B(3; 4; 6)$. Xét các điểm $M$ thay đổi sao cho tam giác $OAM$ không có góc tù và có diện tích bằng $15$. Giá trị nhỏ nhất của độ dài đoạn thẳng $MB$ thuộc khoảng nào dưới đây? [có hình]

Dạng: Cực trị khoảng cách $MB$ khi $M$ bị ràng buộc trên một mặt trụ (diện tích tam giác cố định) kèm điều kiện "không có góc tù".

Phương pháp: Từ diện tích suy ra $d(M; OA) = 3$ nên $M$ thuộc mặt trụ trục $OA$ bán kính $3$; điều kiện không góc tù giới hạn hình chiếu $H$ của $M$ trên trục vào hai đoạn ở hai đầu; chiếu $B$ lên trục để tìm vị trí $M$ gần $B$ nhất, rồi tính $MB$ qua hai thành phần (dọc trục + ngang).

Lời giải:
$S_{OAM} = \dfrac12 OA \cdot d(M; OA) = 15$ với $OA = 10$, suy ra $d(M; OA) = 3$. Vậy $M$ nằm trên mặt trụ trục $OA$ (trục $Oz$) bán kính $3$.

Điều kiện "không có góc tù" (mọi góc $\le 90°$); đặc biệt $\widehat{OMA} \le 90°$ buộc $M$ nằm ngoài mặt cầu đường kính $OA$. Gọi $H$ là hình chiếu của $M$ lên trục; xét điểm giới hạn $D$ trên trụ có $\widehat{ODA} = 90°$: $\begin{cases} HA \cdot HO = HD^2 = 9 \\ HA + HO = 10 \end{cases} \Rightarrow \begin{cases} HA = 1 \\ HO = 9 \end{cases}$. Kết hợp các điều kiện góc tại $O, A$, hình chiếu $H$ của $M$ chỉ nằm trong dải $z \in [0; 1]$ hoặc $z \in [9; 10]$.

$B(3; 4; 6)$ có hình chiếu lên trục tại $z = 6$, cách trục một khoảng $\sqrt{3^2 + 4^2} = 5$. Vì $z = 6$ gần dải $[9; 10]$ hơn (qua mốc $z = 9$), điểm $M$ gần $B$ nhất ứng với $z = 9$:
- thành phần dọc trục: $|9 - 6| = 3$;
- thành phần ngang: $5 - 3 = 2$.

Do đó $MB_{\min} = \sqrt{2^2 + 3^2} = \sqrt{13} \approx 3{,}6 \in (3; 4)$.

Đáp số: khoảng $(3; 4)$ (đáp án B).

Dạng tương tự: Cực trị khoảng cách khi điểm chạy trên mặt trụ (khoảng cách đến trục cố định) kèm ràng buộc góc. Quy về: xác định bán kính & dải hợp lệ của hình chiếu trên trục (từ điều kiện góc, dùng hệ thức $HA\cdot HO = HD^2$), chiếu điểm cố định lên trục, rồi tách khoảng cách thành thành phần dọc trục và thành phần ngang ($R_{\text{ngoài}} - R_{\text{trụ}}$).

---

[topic: SOLID_GEOMETRY]
[source: Đề chính thức 2024 - Mã 123 - Câu 44]
[difficulty: APPLICATION]
[subTopic: mat_cau_ban_kinh_nho_nhat_tiep_xuc_hai_duong_thang_cheo]
[embedKey: Oxyz, d1 và d2 chéo nhau. Mặt cầu bán kính nhỏ nhất tiếp xúc cả d1 và d2. Viết phương trình mặt cầu. Dạng: mặt cầu nhỏ nhất tiếp xúc hai đường thẳng chéo nhau nhận đoạn vuông góc chung làm đường kính.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho hai đường thẳng $d_1: \dfrac{x-2}{1} = \dfrac{y-4}{3} = \dfrac{z+3}{-5}$ và $d_2: \dfrac{x+2}{1} = \dfrac{y+2}{-1} = \dfrac{z+1}{-1}$. Trong các mặt cầu tiếp xúc với cả hai đường thẳng $d_1$ và $d_2$, gọi $(S)$ là mặt cầu có bán kính nhỏ nhất. Viết phương trình của $(S)$.

Dạng: Mặt cầu bán kính nhỏ nhất tiếp xúc hai đường thẳng chéo nhau — nhận đoạn vuông góc chung làm đường kính.

Phương pháp: Tìm đoạn vuông góc chung $AB$ ($A \in d_1$, $B \in d_2$) bằng hệ $\vec{BA}\cdot\vec{u_{d_1}} = 0$, $\vec{BA}\cdot\vec{u_{d_2}} = 0$; mặt cầu nhỏ nhất nhận $AB$ làm đường kính → tâm là trung điểm $AB$, bán kính $\frac{AB}{2}$.

Lời giải:
Tham số hóa: $A(t_1 + 2;\ 3t_1 + 4;\ -5t_1 - 3) \in d_1$, $B(t_2 - 2;\ -t_2 - 2;\ -t_2 - 1) \in d_2$, với $\vec{u_{d_1}} = (1; 3; -5)$, $\vec{u_{d_2}} = (1; -1; -1)$.

$\vec{BA} = (t_1 - t_2 + 4;\ 3t_1 + t_2 + 6;\ -5t_1 + t_2 - 2)$. Điều kiện đoạn vuông góc chung:
$$\begin{cases} \vec{BA}\cdot\vec{u_{d_1}} = 0 \\ \vec{BA}\cdot\vec{u_{d_2}} = 0 \end{cases} \Leftrightarrow \begin{cases} 35t_1 - 3t_2 + 32 = 0 \\ 3t_1 - 3t_2 = 0 \end{cases} \Leftrightarrow t_1 = t_2 = -1.$$

Suy ra $A(1; 1; 2)$, $B(-3; -1; 0)$, $AB = \sqrt{16 + 4 + 4} = 2\sqrt6$.

Mặt cầu $(S)$ nhỏ nhất nhận $AB$ làm đường kính: tâm $I\left(\dfrac{1 + (-3)}{2};\ \dfrac{1 + (-1)}{2};\ \dfrac{2 + 0}{2}\right) = (-1; 0; 1)$, bán kính $R = \dfrac{AB}{2} = \sqrt6$.

Phương trình: $(x + 1)^2 + y^2 + (z - 1)^2 = 6$.

Đáp số: $(x + 1)^2 + y^2 + (z - 1)^2 = 6$ (đáp án A).

Dạng tương tự: Mặt cầu bán kính nhỏ nhất tiếp xúc hai đường thẳng chéo nhau nhận đoạn vuông góc chung làm đường kính. Tìm $A, B$ bằng hệ hai điều kiện vuông góc, lấy tâm = trung điểm $AB$, bán kính $= \frac{AB}{2}$.

---

[topic: SOLID_GEOMETRY]
[source: Đề chính thức 2024 - Mã 123 - Câu 50]
[difficulty: ADVANCED]
[subTopic: cuc_tri_khoang_cach_hai_duong_thang_diem_tren_mat_cau_oxyz]
[relatedTopics: VOLUME]
[embedKey: Oxyz, A(1;6;-1), B(2;-4;-1), mặt cầu (S) tâm I(1;2;-1) qua A. M(a;b;c) c>0 thuộc (S), tam giác IAM tù diện tích 2căn7, khoảng cách BM và IA lớn nhất. Tính a+b+c. Dạng: cực trị khoảng cách hai đường thẳng với M trên đường tròn giao của mặt cầu và mặt phẳng.]
[status: reviewed]

Bài: Trong không gian $Oxyz$, cho hai điểm $A(1; 6; -1)$, $B(2; -4; -1)$ và mặt cầu $(S)$ tâm $I(1; 2; -1)$ đi qua $A$. Điểm $M(a; b; c)$ (với $c > 0$) thuộc $(S)$ sao cho tam giác $IAM$ tù, có diện tích bằng $2\sqrt7$ và khoảng cách giữa hai đường thẳng $BM$ và $IA$ lớn nhất. Giá trị của $a + b + c$ thuộc khoảng nào?

Dạng: Cực trị khoảng cách giữa hai đường thẳng khi $M$ thuộc một đường tròn (giao của mặt cầu với mặt phẳng cố định nhờ điều kiện diện tích tam giác).

Phương pháp: Tính $R = IA = IM$; từ diện tích tam giác $IAM$ tìm góc $\widehat{AIM}$ (tù) → $M$ thuộc đường tròn trong mặt phẳng $(P) \perp IA$ tại $H$ (với $I$ giữa $A$ và $H$); chiếu $B$ xuống $(P)$ thành $K$, $d(IA, BM) = HH' \le HK$, dấu bằng khi $KM \perp HK$; giải toạ độ $M$.

Lời giải:
$IA = \sqrt{0 + 16 + 0} = 4 = R$, và $IM = 4$. Diện tích $S_{IAM} = \dfrac12 IA\cdot IM\sin\widehat{AIM} = 8\sin\widehat{AIM} = 2\sqrt7 \Rightarrow \sin\widehat{AIM} = \dfrac{\sqrt7}{4}$.

Vì tam giác tù (góc tại $I$ tù), $\cos\widehat{AIM} = -\dfrac34$. Gọi $(P)$ là mặt phẳng chứa đường tròn quỹ tích $M$ ($(P) \perp IA$), $H$ là hình chiếu của $I$ lên $(P)$ với $I$ nằm giữa $A, H$. Khi đó $IH = IM\cdot\dfrac34 = 3$; $\vec{IH} = \dfrac34\vec{AI} = (0; -3; 0)$ nên $H(1; -1; -1)$ và $(P): y + 1 = 0$.

Gọi $K$ là hình chiếu của $B$ lên $(P)$: $K(2; -1; -1)$. Vì $IA \perp (P)$ nên $d(IA, BM) = HH' \le HK$, dấu bằng khi $HK \perp KM$. Khi đó $M$ thuộc đường thẳng qua $K$ vuông góc $HK$ trong $(P)$. Vì $\vec{HK} = (1; 0; 0)$ và $\vec{HK}\cdot\vec{KM} = 0$ nên $(a - 2) = 0 \Rightarrow a = 2$; $M \in (P) \Rightarrow b = -1$.

Từ $IM^2 = 16$: $(1-2)^2 + (2+1)^2 + (-1-c)^2 = 10 + (c+1)^2 = 16 \Rightarrow (c+1)^2 = 6 \Rightarrow c = -1 + \sqrt6$ (do $c > 0$).

Vậy $a + b + c = 2 - 1 - 1 + \sqrt6 = \sqrt6 \approx 2{,}449 \in \left(2; \dfrac52\right)$.

Đáp số: khoảng $\left(2; \dfrac52\right)$ (đáp án A).

Dạng tương tự: $M$ trên mặt cầu với góc $\widehat{AIM}$ cố định (từ diện tích) ⇒ $M$ thuộc một đường tròn trong mặt phẳng $(P)\perp IA$. Khoảng cách giữa $BM$ và $IA$ ($IA\perp(P)$) bằng $HH'\le HK$ ($K$ là hình chiếu $B$ lên $(P)$); dấu bằng khi $KM\perp HK$, từ đó giải toạ độ $M$ bằng điều kiện vuông góc và $IM = R$.

---

[topic: SOLID_GEOMETRY]
[source: Đề 2025 - Phần II (Đúng/Sai) - Câu 3]
[difficulty: APPLICATION]
[subTopic: chuyen_dong_oxyz_goc_vecto_quang_duong_tich_phan]
[relatedTopics: INTEGRALS]
[embedKey: Vật chuyển động thẳng trong Oxyz từ A(7;7;0), vận tốc v(t)=βt+300, hướng u=(a;b;c) tạo góc 60,60,45 với i,j,k. Sau 2 giây đi 606 m. Xét a, đường thẳng AB, β, tọa độ B. Dạng: vectơ chỉ phương qua góc + quãng đường bằng tích phân vận tốc trong Oxyz.]
[status: reviewed]

Bài (Đúng/Sai): Trong $Oxyz$ (đơn vị mét), một vật chuyển động thẳng từ $A(7;7;0)$, vận tốc $v(t) = \beta t + 300$ (m/giây), $0\le t\le6$, $\beta>0$, hướng tới $B$. Gọi $\vec u = (a;b;c)$ là vectơ đơn vị cùng hướng $\vec{AB}$, tạo với $\vec i, \vec j, \vec k$ các góc $60°, 60°, 45°$. Sau $2$ giây đi được $606$ m. Xét các mệnh đề:
a) $a = \cos 60°$.
b) Đường thẳng $AB$: $\dfrac{x-7}{1} = \dfrac{y-7}{1} = \dfrac{z}{2}$.
c) $\beta = 3$.
d) Sau $5$ giây vật đến $B(x_B; y_B; z_B)$ với $x_B > 776$.

Dạng: Vectơ chỉ phương xác định qua góc với các trục + quãng đường bằng tích phân vận tốc, trong $Oxyz$.

Phương pháp: $\cos(\vec u,\vec i)=a$ (vì $|\vec u|=1$); suy $\vec u=(\cos60°;\cos60°;\cos45°)$; quãng đường $s=\int v\,dt$; $\vec{AB}=s\cdot\vec u$ để tìm toạ độ $B$.

Lời giải:
Vì $|\vec u|=1$: $a=\cos(\vec u,\vec i)=\cos60°=\tfrac12$, $b=\cos60°=\tfrac12$, $c=\cos45°=\tfrac{\sqrt2}{2}$.

a) $a = \cos 60° = \tfrac12$. **Đúng.**
b) $\vec u=\left(\tfrac12;\tfrac12;\tfrac{\sqrt2}{2}\right)$ cùng phương $(1;1;\sqrt2)$, nên $AB: \dfrac{x-7}{1}=\dfrac{y-7}{1}=\dfrac{z}{\sqrt2}$ (không phải $\dfrac{z}{2}$). **Sai.**
c) $\displaystyle\int_0^2(\beta t+300)\,dt = 2\beta+600 = 606 \Rightarrow \beta=3$. **Đúng.**
d) $AB=\displaystyle\int_0^5(3t+300)\,dt=\dfrac{3075}{2}$. Vì $\vec{AB}=AB\cdot\vec u$ nên $x_B-7=\dfrac{3075}{2}\cdot\tfrac12=\dfrac{3075}{4} \Rightarrow x_B=775{,}75<776$. Mệnh đề nói "$>776$" nên **Sai.**

Đáp số: a) Đúng; b) Sai; c) Đúng; d) Sai.

Dạng tương tự: Chuyển động trong $Oxyz$ — vectơ chỉ phương từ góc với trục ($\cos$ các góc), quãng đường $s=\int v\,dt$, toạ độ điểm đến $=\vec{A}+s\vec u$. Chú ý chuẩn hóa $\vec u$ và giữ $\sqrt2$ thay vì làm tròn.

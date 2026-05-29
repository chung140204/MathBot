# VDC - Số phức (COMPLEX_NUMBERS) — Đề THPT QG 2021, Mã 101

---

[topic: COMPLEX_NUMBERS]
[source: THPT QG 2021 - Mã 101 - Câu 43]
[difficulty: APPLICATION]
[subTopic: pt_bac_hai_he_so_thuc_dieu_kien_mo_dun_theo_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Trên tập số phức xét z^2 - 2(m+1)z + m^2 = 0 (m thực). Có bao nhiêu giá trị m để phương trình có nghiệm z0 thỏa |z0| = 7. Dạng: phương trình bậc hai hệ số thực trên tập phức, điều kiện mô-đun nghiệm theo tham số.]
[status: reviewed]

Bài: Trên tập hợp các số phức, xét phương trình $z^2 - 2(m+1)z + m^2 = 0$ ($m$ là tham số thực). Có bao nhiêu giá trị của $m$ để phương trình đó có nghiệm $z_0$ thỏa mãn $|z_0| = 7$?

Dạng: Phương trình bậc hai hệ số thực trên tập số phức với điều kiện mô-đun nghiệm, đếm số giá trị tham số.

Phương pháp: Tính $\Delta'$; chia hai trường hợp theo dấu $\Delta'$. Nếu nghiệm thực thì $|z_0| = 7 \Rightarrow z_0 = \pm 7$ (thế vào tìm $m$); nếu nghiệm phức liên hợp thì dùng $|z_0|^2 = \dfrac{c}{a}$ (Viète) để lập phương trình theo $m$.

Lời giải:
$\Delta' = (m+1)^2 - m^2 = 2m + 1$.

Trường hợp 1: $2m + 1 \ge 0 \Leftrightarrow m \ge -\dfrac12$ — phương trình có nghiệm thực. Khi đó $|z_0| = 7 \Leftrightarrow z_0 = 7$ hoặc $z_0 = -7$.

- $z_0 = 7$: $49 - 14(m+1) + m^2 = 0 \Leftrightarrow m^2 - 14m + 35 = 0 \Leftrightarrow m = 7 \pm \sqrt{14}$ (đều thỏa $m \ge -\tfrac12$) → $2$ giá trị.
- $z_0 = -7$: $49 + 14(m+1) + m^2 = 0 \Leftrightarrow m^2 + 14m + 63 = 0$ có $\Delta = -56 < 0$ → vô nghiệm.

Trường hợp 2: $2m + 1 < 0 \Leftrightarrow m < -\dfrac12$ — phương trình có hai nghiệm phức liên hợp $z = (m+1) \pm i\sqrt{-2m-1}$. Khi đó

$$
|z_0|^2 = (m+1)^2 + (-2m - 1) = m^2,
$$

nên $|z_0| = |m| = 7 \Leftrightarrow m = \pm 7$. Kết hợp $m < -\dfrac12$ → $m = -7$ ($1$ giá trị).

Tổng hợp: $m \in \{7 + \sqrt{14};\ 7 - \sqrt{14};\ -7\}$.

Đáp số: $3$ giá trị (đáp án B).

Dạng tương tự: Phương trình bậc hai hệ số thực trên tập phức kèm điều kiện $|z_0| = k$. Luôn chia theo dấu $\Delta$: nghiệm thực ($z_0 = \pm k$, thế vào) và nghiệm phức liên hợp (dùng $|z_0|^2 = \dfrac{c}{a}$, ở đây bằng $m^2$). Đừng quên đối chiếu điều kiện ràng buộc của từng trường hợp.

---

[topic: COMPLEX_NUMBERS]
[source: THPT QG 2021 - Mã 101 - Câu 44]
[difficulty: APPLICATION]
[subTopic: gtnn_mo_dun_bieu_thuc_so_phuc_bdt_tam_giac]
[relatedTopics: ANALYTIC_GEOMETRY]
[embedKey: Số phức z, w thỏa |z| = 1, |w| = 2. Khi |z + i bar(w) - 6 - 8i| nhỏ nhất thì |z - w| bằng bao nhiêu. Dạng: cực trị mô-đun biểu thức số phức dùng bất đẳng thức tam giác Minkowski.]
[status: reviewed]

Bài: Xét các số phức $z, w$ thỏa mãn $|z| = 1$ và $|w| = 2$. Khi $\left|z + i\bar{w} - 6 - 8i\right|$ đạt giá trị nhỏ nhất, $|z - w|$ bằng bao nhiêu?

Dạng: Cực trị mô-đun của biểu thức số phức bằng bất đẳng thức tam giác (Minkowski), rồi tìm đại lượng liên quan tại điểm cực trị.

Phương pháp: Đặt $z = a + bi$, $w = c + di$; rút gọn biểu thức về dạng $\sqrt{(\dots)^2 + (\dots)^2}$; tách thành tổng độ dài ba vectơ rồi dùng $|\vec u| + |\vec v| + |\vec w| \ge |\vec u + \vec v + \vec w|$; xác định dấu bằng để suy ngược $z, w$.

Lời giải:
Đặt $z = a + bi$, $w = c + di$ với $a^2 + b^2 = 1$, $c^2 + d^2 = 4$.

$z + i\bar{w} - 6 - 8i = (a + bi) + i(c - di) - 6 - 8i = (a + d - 6) + (b + c - 8)i$, nên

$$
\left|z + i\bar{w} - 6 - 8i\right| = \sqrt{(6 - a - d)^2 + (8 - b - c)^2}.
$$

Theo bất đẳng thức tam giác:

$$
\sqrt{(6-a-d)^2 + (8-b-c)^2} + \sqrt{a^2 + b^2} + \sqrt{c^2 + d^2} \ge \sqrt{6^2 + 8^2} = 10.
$$

Vì $\sqrt{a^2+b^2} = 1$ và $\sqrt{c^2+d^2} = 2$ nên $\left|z + i\bar{w} - 6 - 8i\right| \ge 10 - 1 - 2 = 7$.

Dấu "=" xảy ra khi các vectơ $(a,b),\ (d,c),\ (6 - a - d,\ 8 - b - c)$ cùng hướng với $(6, 8)$, tức cùng hướng $\left(\tfrac35, \tfrac45\right)$:

$$
a = \tfrac35,\quad b = \tfrac45,\quad c = \tfrac85,\quad d = \tfrac65 \quad (\text{thỏa } a^2+b^2=1,\ c^2+d^2=4).
$$

Khi đó $z = \tfrac35 + \tfrac45 i$, $w = \tfrac85 + \tfrac65 i$, nên $z - w = -1 - \tfrac25 i$ và

$$
|z - w| = \sqrt{1 + \tfrac{4}{25}} = \dfrac{\sqrt{29}}{5}.
$$

Đáp số: $\dfrac{\sqrt{29}}{5}$ (đáp án D).

Dạng tương tự: Cực trị mô-đun biểu thức số phức — đưa về tổng độ dài vectơ rồi dùng bất đẳng thức tam giác; dấu bằng đạt khi các vectơ cùng hướng, từ đó giải ngược ra $z, w$ và tính đại lượng đề hỏi.

---

[topic: COMPLEX_NUMBERS]
[source: Đề ôn 2022 - Câu 45]
[difficulty: APPLICATION]
[subTopic: dien_tich_tam_giac_diem_bieu_dien_so_phuc]
[relatedTopics: ANALYTIC_GEOMETRY]
[embedKey: Số phức z1, z2, z3 thỏa |z1| = |z2| = 2|z3| = 2 và 8(z1+z2)z3 = 3 z1 z2. A, B, C là điểm biểu diễn. Tính diện tích tam giác ABC. Dạng: diện tích tam giác từ điểm biểu diễn số phức, dùng mô-đun và đẳng thức trung tuyến.]
[status: reviewed]

Bài: Cho các số phức $z_1, z_2, z_3$ thỏa mãn $|z_1| = |z_2| = 2|z_3| = 2$ và $8(z_1 + z_2)z_3 = 3z_1 z_2$. Gọi $A, B, C$ lần lượt là các điểm biểu diễn của $z_1, z_2, z_3$ trên mặt phẳng tọa độ. Diện tích tam giác $ABC$ bằng bao nhiêu?

Dạng: Diện tích tam giác tạo bởi các điểm biểu diễn số phức; dùng mô-đun, đẳng thức hình bình hành (trung tuyến) và tính chất tam giác cân.

Phương pháp: Từ $|z_1| = |z_2| = 2$, $|z_3| = 1$ suy ra $OA = OB = 2$, $OC = 1$. Lấy mô-đun đẳng thức để tính $|z_1 + z_2|$, rồi dùng $|z_1+z_2|^2 + |z_1-z_2|^2 = 2(|z_1|^2 + |z_2|^2)$ tính $AB$. Chứng minh $\triangle ABC$ cân tại $C$ để $O, H, C$ thẳng hàng, suy ra đường cao $CH$; diện tích $S = \frac12 AB \cdot CH$.

Lời giải:
Từ $|z_1| = |z_2| = 2$ và $|z_3| = 1$: $OA = OB = 2$, $OC = 1$.

Lấy mô-đun hai vế của $8(z_1 + z_2)z_3 = 3z_1 z_2$:
$$8|z_1 + z_2|\,|z_3| = 3|z_1||z_2| \Rightarrow 8|z_1 + z_2|\cdot 1 = 3\cdot 2\cdot 2 \Rightarrow |z_1 + z_2| = \dfrac32.$$
Gọi $H$ là trung điểm $AB$ (biểu diễn $\dfrac{z_1+z_2}{2}$): $OH = \dfrac{|z_1+z_2|}{2} = \dfrac34$.

Đẳng thức hình bình hành $|z_1+z_2|^2 + |z_1-z_2|^2 = 2(|z_1|^2 + |z_2|^2)$:
$$|z_1 - z_2|^2 = 2(4 + 4) - \dfrac94 = \dfrac{55}{4} \Rightarrow AB = |z_1 - z_2| = \dfrac{\sqrt{55}}{2}.$$

Từ $8(z_1+z_2)z_3 = 3z_1z_2$, đặt $2a = \dfrac38$ và biến đổi $z_1(z_3 - a z_2) = (a z_1 - z_3)z_2$; lấy mô-đun cùng với $|z_1| = |z_2|$ suy ra $|z_3 - z_1| = |z_3 - z_2|$, tức $CA = CB$ nên $\triangle ABC$ cân tại $C$. Do đó $C, H, O$ cùng nằm trên trung trực của $AB$, nên $CH = |OC - OH| = 1 - \dfrac34 = \dfrac14$.

Diện tích: $S_{ABC} = \dfrac12 \cdot AB \cdot CH = \dfrac12 \cdot \dfrac{\sqrt{55}}{2} \cdot \dfrac14 = \dfrac{\sqrt{55}}{16}$.

Đáp số: $\dfrac{\sqrt{55}}{16}$ (đáp án B).

Dạng tương tự: Diện tích/độ dài từ điểm biểu diễn số phức — chuyển $|z_i|$ thành khoảng cách từ $O$; lấy mô-đun đẳng thức cho sẵn để có tổng/hiệu; dùng đẳng thức trung tuyến $|z_1+z_2|^2 + |z_1-z_2|^2 = 2(|z_1|^2 + |z_2|^2)$ để tính cạnh; khai thác tính cân/vuông để tìm đường cao.

---

[topic: COMPLEX_NUMBERS]
[source: Đề ôn 2022 - Câu 48]
[difficulty: ADVANCED]
[subTopic: dem_so_phuc_thoa_hai_dieu_kien_mo_dun]
[embedKey: Có bao nhiêu số phức z thỏa |z^2| = 2|z - bar z| và |(z-4)(bar z - 4i)| = |z + 4i|^2. Dạng: đếm số phức thỏa hai điều kiện mô-đun, dùng liên hợp.]
[status: reviewed]

Bài: Có bao nhiêu số phức $z$ thỏa mãn $|z^2| = 2|z - \bar{z}|$ và $\left|(z-4)(\bar{z} - 4i)\right| = |z + 4i|^2$?

Dạng: Đếm số phức thỏa hai điều kiện mô-đun; mấu chốt là nhận ra $\bar{z} - 4i = \overline{z + 4i}$ để rút gọn.

Phương pháp: Dùng $\bar z - 4i = \overline{z+4i}$ nên $|(z-4)(\bar z-4i)| = |z-4|\,|z+4i|$; điều kiện hai thành $|z+4i|=0$ hoặc $|z-4|=|z+4i|$. Đặt $z=x+yi$ giải kết hợp với điều kiện thứ nhất $|z|^2 = 4|y|$.

Lời giải:
Vì $\bar{z} - 4i = \overline{z + 4i}$ nên
$$\left|(z-4)(\bar z - 4i)\right| = |z-4|\cdot|\overline{z+4i}| = |z-4|\cdot|z+4i|.$$
Điều kiện thứ hai trở thành $|z-4|\cdot|z+4i| = |z+4i|^2$, suy ra $|z+4i| = 0$ hoặc $|z-4| = |z+4i|$.

Điều kiện thứ nhất: $|z^2| = |z|^2 = x^2+y^2$ và $|z-\bar z| = |2yi| = 2|y|$, nên $x^2 + y^2 = 4|y|$ $(\star)$.

- Nếu $|z+4i| = 0$ thì $z = -4i$ ($x=0, y=-4$): $(\star)$ cho $16 = 4\cdot 4$ (thỏa). → $z = -4i$.
- Nếu $|z-4| = |z+4i|$, đặt $z = x+yi$: $(x-4)^2 + y^2 = x^2 + (y+4)^2 \Leftrightarrow y = -x$. Thế vào $(\star)$: $2x^2 = 4|x| \Leftrightarrow |x| = 0$ hoặc $|x| = 2$, cho $z = 0$, $z = 2 - 2i$, $z = -2 + 2i$.

Vậy có $4$ số phức: $0,\ 2 - 2i,\ -2 + 2i,\ -4i$.

Đáp số: $4$ (đáp án D).

Dạng tương tự: Đếm số phức thỏa nhiều điều kiện mô-đun. Luôn thử nhận diện liên hợp ($\overline{z+a} = \bar z + \bar a$) để gộp tích mô-đun; tách thành các trường hợp tích bằng 0; đặt $z=x+yi$ đưa mỗi điều kiện về phương trình đại số của $x, y$ rồi giải hệ.

---

[topic: COMPLEX_NUMBERS]
[source: Đề ôn 2023 - Câu 42]
[difficulty: APPLICATION]
[subTopic: gtln_gtnn_mo_dun_z_bdt_tam_giac_bac_hai]
[embedKey: Số phức z thỏa |z^2 - 3 - 4i| = 2|z|. M, m là GTLN, GTNN của |z|. Tính M^2 + m^2. Dạng: cực trị mô-đun dùng bất đẳng thức tam giác đưa về bất phương trình bậc hai theo |z|^2.]
[status: reviewed]

Bài: Xét các số phức $z$ thỏa mãn $\left|z^2 - 3 - 4i\right| = 2|z|$. Gọi $M$ và $m$ lần lượt là giá trị lớn nhất và giá trị nhỏ nhất của $|z|$. Giá trị của $M^2 + m^2$ bằng bao nhiêu?

Dạng: Tìm GTLN–GTNN của $|z|$ từ một đẳng thức mô-đun, bằng bất đẳng thức tam giác đưa về bất phương trình bậc hai theo $|z|^2$.

Phương pháp: Dùng $|z^2| = |z|^2$ và $|u - v| \ge \big||u| - |v|\big|$ để chặn $2|z| = |z^2 - (3+4i)| \ge \big||z|^2 - 5\big|$; bình phương đưa về bất phương trình trùng phương theo $|z|$; suy ra $M, m$.

Lời giải:
Áp dụng bất đẳng thức tam giác (với $|z^2| = |z|^2$, $|3 + 4i| = 5$):
$$2|z| = \left|z^2 - 3 - 4i\right| \ge \big||z^2| - |3 + 4i|\big| = \big||z|^2 - 5\big|.$$
Suy ra $4|z|^2 \ge \big(|z|^2 - 5\big)^2 \Leftrightarrow |z|^4 - 14|z|^2 + 25 \le 0 \Leftrightarrow 7 - 2\sqrt6 \le |z|^2 \le 7 + 2\sqrt6$.

Vì $7 \pm 2\sqrt6 = (\sqrt6 \pm 1)^2$ nên $\sqrt6 - 1 \le |z| \le \sqrt6 + 1$.

Do đó $M = \sqrt6 + 1$, $m = \sqrt6 - 1$ (đạt được khi $z^2 = k(3 + 4i)$), nên
$$M^2 + m^2 = (7 + 2\sqrt6) + (7 - 2\sqrt6) = 14.$$

Đáp số: $14$ (đáp án C).

Dạng tương tự: Cực trị $|z|$ từ đẳng thức $|z^2 - w| = k|z|$ — dùng $|z^2| = |z|^2$ và bất đẳng thức tam giác để ra bất phương trình bậc hai theo $t = |z|^2$, từ đó chặn $|z|$. Nhớ kiểm tra dấu bằng tồn tại ($z^2$ cùng phương $w$).

---

[topic: COMPLEX_NUMBERS]
[source: Đề ôn 2023 - Câu 45]
[difficulty: APPLICATION]
[subTopic: pt_bac_hai_phuc_tong_mo_dun_hai_nghiem_theo_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Trên tập phức xét z^2 - 2(m+1)z + m^2 = 0 (m thực). Có bao nhiêu giá trị m để phương trình có hai nghiệm phân biệt z1, z2 thỏa |z1| + |z2| = 2. Dạng: phương trình bậc hai hệ số thực trên tập phức, tổng mô-đun hai nghiệm theo tham số.]
[status: reviewed]

Bài: Trên tập hợp các số phức, xét phương trình $z^2 - 2(m+1)z + m^2 = 0$ ($m$ là số thực). Có bao nhiêu giá trị của $m$ để phương trình đó có hai nghiệm phân biệt $z_1, z_2$ thỏa mãn $|z_1| + |z_2| = 2$?

Dạng: Phương trình bậc hai hệ số thực trên tập phức; điều kiện tổng mô-đun hai nghiệm theo tham số.

Phương pháp: Tính $\Delta' = 2m + 1$; chia hai trường hợp. Nghiệm phức liên hợp ($\Delta' < 0$): $|z_1| = |z_2| = \sqrt{m^2} = |m|$. Nghiệm thực ($\Delta' > 0$): vì $z_1 z_2 = m^2 \ge 0$ nên $|z_1| + |z_2| = |z_1 + z_2| = |2(m+1)|$. Giải từng trường hợp và đối chiếu điều kiện.

Lời giải:
$\Delta' = (m+1)^2 - m^2 = 2m + 1$.

Trường hợp 1: $\Delta' < 0 \Leftrightarrow m < -\dfrac12$ — hai nghiệm phức liên hợp, $|z_1| = |z_2| = \sqrt{z_1 z_2} = \sqrt{m^2} = |m|$. Khi đó $|z_1| + |z_2| = 2|m| = 2 \Leftrightarrow |m| = 1 \Leftrightarrow m = \pm 1$. Kết hợp $m < -\dfrac12$ → $m = -1$.

Trường hợp 2: $\Delta' > 0 \Leftrightarrow m > -\dfrac12$ — hai nghiệm thực phân biệt với $z_1 z_2 = m^2 \ge 0$ nên cùng dấu (hoặc bằng 0), do đó $|z_1| + |z_2| = |z_1 + z_2| = |2(m+1)| = 2 \Leftrightarrow |m+1| = 1 \Leftrightarrow m = 0$ hoặc $m = -2$. Kết hợp $m > -\dfrac12$ → $m = 0$.

Vậy có hai giá trị $m \in \{-1; 0\}$ (kiểm tra: $m = -1$ cho $z = \pm i$, tổng mô-đun bằng $2$; $m = 0$ cho $z \in \{0; 2\}$, tổng mô-đun bằng $2$).

Đáp số: $2$ giá trị (đáp án C).

Dạng tương tự: Phương trình bậc hai hệ số thực trên tập phức với điều kiện $|z_1| + |z_2| = k$. Chia theo dấu $\Delta$: nghiệm phức liên hợp dùng $|z_1| = |z_2| = \sqrt{c/a}$; nghiệm thực cùng dấu dùng $|z_1| + |z_2| = |z_1 + z_2|$ (Viète). Luôn đối chiếu điều kiện $\Delta$ và yêu cầu "phân biệt".

---

[topic: COMPLEX_NUMBERS]
[source: Đề chính thức 2024 - Mã 123 - Câu 42]
[difficulty: APPLICATION]
[subTopic: dem_m_nguyen_ton_tai_dung_hai_so_phuc_elip_suy_bien]
[relatedTopics: ANALYTIC_GEOMETRY]
[embedKey: Có bao nhiêu m nguyên để tồn tại đúng hai số phức z thỏa |z-1-5i| + |z-1+5i| = 10 và |z-2-i| = m. Dạng: đếm tham số để đường tròn cắt elip suy biến (đoạn thẳng) tại đúng hai điểm.]
[status: reviewed]

Bài: Có bao nhiêu giá trị nguyên của tham số $m$ sao cho ứng với mỗi $m$ tồn tại đúng hai số phức $z$ thỏa mãn $|z - 1 - 5i| + |z - 1 + 5i| = 10$ và $|z - 2 - i| = m$?

Dạng: Đếm số giá trị tham số để "đường tròn" $|z - z_0| = m$ cắt một tập điểm (elip suy biến thành đoạn thẳng) tại đúng hai điểm.

Phương pháp: Đặt $t = z - 1$ để đưa về các điểm $A, B, C$; nhận ra $TA + TB = AB = 10$ nên tập hợp $T$ là đoạn thẳng $AB$; xét đường tròn tâm $C$ bán kính $m$ cắt đoạn $AB$ tại đúng 2 điểm; dùng khoảng cách từ $C$ đến đoạn và tới hai đầu mút để chặn $m$.

Lời giải:
Đặt $z - 1 = t$; giả thiết thành $|t - 5i| + |t + 5i| = 10$ và $|t - 1 - i| = m$. Gọi $A(0; 5)$, $B(0; -5)$, $C(1; 1)$ và $T$ là điểm biểu diễn $t$.

Vì $TA + TB = 10 = AB$ nên $T$ thuộc đoạn thẳng $AB$ (trên trục tung, $-5 \le y \le 5$).

$C(1; 1)$ có hình chiếu lên đường thẳng $AB$ là $H(0; 1)$ (thuộc đoạn $AB$), khoảng cách $CH = 1$. Với $T(0; y)$: $TC = \sqrt{1 + (y-1)^2}$. Tính từ $H$: nhánh lên tới $A$ cho $TC$ tăng từ $1$ đến $AC = \sqrt{1 + 16} = \sqrt{17}$; nhánh xuống tới $B$ cho $TC$ tăng từ $1$ đến $BC = \sqrt{1 + 36} = \sqrt{37}$.

Đường tròn tâm $C$ bán kính $m$ cắt đoạn $AB$ tại đúng hai điểm $\Leftrightarrow 1 < m \le \sqrt{17}$ (cắt cả hai nhánh).

$m$ nguyên $\Rightarrow m \in \{2; 3; 4\}$ (vì $\sqrt{17} \approx 4{,}12$).

Đáp số: $3$ giá trị (đáp án A).

Dạng tương tự: Khi $TA + TB = AB$, tập điểm là đoạn thẳng (elip suy biến). Bài "tồn tại đúng $n$ số phức với $TC = m$" quy về số giao của đường tròn tâm $C$ với đoạn thẳng: dựng hình chiếu $H$ của $C$, so sánh $m$ với $CH$ (nhỏ nhất) và khoảng cách tới hai đầu mút để đếm.

---

[topic: COMPLEX_NUMBERS]
[source: Đề chính thức 2024 - Mã 123 - Câu 43]
[difficulty: APPLICATION]
[subTopic: pt_bac_hai_phuc_nghich_dao_dem_k_nguyen_diem_tung_do_nguyen]
[relatedTopics: ANALYTIC_GEOMETRY]
[embedKey: az^2+bz+c=0 có hai nghiệm phức z1,z2 phần ảo khác 0, |2z1 - 1/9| = |z1 - z2|, |z1| = 1/sqrt(k), w nghiệm cw^2+bw+a=0. Đếm k nguyên dương để tồn tại đúng 9 số phức z3 phần ảo nguyên, z3 - w thuần ảo, |z3| <= |w|. Dạng: nghịch đảo nghiệm, hệ thức lượng tam giác vuông, đếm điểm nguyên trên đoạn.]
[status: reviewed]

Bài: Xét phương trình bậc hai $az^2 + bz + c = 0$ ($a, b, c \in \mathbb{R}$, $a \ne 0$) có hai nghiệm phức $z_1, z_2$ có phần ảo khác $0$ và $\left|2z_1 - \dfrac19\right| = |z_1 - z_2|$. Giả sử $|z_1| = \dfrac{1}{\sqrt k}$ và $w$ là số phức thỏa $cw^2 + bw + a = 0$. Có bao nhiêu số nguyên dương $k$ sao cho ứng với mỗi $k$ tồn tại đúng $9$ số phức $z_3$ có phần ảo nguyên, $z_3 - w$ là số thuần ảo và $|z_3| \le |w|$?

Dạng: Phương trình bậc hai phức với các nghiệm nghịch đảo, kết hợp hệ thức lượng tam giác vuông và đếm điểm có tung độ nguyên trên một đoạn (câu khó — gần mức vận dụng cao).

Phương pháp: Nghiệm của $cw^2+bw+a=0$ là nghịch đảo nghiệm của $az^2+bz+c=0$, nên $w_1 = 1/z_1$, $|w_1| = \sqrt k$; chuyển điều kiện về $A, B$ (biểu diễn $w_1, w_2$ liên hợp) và $C(18; 0)$, được tam giác $OAC$ vuông tại $A$; điều kiện "9 điểm tung độ nguyên trên đoạn $AB$" cho $8 \le AB < 10$ (tức $4 \le IA < 5$); dùng $OA^2 = OI\cdot OC$ và Pytago để ra bất phương trình theo $k$.

Lời giải:
Mỗi nghiệm của $az^2+bz+c=0$ là nghịch đảo nghiệm của $cw^2+bw+a=0$; gọi $w_1 = \dfrac{1}{z_1}$, $w_2 = \dfrac{1}{z_2}$, khi đó $|w_1| = \dfrac{1}{|z_1|} = \sqrt k$.

Điều kiện $\left|\dfrac{2}{w_1} - \dfrac19\right| = \left|\dfrac{1}{w_1} - \dfrac{1}{w_2}\right|$, biến đổi cho $\sqrt k\,|18 - w_1| = 9|w_1 - w_2|$. Gọi $A, B$ là điểm biểu diễn $w_1, w_2$ và $C(18; 0)$ thì $AB = \dfrac{\sqrt k}{9}\,AC$ $(*)$.

Vì $a, b, c \in \mathbb{R}$ nên $w_1, w_2$ liên hợp: $OA = OB = \sqrt k$, $A, B$ đối xứng qua $Ox$; tam giác $ABC$ cân tại $C$ đáy $AB$. Do $OC = 18$, $(*)$ viết lại $\dfrac12 AB\cdot OC = OA\cdot AC$, mà $\dfrac12 AB\cdot OC = 2S_{AOC} \le OA\cdot AC$; đẳng thức xảy ra nên tam giác $OAC$ vuông tại $A$.

Gọi $D$ biểu diễn $z_3$. Vì $z_3 - w$ thuần ảo nên $A, B, D$ thẳng hàng; $|z_3| \le |w|$ nên $D$ thuộc đoạn $AB$. Cần $9$ điểm $D$ có tung độ nguyên trên đoạn $AB$ $\Rightarrow 8 \le AB < 10$.

Gọi $I$ là trung điểm $AB$ ($I \in OC$). Hệ thức lượng tam giác vuông $OAC$: $OA^2 = OI\cdot OC \Leftrightarrow k = 18\,OI \Rightarrow OI = \dfrac{k}{18}$. Pytago: $IA^2 = OA^2 - OI^2 = k - \dfrac{k^2}{18^2}$.

Từ $4 \le IA < 5$: $16 \le k - \dfrac{k^2}{324} < 25$. Giải ra $17 \le k \le 27$ hoặc $297 \le k \le 307$.

Vậy có $11 + 11 = 22$ giá trị $k$ nguyên dương.

Đáp số: $22$ (đáp án C).

Dạng tương tự: Khai thác "nghiệm nghịch đảo" giữa $az^2+bz+c=0$ và $cw^2+bw+a=0$ ($|w| = 1/|z|$); chuyển điều kiện mô-đun thành quan hệ độ dài cạnh, nhận ra tam giác vuông từ dấu "=" của bất đẳng thức diện tích, rồi dùng hệ thức lượng + Pytago và điều kiện "đếm điểm nguyên trên đoạn" để ra bất phương trình theo tham số.

# VDC - Hàm số & Đạo hàm (FUNCTIONS / DERIVATIVES) — Đề THPT QG 2021, Mã 101

---

[topic: FUNCTIONS]
[source: THPT QG 2021 - Mã 101 - Câu 41]
[difficulty: APPLICATION]
[subTopic: so_nghiem_pt_ham_hop_f_f_x_tu_do_thi]
[relatedTopics: DERIVATIVES]
[embedKey: Cho hàm bậc ba y = f(x) có đồ thị, cực đại (-1;3), cực tiểu (1;-1). Số nghiệm thực phân biệt của phương trình f(f(x)) = 1. Dạng: đếm nghiệm phương trình hàm hợp từ đồ thị.]
[status: reviewed]

Bài: Cho hàm số bậc ba $y = f(x)$ có đồ thị là đường cong trong hình. [có hình] Đồ thị có hệ số bậc cao nhất dương; điểm cực đại là $(-1; 3)$, điểm cực tiểu là $(1; -1)$; đồ thị đi qua điểm $(0; 1)$ và cắt trục hoành tại ba điểm phân biệt. Số nghiệm thực phân biệt của phương trình $f(f(x)) = 1$ là bao nhiêu?

Dạng: Đếm số nghiệm của phương trình hàm hợp $f(f(x)) = k$ dựa vào đồ thị.

Phương pháp: Đặt $t = f(x)$; tìm các nghiệm $t_i$ của $f(t) = k$ theo đồ thị; với mỗi $t_i$ đếm số nghiệm của $f(x) = t_i$ dựa vị trí $t_i$ so với giá trị cực đại/cực tiểu; cộng lại.

Lời giải:
Đặt $t = f(x)$. Đường thẳng $y = 1$ cắt đồ thị tại ba điểm có hoành độ $t_1 = a\ (a < -1)$, $t_2 = 0$, $t_3 = b\ (1 < b < 2)$.

Do đó $f(f(x)) = 1 \Leftrightarrow f(x) = a\ (a<-1)$ hoặc $f(x) = 0$ hoặc $f(x) = b\ (1<b<2)$.

Đếm số nghiệm mỗi phương trình $f(x) = k$ (số giao điểm của $y = k$ với đồ thị; nhớ giá trị cực đại $= 3$, cực tiểu $= -1$):

- $f(x) = a$ với $a < -1$ (dưới giá trị cực tiểu): có $1$ nghiệm.
- $f(x) = 0$ với $-1 < 0 < 3$: có $3$ nghiệm.
- $f(x) = b$ với $1 < b < 2$ (giữa cực tiểu và cực đại): có $3$ nghiệm.

Tổng: $1 + 3 + 3 = 7$ nghiệm phân biệt.

Đáp số: $7$ (đáp án B).

Dạng tương tự: Phương trình $f(u(x)) = k$ hoặc $f(f(x)) = k$ cho bằng đồ thị: đặt ẩn $t$, đọc đồ thị tìm các nghiệm $t_i$ của $f(t) = k$, sau đó với mỗi $t_i$ đếm số nghiệm $f(x) = t_i$ theo vị trí $t_i$ so với cực trị; tổng các số nghiệm là kết quả.

---

[topic: DERIVATIVES]
[source: THPT QG 2021 - Mã 101 - Câu 50]
[difficulty: ADVANCED]
[subTopic: cuc_tri_ham_hop_chua_tri_tuyet_doi_co_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Cho f'(x) = (x-7)(x^2-9). Có bao nhiêu giá trị nguyên dương m để g(x) = f(|x^3+5x|+m) có ít nhất 3 điểm cực trị. Dạng: đếm cực trị hàm hợp chứa trị tuyệt đối có tham số.]
[status: reviewed]

Bài: Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = (x-7)(x^2 - 9),\ \forall x \in \mathbb{R}$. Có bao nhiêu giá trị nguyên dương của tham số $m$ để hàm số $g(x) = f\!\left(\left|x^3 + 5x\right| + m\right)$ có ít nhất $3$ điểm cực trị?

Dạng: Đếm số điểm cực trị của hàm hợp $g(x) = f(|\varphi(x)| + m)$ chứa trị tuyệt đối và tham số.

Phương pháp: Tính $g'(x) = u'(x)\,f'(u(x)+m)$ với $u = |\varphi(x)|$; điểm $\varphi(x)=0$ (nơi $|\varphi|$ không khả vi, đổi chiều) cho một cực trị cố định; nghiệm $f'(u+m)=0$ quy về $|\varphi(x)| = c_i - m$; đếm nghiệm theo dấu $c_i - m$ và yêu cầu số cực trị.

Lời giải:
$f'(x) = (x-7)(x^2-9) = 0 \Leftrightarrow x \in \{-3; 3; 7\}$.

Đặt $u(x) = \left|x^3 + 5x\right|$, ta có $g'(x) = u'(x)\cdot f'\!\big(u(x) + m\big)$.

Hàm $h(x) = x^3 + 5x$ có $h'(x) = 3x^2 + 5 > 0$ nên $h$ đồng biến và $h(x) = 0 \Leftrightarrow x = 0$. Do đó $u(x) = |x^3+5x|$ có dạng chữ V: giảm trên $(-\infty;0)$, tăng trên $(0;+\infty)$, đạt giá trị nhỏ nhất $0$ tại $x = 0$ và không khả vi tại đó → $x = 0$ luôn là một điểm cực trị của $g$.

$f'(u + m) = 0 \Leftrightarrow u + m \in \{-3; 3; 7\} \Leftrightarrow \left|x^3 + 5x\right| \in \{-3 - m;\ 3 - m;\ 7 - m\}$.

Vì $\left|x^3 + 5x\right| \ge 0$ và mỗi giá trị dương $k$ làm phương trình $\left|x^3+5x\right| = k$ có đúng $2$ nghiệm (đối xứng qua $x = 0$), nên để $g$ có thêm cực trị (ngoài $x = 0$) cần số lớn nhất trong ba số trên dương: $7 - m > 0 \Leftrightarrow m < 7$.

$m$ nguyên dương → $m \in \{1; 2; 3; 4; 5; 6\}$.

Đáp số: $6$ giá trị (đáp án A).

Dạng tương tự: Đếm cực trị của $g(x) = f(|\varphi(x)| + m)$ khi biết $f'$. Mấu chốt: (1) điểm làm $|\varphi(x)|$ không khả vi/đổi chiều cho cực trị cố định; (2) nghiệm $f'(\cdot)=0$ quy về $|\varphi(x)| = c_i - m$; (3) đếm nghiệm theo dấu $c_i - m$ rồi đối chiếu yêu cầu số cực trị.

---

[topic: DERIVATIVES]
[source: Đề ôn 2022 - Câu 40]
[difficulty: APPLICATION]
[subTopic: gtln_gtnn_ham_trung_phuong_tren_doan_co_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Cho f(x) = (m-1)x^4 - 2mx^2 + 1. Nếu min trên [0;3] của f(x) = f(2) thì max trên [0;3] bằng bao nhiêu. Dạng: GTLN-GTNN hàm trùng phương trên đoạn có tham số.]
[status: reviewed]

Bài: Cho hàm số $f(x) = (m-1)x^4 - 2mx^2 + 1$ với $m$ là tham số thực. Nếu $\min\limits_{[0;3]} f(x) = f(2)$ thì $\max\limits_{[0;3]} f(x)$ bằng bao nhiêu?

Dạng: Giá trị lớn nhất – nhỏ nhất của hàm trùng phương trên đoạn, có tham số; dùng điều kiện điểm đạt min để tìm tham số.

Phương pháp: Tính $f'(x)$; từ giả thiết $\min_{[0;3]}f = f(2)$ suy ra $x = 2$ là nghiệm $f'(x) = 0$ để tìm $m$; thay $m$, tính $f$ tại các đầu mút và điểm tới hạn rồi lấy max.

Lời giải:
$f'(x) = 4(m-1)x^3 - 4mx = 4x\big[(m-1)x^2 - m\big]$.

$f'(x) = 0 \Leftrightarrow x = 0$ hoặc $x^2 = \dfrac{m}{m-1}$ (với $m = 1$ không thỏa yêu cầu).

Vì $\min\limits_{[0;3]} f(x) = f(2)$ nên $x = 2$ là nghiệm của $f'(x) = 0$:
$$\dfrac{m}{m-1} = 4 \Leftrightarrow m = 4m - 4 \Leftrightarrow m = \dfrac43.$$

Khi đó $f(x) = \dfrac13 x^4 - \dfrac83 x^2 + 1$. Tính tại các mốc:
$$f(0) = 1,\quad f(2) = \dfrac{16}{3} - \dfrac{32}{3} + 1 = -\dfrac{13}{3},\quad f(3) = 27 - 24 + 1 = 4.$$

So sánh: $\min\limits_{[0;3]} f = f(2) = -\dfrac{13}{3}$ (đúng giả thiết) và $\max\limits_{[0;3]} f = f(3) = 4$.

Đáp số: $4$ (đáp án B).

Dạng tương tự: Hàm trùng phương/bậc bốn trên đoạn có tham số, biết vị trí đạt min hoặc max. Dùng $f'(x) = 0$ tại điểm đó để giải tham số, rồi so sánh giá trị tại đầu mút và điểm tới hạn. Lưu ý loại trường hợp suy biến (ở đây $m = 1$).

---

[topic: DERIVATIVES]
[source: Đề ôn 2022 - Câu 50]
[difficulty: ADVANCED]
[subTopic: cuc_tri_ham_tri_tuyet_doi_bac_bon_co_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu giá trị nguyên dương m để y = |x^4 - 2mx^2 + 64x| có đúng ba điểm cực trị. Dạng: số cực trị của hàm trị tuyệt đối bậc bốn có tham số.]
[status: reviewed]

Bài: Có bao nhiêu giá trị nguyên dương của tham số $m$ để hàm số $y = \left|x^4 - 2mx^2 + 64x\right|$ có đúng ba điểm cực trị?

Dạng: Số điểm cực trị của hàm trị tuyệt đối $y = |P(x)|$ với $P$ bậc bốn chứa tham số.

Phương pháp: Số cực trị của $|P(x)|$ = số cực trị của $P$ + số nghiệm đơn của $P(x)=0$. Ở đây $P(x)=0$ có sẵn nghiệm $x=0$, nên điều kiện "$|P|$ có đúng 3 cực trị" quy về "$P$ có đúng một cực trị", tức $P'(x)=0$ có đúng một nghiệm đơn; cô lập $m$ và lập bảng biến thiên.

Lời giải:
Xét $P(x) = x^4 - 2mx^2 + 64x$, có $P'(x) = 4x^3 - 4mx + 64$.

$P(x) = 0 \Leftrightarrow x(x^3 - 2mx + 64) = 0$ luôn có nghiệm $x = 0$, và $\lim_{x\to+\infty}P(x) = +\infty$. Để $y = |P(x)|$ có đúng ba điểm cực trị thì $P(x)$ phải có đúng một điểm cực trị, tức $P'(x) = 0$ có đúng một nghiệm đơn:
$$4x^3 - 4mx + 64 = 0 \Leftrightarrow m = x^2 + \dfrac{16}{x}\quad (x \ne 0).$$
Xét $h(x) = x^2 + \dfrac{16}{x}$, $h'(x) = 2x - \dfrac{16}{x^2} = 0 \Leftrightarrow x^3 = 8 \Leftrightarrow x = 2$, $h(2) = 12$.

Bảng biến thiên: trên nhánh $x < 0$, $h$ đơn điệu và nhận mọi giá trị (luôn cho 1 nghiệm); trên nhánh $x > 0$, $h$ đạt cực tiểu $12$ tại $x = 2$. Do đó $P$ có đúng một cực trị khi đường thẳng $y = m$ cắt đồ thị $h$ tại đúng một điểm, tức $m \le 12$.

Vì $m$ nguyên dương nên $m \in \{1; 2; 3; \dots; 11; 12\}$.

Đáp số: $12$ giá trị (đáp án C).

Dạng tương tự: Số cực trị của $y = |P(x)|$ = (số cực trị của $P$) + (số nghiệm đơn của $P=0$). Khi $P=0$ có sẵn $k$ nghiệm đơn, quy điều kiện về số cực trị của $P$; cô lập tham số $m = \varphi(x)$ và dùng bảng biến thiên của $\varphi$ để đếm.

---

[topic: DERIVATIVES]
[source: Đề ôn 2023 - Câu 41]
[difficulty: APPLICATION]
[subTopic: ba_diem_cuc_tri_ham_bac_bon_co_tham_so_co_lap_m]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu giá trị nguyên m để y = -x^4 + 6x^2 + mx có ba điểm cực trị. Dạng: ba cực trị hàm bậc bốn, cô lập tham số m và lập bảng biến thiên.]
[status: reviewed]

Bài: Có bao nhiêu giá trị nguyên của tham số $m$ để hàm số $y = -x^4 + 6x^2 + mx$ có ba điểm cực trị?

Dạng: Tìm số giá trị nguyên của tham số để hàm bậc bốn (không trùng phương) có ba điểm cực trị.

Phương pháp: Hàm bậc bốn có ba cực trị $\Leftrightarrow y' = 0$ có ba nghiệm phân biệt; cô lập $m = g(x)$, khảo sát $g$ và dùng bảng biến thiên để tìm điều kiện đường thẳng $y = m$ cắt đồ thị tại ba điểm.

Lời giải:
$y' = -4x^3 + 12x + m$. $y' = 0 \Leftrightarrow m = 4x^3 - 12x$ $(1)$.

Hàm có ba điểm cực trị $\Leftrightarrow (1)$ có ba nghiệm phân biệt. Xét $g(x) = 4x^3 - 12x$, $g'(x) = 12x^2 - 12 = 0 \Leftrightarrow x = \pm 1$.

Bảng biến thiên: $g(-1) = 8$ (cực đại), $g(1) = -8$ (cực tiểu). Đường thẳng $y = m$ cắt đồ thị $g$ tại ba điểm phân biệt $\Leftrightarrow -8 < m < 8$.

$m \in \mathbb{Z} \Rightarrow m \in \{-7; -6; \dots; 6; 7\}$.

Đáp số: $15$ giá trị (đáp án B).

Dạng tương tự: Hàm bậc bốn dạng $\pm x^4 + bx^2 + mx$ (có hạng tử bậc nhất nên không trùng phương) có ba cực trị khi $y' = 0$ có ba nghiệm phân biệt. Cô lập $m = g(x)$, lập bảng biến thiên $g$, lấy $m$ nằm nghiêm ngặt giữa hai giá trị cực trị của $g$.

---

[topic: DERIVATIVES]
[source: Đề ôn 2023 - Câu 50]
[difficulty: ADVANCED]
[subTopic: dong_bien_ham_tri_tuyet_doi_tren_khoang_co_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu giá trị nguyên a trong (-10;+vc) để y = |x^3 + (a+2)x + 9 - a^2| đồng biến trên (0;1). Dạng: tính đơn điệu của hàm trị tuyệt đối trên một khoảng có tham số.]
[status: reviewed]

Bài: Có bao nhiêu giá trị nguyên của tham số $a \in (-10; +\infty)$ để hàm số $y = \left|x^3 + (a+2)x + 9 - a^2\right|$ đồng biến trên khoảng $(0; 1)$?

Dạng: Tính đơn điệu (đồng biến) của hàm trị tuyệt đối $y = |f(x)|$ trên một khoảng, có tham số.

Phương pháp: $|f|$ đồng biến trên $(0;1)$ trong hai trường hợp: ($f \ge 0$ và $f$ đồng biến) hoặc ($f \le 0$ và $f$ nghịch biến). Mỗi trường hợp gồm điều kiện dấu của $f'$ trên $(0;1)$ (cô lập $a$ qua $\max/\min$ của $-3x^2-2$) và dấu của $f(0)$. Hợp nghiệm rồi đếm số nguyên.

Lời giải:
Xét $f(x) = x^3 + (a+2)x + 9 - a^2$, $f'(x) = 3x^2 + a + 2$, và $f(0) = 9 - a^2$.

Trường hợp 1: $\begin{cases} f'(x) \ge 0\ \forall x\in(0;1) \\ f(0) \ge 0 \end{cases}$
$f'(x) \ge 0 \Leftrightarrow a \ge \max_{(0;1)}(-3x^2 - 2) = -2$; $f(0) \ge 0 \Leftrightarrow -3 \le a \le 3$. Hợp lại $a \in [-2; 3]$ → $a \in \{-2; -1; 0; 1; 2; 3\}$ ($6$ giá trị).

Trường hợp 2: $\begin{cases} f'(x) \le 0\ \forall x\in(0;1) \\ f(0) \le 0 \end{cases}$
$f'(x) \le 0 \Leftrightarrow a \le \min_{(0;1)}(-3x^2 - 2) = -5$; $f(0) \le 0 \Leftrightarrow a \le -3$ hoặc $a \ge 3$. Hợp lại $a \le -5$; kết hợp $a \in (-10; +\infty)$ → $a \in \{-9; -8; -7; -6; -5\}$ ($5$ giá trị).

Tổng cộng $6 + 5 = 11$ giá trị.

Đáp số: $11$ (đáp án B).

Dạng tương tự: $y = |f(x)|$ đồng biến trên khoảng $I$ ⟺ ($f \ge 0$ và $f$ tăng) hoặc ($f \le 0$ và $f$ giảm) trên $I$. Cô lập tham số trong điều kiện dấu $f'$ bằng $\max/\min$ của biểu thức trên $I$, kết hợp dấu của $f$ tại đầu mút, rồi hợp nghiệm hai trường hợp.

---

[topic: DERIVATIVES]
[source: Đề chính thức 2024 - Mã 123 - Câu 40]
[difficulty: APPLICATION]
[subTopic: bpt_f_x_le_m_co_nghiem_tren_doan_ham_bac_bon]
[relatedTopics: FUNCTIONS]
[embedKey: Hàm bậc bốn có ba cực trị -3/2, 2, 11/2, đạt GTNN trên R. Bất phương trình f(x) <= m có nghiệm trên [0;3] khi nào. Dạng: điều kiện có nghiệm của f(x) <= m trên đoạn dùng GTNN.]
[status: reviewed]

Bài: Cho hàm số bậc bốn $y = f(x)$ có ba điểm cực trị là $-\dfrac32;\ 2;\ \dfrac{11}{2}$ và đạt giá trị nhỏ nhất trên $\mathbb{R}$. Bất phương trình $f(x) \le m$ có nghiệm thuộc đoạn $[0; 3]$ khi và chỉ khi nào?

Dạng: Điều kiện để bất phương trình $f(x) \le m$ có nghiệm trên một đoạn — quy về so sánh $m$ với giá trị nhỏ nhất của $f$ trên đoạn.

Phương pháp: "Đạt GTNN trên $\mathbb{R}$" cho hệ số bậc cao nhất dương; ba cực trị $-\frac32, 2, \frac{11}{2}$ đối xứng qua $x = 2$ nên đồ thị đối xứng qua $x = 2$; xét tính đơn điệu để tìm $\min_{[0;3]} f$; $f(x) \le m$ có nghiệm trên đoạn $\Leftrightarrow m \ge \min_{[0;3]} f$.

Lời giải:
Hàm bậc bốn đạt giá trị nhỏ nhất trên $\mathbb{R}$ nên hệ số bậc cao nhất $a > 0$; khi đó $x = -\frac32$ và $x = \frac{11}{2}$ là điểm cực tiểu, $x = 2$ là điểm cực đại. Vì $\dfrac{-\frac32 + \frac{11}{2}}{2} = 2$ nên đồ thị đối xứng qua đường thẳng $x = 2$, suy ra $f(1) = f(3)$.

Trên $[0; 3]$: hàm đồng biến trên $\left(-\frac32; 2\right)$ nên $f(0) < f(1) = f(3)$. Do $x = 2$ là cực đại, giá trị nhỏ nhất trên $[0; 3]$ đạt tại đầu mút, mà $f(0) < f(3)$ nên $\min_{[0;3]} f(x) = f(0)$.

Bất phương trình $f(x) \le m$ có nghiệm thuộc $[0; 3] \Leftrightarrow m \ge \min_{[0;3]} f(x) = f(0)$.

Đáp số: $m \ge f(0)$ (đáp án B).

Dạng tương tự: "$f(x) \le m$ có nghiệm trên đoạn $[\alpha; \beta]$" $\Leftrightarrow m \ge \min_{[\alpha;\beta]} f$; "$f(x) \ge m$ có nghiệm" $\Leftrightarrow m \le \max$. Khai thác đối xứng của đồ thị (trục là trung bình hai cực tiểu) và tính đơn điệu để xác định min/max tại đầu mút.

---

[topic: DERIVATIVES]
[source: Đề chính thức 2024 - Mã 123 - Câu 49]
[difficulty: ADVANCED]
[subTopic: cuc_tri_ham_tri_tuyet_doi_f_cong_5_tren_x_binh_co_tham_so]
[relatedTopics: FUNCTIONS]
[embedKey: f bậc bốn, f(-1) = -5, f'(x) đồng biến trên R, f'(4) = 0, f'(-1) = a. Có bao nhiêu số nguyên a trong (-100;0) để y = |f(x) + 5/x^2| có đúng 3 cực trị trên (-1;+vc). Dạng: số cực trị hàm trị tuyệt đối có tham số, dùng dấu đạo hàm trên các khoảng.]
[status: reviewed]

Bài: Xét hàm số bậc bốn $y = f(x)$ có $f(-1) = -5$. Hàm số $y = f'(x)$ đồng biến trên khoảng $(-\infty; +\infty)$, $f'(4) = 0$ và $f'(-1) = a$. Có bao nhiêu số nguyên $a \in (-100; 0)$ sao cho ứng với mỗi $a$, hàm số $y = \left|f(x) + \dfrac{5}{x^2}\right|$ có đúng $3$ điểm cực trị thuộc khoảng $(-1; +\infty)$?

Dạng: Đếm số cực trị của hàm trị tuyệt đối $y = |g(x)|$ (với $g = f + \frac{5}{x^2}$) trên một khoảng, có tham số $a = f'(-1)$.

Phương pháp: Từ "$f'$ đồng biến" suy ra $f'' \ge 0$ và $f'(4)=0$ cho $f$ có cực tiểu duy nhất tại $x=4$; xét $g(x) = f(x) + \frac{5}{x^2}$, đếm nghiệm $g=0$ và cực trị $g'=0$; quy điều kiện "3 cực trị trên $(-1;+\infty)$" về số nghiệm của $g'(x)=0$, rồi dùng dấu $g'(-1) = a + 10$.

Lời giải:
Vì $f'$ đồng biến nên $f''(x) \ge 0\ \forall x$; $f'(4) = 0$ nên $x = 4$ là điểm cực tiểu duy nhất của $f$, do đó $f(x) \ge f(4)\ \forall x$ và $f(4) < f(-1) = -5$.

Đặt $g(x) = f(x) + \dfrac{5}{x^2}$, $g'(x) = f'(x) - \dfrac{10}{x^3}$. Ta có $g(-1) = f(-1) + 5 = 0$, $g(4) = f(4) + \dfrac{5}{16} < 0$, $\displaystyle\lim_{x\to 0}g(x) = +\infty$, $\displaystyle\lim_{x\to+\infty}g(x) = +\infty$; nên trên $(-1;+\infty)$, phương trình $g(x) = 0$ có hai nghiệm (thuộc $(0;4)$ và $(4;+\infty)$). Vì $y = |g(x)|$, các điểm cực trị của $y$ gồm nghiệm của $g(x)=0$ và của $g'(x)=0$.

Do $f''(x) \ge 0$ nên $g'(x)$ đồng biến trên mỗi khoảng $(-1;0)$ và $(0;+\infty)$. Trên $(0;+\infty)$: $\lim_{x\to0^+}g' = -\infty$, $\lim_{x\to+\infty}g' = +\infty$ nên $g'(x)=0$ có đúng một nghiệm. Để $y$ có đúng $3$ cực trị trên $(-1;+\infty)$, cần $g'(x) = 0$ vô nghiệm trên $(-1;0)$. Vì $g'$ đồng biến trên $(-1;0)$ với $\lim_{x\to0^-}g' = +\infty$ và $g'(-1) = f'(-1) - \dfrac{10}{(-1)^3} = a + 10$, điều kiện là $g'(-1) \ge 0 \Leftrightarrow a \ge -10$.

Kết hợp $a \in (-100; 0)$: $a \in \{-10; -9; \dots; -1\}$.

Đáp số: $10$ số nguyên (đáp án A).

Dạng tương tự: Đếm cực trị của $y = |g(x)|$ với $g = f + \frac{k}{x^2}$ và tham số trong $f'$. Dùng $f'$ đơn điệu ⇒ $g'$ đơn điệu trên từng khoảng; đếm nghiệm $g=0$ và $g'=0$; quy điều kiện số cực trị về dấu của $g'$ tại đầu mút (ở đây $g'(-1)=a+10 \ge 0$).

---

[topic: DERIVATIVES]
[source: Đề 2025 - Phần III (Điền đáp án) - Câu 3]
[difficulty: APPLICATION]
[subTopic: quy_hoach_tuyen_tinh_gtln_tren_mien_da_giac]
[relatedTopics: FUNCTIONS]
[embedKey: Bán nước chanh và khoai chiên, hai thực đơn, ràng buộc cốc <=165 túi <=100. Tối đa số tiền F=35x+60y. Dạng: quy hoạch tuyến tính, GTLN biểu thức bậc nhất trên miền đa giác.]
[status: reviewed]

Bài (Điền đáp án): Câu lạc bộ bán nước chanh và khoai chiên theo hai thực đơn. Thực đơn 1: $2$ cốc nước chanh và $1$ túi khoai, giá $35$ nghìn đồng. Thực đơn 2: $3$ cốc và $2$ túi, giá $60$ nghìn đồng. Câu lạc bộ chỉ có không quá $165$ cốc và $100$ túi. Gọi $x, y$ lần lượt là số thực đơn 1 và thực đơn 2 bán được. Số tiền lớn nhất nhận được (nghìn đồng) là bao nhiêu?

Dạng: Quy hoạch tuyến tính — tìm giá trị lớn nhất của biểu thức bậc nhất trên miền đa giác nghiệm của hệ bất phương trình.

Phương pháp: Lập hệ ràng buộc và hàm mục tiêu $F = 35x + 60y$; xác định các đỉnh miền nghiệm; $F$ đạt giá trị lớn nhất tại một đỉnh.

Lời giải:
Hệ ràng buộc: $\begin{cases} 2x + 3y \le 165 \\ x + 2y \le 100 \\ x \ge 0,\ y \ge 0 \end{cases}$; hàm mục tiêu $F(x;y) = 35x + 60y$.

Miền nghiệm là tứ giác $OABC$ với $O(0;0)$, $A(0;50)$, $B(30;35)$, $C(82{,}5;0)$ ($B$ là giao của $2x+3y=165$ và $x+2y=100$).

$F(O)=0$; $F(A)=60\cdot50=3000$; $F(B)=35\cdot30+60\cdot35=3150$; $F(C)=35\cdot82{,}5=2887{,}5$.

$F$ lớn nhất bằng $3150$ tại $B(30;35)$.

Đáp số: $3150$ nghìn đồng.

Dạng tương tự: Bài "tối ưu sản xuất/bán hàng" → quy hoạch tuyến tính: lập hệ bất phương trình ràng buộc, vẽ miền nghiệm (đa giác lồi), tính hàm mục tiêu bậc nhất tại các đỉnh, chọn giá trị lớn nhất/nhỏ nhất.

---

[topic: DERIVATIVES]
[source: Đề 2025 - Phần III (Điền đáp án) - Câu 5]
[difficulty: APPLICATION]
[subTopic: loi_nhuan_bat_phuong_trinh_bac_hai_so_san_pham]
[relatedTopics: FUNCTIONS]
[embedKey: Doanh thu F(x) = -0.01x^2 + 450x, chi phí mỗi sản phẩm G(x) = 30000/x + 340. Tìm số sản phẩm nhỏ nhất để lợi nhuận > 100 triệu. Dạng: lập hàm lợi nhuận rồi giải bất phương trình bậc hai.]
[status: reviewed]

Bài (Điền đáp án): Một doanh nghiệp sản xuất $x$ sản phẩm trong một tháng ($x \in \mathbb{N}^*$, $1 \le x \le 4500$) thì doanh thu là $F(x) = -0{,}01x^2 + 450x$ (nghìn đồng), chi phí bình quân mỗi sản phẩm là $G(x) = \dfrac{30000}{x} + 340$ (nghìn đồng). Giả sử sản phẩm luôn bán hết. Doanh nghiệp cần sản xuất ít nhất bao nhiêu sản phẩm để lợi nhuận lớn hơn $100$ triệu đồng?

Dạng: Lập hàm lợi nhuận rồi giải bất phương trình bậc hai để tìm số sản phẩm tối thiểu.

Phương pháp: Lợi nhuận $L(x) = F(x) - x\,G(x)$; giải $L(x) > 100000$ (nghìn đồng) thành bất phương trình bậc hai; lấy nghiệm nguyên nhỏ nhất trong miền $1 \le x \le 4500$.

Lời giải:
$L(x) = F(x) - x\,G(x) = -0{,}01x^2 + 450x - x\Big(\dfrac{30000}{x} + 340\Big) = -0{,}01x^2 + 110x - 30000$ (nghìn đồng).

Lợi nhuận lớn hơn $100$ triệu $= 100000$ nghìn đồng:
$$-0{,}01x^2 + 110x - 30000 > 100000 \Leftrightarrow -0{,}01x^2 + 110x - 130000 > 0 \Leftrightarrow 1346{,}68\dots < x < 9653{,}31\dots$$

Kết hợp $x \in \mathbb{N}^*$, $1 \le x \le 4500$: $1346{,}68\dots < x \le 4500$, nên $x_{\min} = 1347$.

Đáp số: $1347$ sản phẩm.

Dạng tương tự: Bài "lợi nhuận" — lập $L = $ doanh thu $-$ chi phí (chú ý chi phí tổng $= x\cdot G(x)$), đưa điều kiện lợi nhuận về bất phương trình bậc hai, giải rồi giao với miền $x$ nguyên dương để lấy giá trị nhỏ nhất/lớn nhất.

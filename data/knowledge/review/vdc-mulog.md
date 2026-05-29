# VDC - Mũ & Logarit (EXPONENTIAL_LOG) — Đề THPT QG 2021, Mã 101

---

[topic: EXPONENTIAL_LOG]
[source: THPT QG 2021 - Mã 101 - Câu 40]
[difficulty: APPLICATION]
[subTopic: dem_nghiem_nguyen_bpt_tich_mu_logarit]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu số nguyên x thỏa mãn (3^{x^2} - 9^x)(log_3(x+25) - 3) <= 0. Dạng: đếm nghiệm nguyên của bất phương trình tích mũ - logarit bằng bảng xét dấu.]
[status: reviewed]

Bài: Có bao nhiêu số nguyên $x$ thỏa mãn $\left(3^{x^2} - 9^x\right)\left[\log_3(x+25) - 3\right] \leq 0$?

Dạng: Đếm số nghiệm nguyên của bất phương trình dạng tích (mũ × logarit) bằng bảng xét dấu.

Phương pháp: Đặt điều kiện logarit; giải nghiệm của từng nhân tử (cho bằng 0); lập bảng xét dấu tích trên các khoảng; đếm số nguyên thuộc miền nghiệm.

Lời giải:
Điều kiện: $x + 25 > 0 \Leftrightarrow x > -25$.

Xét dấu từng nhân tử:

- $3^{x^2} - 9^x = 3^{x^2} - 3^{2x}$ cùng dấu với $x^2 - 2x = x(x-2)$; bằng $0$ khi $x = 0$ hoặc $x = 2$.
- $\log_3(x+25) - 3$ đồng biến, bằng $0$ khi $x + 25 = 27 \Leftrightarrow x = 2$.

Bảng xét dấu trên các mốc $-25;\ 0;\ 2;\ +\infty$:

- Trên $(-25; 0)$: nhân tử thứ nhất $> 0$ (vì $x < 0$), nhân tử thứ hai $< 0$ → tích $< 0$ (thỏa).
- Tại $x = 0$: nhân tử thứ nhất $= 0$ → tích $= 0$ (thỏa).
- Trên $(0; 2)$: nhân tử thứ nhất $< 0$, nhân tử thứ hai $< 0$ → tích $> 0$ (loại).
- Tại $x = 2$: cả hai nhân tử $= 0$ → tích $= 0$ (thỏa).
- Trên $(2; +\infty)$: cả hai $> 0$ → tích $> 0$ (loại).

Vậy miền nghiệm: $-25 < x \leq 0$ hoặc $x = 2$.

Số nguyên thỏa mãn: $x \in \{-24; -23; \dots; -1; 0\}$ có $25$ số, cộng thêm $x = 2$.

Đáp số: $26$ số nguyên (đáp án C).

Dạng tương tự: Bất phương trình tích/thương chứa $a^{u(x)}$ và $\log_a v(x)$. Quy trình chuẩn: (1) đặt điều kiện logarit; (2) so sánh mũ cùng cơ số để quy dấu nhân tử mũ về dấu đa thức số mũ; (3) logarit đồng biến nên dấu xác định bởi mốc $v(x) = a^k$; (4) lập bảng xét dấu rồi đếm số nguyên.

---

[topic: EXPONENTIAL_LOG]
[source: THPT QG 2021 - Mã 101 - Câu 47]
[difficulty: ADVANCED]
[subTopic: dem_so_nguyen_y_ton_tai_nghiem_pt_mu]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu số nguyên y để tồn tại x trong khoảng (1/3, 3) thỏa 27^{3x^2+xy} = (1+xy) 27^{9x}. Dạng: đếm số nguyên tham số để phương trình mũ có nghiệm trên một khoảng.]
[status: reviewed]

Bài: Có bao nhiêu số nguyên $y$ sao cho tồn tại $x \in \left(\dfrac{1}{3}; 3\right)$ thỏa mãn $27^{3x^2 + xy} = (1 + xy)\,27^{9x}$?

Dạng: Tìm số giá trị nguyên của tham số $y$ để phương trình mũ có nghiệm $x$ trên một khoảng cho trước.

Phương pháp: Cô lập $27^{u} = 1 + xy$; dùng bất đẳng thức $a^t \geq t(a-1) + 1$ để chặn và loại miền $y$ lớn; xét dấu vế phải để loại $y$ quá nhỏ; với khoảng $y$ còn lại dùng tính liên tục và dấu của hàm tại hai đầu mút để khẳng định tồn tại nghiệm.

Lời giải:
Chuyển $27^{9x}$ sang vế trái: $27^{3x^2 + xy - 9x} = 1 + xy$.

Xét $f(x) = 27^{3x^2 - 9x + xy} - (xy + 1)$. Áp dụng $a^t \geq t(a-1) + 1$ với $a = 27$:

$$
f(x) \geq 26\,(3x^2 - 9x + xy) - xy - 1 = 84x^2 + 25xy - 234x - 1 > 0 \quad \forall y \geq 10.
$$

Do đó với $y \geq 10$ phương trình vô nghiệm, suy ra $y \leq 9$.

- $y = 0$: $27^{3x^2 - 9x} = 1 \Leftrightarrow 3x^2 - 9x = 0 \Leftrightarrow x = 0$ hoặc $x = 3$, đều không thuộc $\left(\frac13; 3\right)$ → loại.
- $y \leq -3$: trên khoảng đang xét $xy < -1$ nên vế phải $1 + xy < 0$ trong khi vế trái $> 0$ → loại.
- $y = -1$ và $y = -2$: kiểm tra trực tiếp thấy tồn tại nghiệm → thỏa mãn.
- $y > 0$: có $f(3) = 27^{3y} - (3y + 1) \geq 0\ \forall y > 0$, và $f\!\left(\tfrac13\right) = 3^{\,y-8} - \tfrac{y}{3} - 1 < 0\ \forall y \in \{1;2;\dots;9\}$. Do $f$ liên tục và đổi dấu trên $\left(\frac13;3\right)$ nên tồn tại nghiệm với mọi $y \in \{1;2;\dots;9\}$.

Hợp các trường hợp: $y \in \{-2; -1; 1; 2; 3; 4; 5; 6; 7; 8; 9\}$.

Đáp số: $11$ số nguyên (đáp án C).

Dạng tương tự: Bài "tồn tại nghiệm trên khoảng" với tham số nguyên. Kỹ thuật: (1) cô lập $a^{u} =$ biểu thức tuyến tính theo tham số; (2) dùng bất đẳng thức tiếp tuyến $a^t \ge t(a-1)+1$ để chặn, loại bớt miền tham số; (3) phần còn lại xét dấu hàm tại hai đầu mút để khẳng định tồn tại nghiệm nhờ tính liên tục.

---

[topic: EXPONENTIAL_LOG]
[source: Đề ôn 2022 - Câu 44]
[difficulty: APPLICATION]
[subTopic: bpt_mu_logarit_dung_voi_moi_co_so_max_bieu_thuc]
[relatedTopics: ANALYTIC_GEOMETRY]
[embedKey: a^{4x - log_5 a^2} <= 25^{40 - y^2} với mọi a dương. Tìm max của P = x^2 + y^2 + x - 3y. Dạng: bất phương trình mũ-logarit đúng với mọi cơ số, quy về điều kiện hình tròn rồi cực trị.]
[status: reviewed]

Bài: Xét tất cả các số thực $x, y$ sao cho $a^{4x - \log_5 a^2} \le 25^{40 - y^2}$ với mọi số thực dương $a$. Giá trị lớn nhất của biểu thức $P = x^2 + y^2 + x - 3y$ bằng bao nhiêu?

Dạng: Bất phương trình mũ–logarit đúng với MỌI cơ số $a$, quy về điều kiện hình tròn cho $(x; y)$, rồi tìm giá trị lớn nhất của biểu thức qua quan hệ hai đường tròn.

Phương pháp: Lấy $\log_5$ hai vế, đặt $t = \log_5 a$ (nhận mọi giá trị thực); đưa về tam thức bậc hai theo $t$ không âm với mọi $t$ → điều kiện $\Delta \le 0$ cho ra hình tròn $(C_1)$ của $(x;y)$; viết $P$ thành đường tròn $(C_2)$; $(C_2)$ có điểm chung với $(C_1)$ khi $R_2 \le R_1 + OI$.

Lời giải:
Lấy $\log_5$ hai vế (cơ số $5 > 1$):
$$(4x - 2\log_5 a)\log_5 a \le 2(40 - y^2).$$
Đặt $t = \log_5 a$ ($t$ nhận mọi giá trị thực khi $a > 0$):
$$-2t^2 + 4xt \le 80 - 2y^2 \Leftrightarrow t^2 - 2xt + 40 - y^2 \ge 0 \quad (*).$$
$(*)$ đúng với mọi $t$ khi $\Delta' = x^2 - (40 - y^2) \le 0 \Leftrightarrow x^2 + y^2 \le 40$ $(1)$.

Vậy $(x; y)$ thuộc hình tròn $(C_1)$ tâm $O(0; 0)$, bán kính $R_1 = 2\sqrt{10}$.

Mặt khác $P = x^2 + y^2 + x - 3y \Leftrightarrow x^2 + y^2 + x - 3y - P = 0$ là đường tròn $(C_2)$ tâm $I\left(-\dfrac12; \dfrac32\right)$, bán kính $R_2 = \dfrac12\sqrt{10 + 4P}$.

Để $(C_2)$ có điểm chung với hình tròn $(C_1)$ thì $R_2 \le R_1 + OI$, với $OI = \sqrt{\dfrac14 + \dfrac94} = \dfrac{\sqrt{10}}{2}$:
$$\dfrac12\sqrt{10 + 4P} \le 2\sqrt{10} + \dfrac{\sqrt{10}}{2} = \dfrac{5\sqrt{10}}{2} \Leftrightarrow \sqrt{10 + 4P} \le 5\sqrt{10} \Leftrightarrow 10 + 4P \le 250 \Leftrightarrow P \le 60.$$

Đáp số: $P_{\max} = 60$ (đáp án C).

Dạng tương tự: Bất phương trình mũ/logarit "đúng với mọi cơ số/biến phụ" → lấy log, đặt ẩn $t$, ép tam thức bậc hai không âm với mọi $t$ ($\Delta \le 0$) để ra miền hình tròn cho $(x; y)$; sau đó bài "max biểu thức bậc hai đối xứng" đưa về quan hệ vị trí hai đường tròn ($R_2 \le R_1 + OI$).

---

[topic: EXPONENTIAL_LOG]
[source: Đề ôn 2023 - Câu 47]
[difficulty: ADVANCED]
[subTopic: dem_cap_nguyen_bpt_hai_logarit_khac_co_so_ham_dac_trung]
[relatedTopics: FUNCTIONS]
[embedKey: Có bao nhiêu cặp nguyên (x;y) thỏa log_3(x^2+y^2+x) + log_2(x^2+y^2) <= log_3 x + log_2(x^2+y^2+24x). Dạng: bất phương trình hai logarit khác cơ số, dùng hàm đặc trưng rồi đếm cặp nguyên trong hình tròn.]
[status: reviewed]

Bài: Có bao nhiêu cặp số nguyên $(x; y)$ thỏa mãn $\log_3(x^2 + y^2 + x) + \log_2(x^2 + y^2) \le \log_3 x + \log_2(x^2 + y^2 + 24x)$?

Dạng: Bất phương trình chứa hai logarit khác cơ số; dùng hàm đặc trưng đơn điệu để hạ về điều kiện hình tròn rồi đếm cặp nguyên.

Phương pháp: Đặt điều kiện $x>0$; chuyển vế gom theo từng cơ số thành $\log_3\big(1+\tfrac{x^2+y^2}{x}\big) \le \log_2\big(1+\tfrac{24x}{x^2+y^2}\big)$; đặt $t=\tfrac{x^2+y^2}{x}$ để có $f(t)=\log_3(1+t)-\log_2(1+\tfrac{24}{t})$ đồng biến, giải $f(t)\le f(8)$; quy về $(x-4)^2+y^2\le16$ rồi đếm điểm nguyên.

Lời giải:
Điều kiện $x > 0$. Bất phương trình tương đương
$$\log_3\dfrac{x^2+y^2+x}{x} \le \log_2\dfrac{x^2+y^2+24x}{x^2+y^2} \Leftrightarrow \log_3\Big(1+\dfrac{x^2+y^2}{x}\Big) \le \log_2\Big(1+\dfrac{24x}{x^2+y^2}\Big).$$
Đặt $t = \dfrac{x^2+y^2}{x} > 0$ (khi đó $\dfrac{24x}{x^2+y^2} = \dfrac{24}{t}$):
$$f(t) = \log_3(1+t) - \log_2\Big(1+\dfrac{24}{t}\Big) \le 0 \quad (1).$$
$f'(t) = \dfrac{1}{(1+t)\ln 3} + \dfrac{24}{(t^2+24t)\ln 2} > 0\ \forall t>0$ nên $f$ đồng biến trên $(0;+\infty)$. Mà $f(8) = \log_3 9 - \log_2 4 = 2 - 2 = 0$, nên
$$(1) \Leftrightarrow f(t) \le f(8) \Leftrightarrow t \le 8 \Leftrightarrow \dfrac{x^2+y^2}{x} \le 8 \Leftrightarrow (x-4)^2 + y^2 \le 16.$$

Đếm cặp nguyên $(x;y)$ với $(x-4)^2 + y^2 \le 16$ và $x > 0$ (tức $0 < x \le 8$):
- $x = 1$ và $x = 7$: $y \in \{0; \pm1; \pm2\}$ → $5 + 5 = 10$ cặp.
- $x = 2$ và $x = 6$: $y \in \{0; \pm1; \pm2; \pm3\}$ → $7 + 7 = 14$ cặp.
- $x = 3$ và $x = 5$: $y \in \{0; \pm1; \pm2; \pm3\}$ → $7 + 7 = 14$ cặp.
- $x = 4$: $y \in \{0; \pm1; \pm2; \pm3; \pm4\}$ → $9$ cặp.
- $x = 8$: $y = 0$ → $1$ cặp.

Tổng: $10 + 14 + 14 + 9 + 1 = 48$.

Đáp số: $48$ cặp (đáp án B).

Dạng tương tự: Bất phương trình hai logarit khác cơ số "đối xứng" — gom mỗi cơ số về dạng $\log_a(1 + u)$, đặt ẩn $t$ để xuất hiện hàm đặc trưng $f(t)$ đơn điệu, giải $f(t) \le f(t_0)$; thường quy về một hình tròn $(x-h)^2+y^2 \le r^2$ rồi đếm điểm nguyên theo từng cột $x$.

---

[topic: EXPONENTIAL_LOG]
[source: Đề chính thức 2024 - Mã 123 - Câu 48]
[difficulty: ADVANCED]
[subTopic: ham_le_don_dieu_chua_logarit_bat_phuong_trinh_dem_nguyen]
[relatedTopics: FUNCTIONS, DERIVATIVES]
[embedKey: f(x) = 2/x^3 + ln((x+3)/(x-3)). Có bao nhiêu số nguyên a trong (-vc;2100) thỏa f(a-2024) + f(6a-27) >= 0. Dạng: hàm lẻ nghịch biến chứa logarit, đếm nghiệm nguyên của bất phương trình.]
[status: reviewed]

Bài: Cho hàm số $f(x) = \dfrac{2}{x^3} + \ln\dfrac{x+3}{x-3}$. Có bao nhiêu số nguyên $a \in (-\infty; 2100)$ thỏa mãn $f(a - 2024) + f(6a - 27) \ge 0$?

Dạng: Hàm chứa logarit là hàm lẻ và nghịch biến; dùng tính chất đó để hạ bất phương trình rồi đếm số nguyên (chia trường hợp theo dấu).

Phương pháp: Tìm tập xác định; chứng minh $f$ lẻ ($f(-x)=-f(x)$) và nghịch biến trên từng khoảng ($f'<0$); đưa $f(a-2024) \ge -f(6a-27) = f(27-6a)$; chia ba trường hợp theo dấu của hai vế và vị trí đối số trong tập xác định, giải rồi đếm.

Lời giải:
Tập xác định $D = (-\infty; -3) \cup (3; +\infty)$. Ta có $f(-x) = -\dfrac{2}{x^3} + \ln\dfrac{x-3}{x+3} = -\dfrac{2}{x^3} - \ln\dfrac{x+3}{x-3} = -f(x)$ nên $f$ lẻ.

$f'(x) = -\dfrac{6}{x^4} - \dfrac{6}{(x-3)(x+3)} < 0\ \forall x \in D$ (vì $x^2 - 9 > 0$ trên $D$), nên $f$ nghịch biến trên từng khoảng; ngoài ra $f(x) > 0\ \forall x > 3$ và $f(x) < 0\ \forall x < -3$.

$f(a-2024) + f(6a-27) \ge 0 \Leftrightarrow f(a-2024) \ge f(27 - 6a)$ (do $f$ lẻ).

Ba trường hợp:
- $f(a-2024) \ge f(27-6a) > 0$: cần $3 < a-2024 \le 27-6a$ → vô nghiệm.
- $0 > f(a-2024) \ge f(27-6a)$: cần $a-2024 \le 27-6a < -3$ → $5 < a \le 293$, có $288$ số.
- $f(a-2024) > 0 > f(27-6a)$: cần $a-2024 > 3$ và $27-6a < -3$ → $a > 2027$; kết hợp $a < 2100$ → $2027 < a < 2100$, có $72$ số.

Tổng cộng $288 + 72 = 360$ số nguyên $a$.

Đáp số: $360$ (đáp án B).

Dạng tương tự: Hàm lẻ và đơn điệu (thường gồm $\ln\frac{x+m}{x-m}$ và lũy thừa lẻ) → đưa $f(u) + f(v) \ge 0$ về $f(u) \ge f(-v)$; chia trường hợp theo dấu hai vế và miền xác định, dùng tính nghịch/đồng biến để bỏ $f$, rồi đếm số nguyên.

---

[topic: EXPONENTIAL_LOG]
[source: Đề 2025 - Phần II (Đúng/Sai) - Câu 2]
[difficulty: APPLICATION]
[subTopic: phuong_trinh_vi_phan_y_phay_ky_nghiem_mu]
[relatedTopics: INTEGRALS]
[embedKey: Nồng độ thuốc y(t) thỏa y'(t) = k y(t), y(6) = 2, y(12) = 1. Tìm k, C và y(21). Dạng: phương trình vi phân y' = ky, nghiệm mũ, phân rã.]
[status: reviewed]

Bài (Đúng/Sai): Nồng độ thuốc tồn dư trong nước $y(t)$ (mg/lít) tại thời điểm $t$ ngày ($t\ge0$) thỏa $y(t) > 0$ và $y'(t) = k\,y(t)$ ($k$ là hằng số). Biết $y(6) = 2$, $y(12) = 1$. Đặt $g(t) = \ln y(t)$. Xét các mệnh đề:
a) $g(t) = kt + C$.
b) $k = -\dfrac{\ln 2}{6}$.
c) $C = 4\ln 2$.
d) Nồng độ tại $t = 21$ lớn hơn $0{,}4$ mg/lít.

Dạng: Phương trình vi phân $y' = ky$ → nghiệm mũ $y = e^{kt+C}$; dùng hai giá trị để tìm $k, C$.

Phương pháp: Từ $\frac{y'}{y} = k$ lấy nguyên hàm ⟹ $\ln y = kt + C$, $y = e^{kt+C}$; thế $y(6), y(12)$ giải hệ tìm $k, C$; tính $y(21)$.

Lời giải:
$\dfrac{y'(t)}{y(t)} = k \Rightarrow \ln y(t) = kt + C \Rightarrow y(t) = e^{kt+C}$.

a) $g(t) = \ln y(t) = kt + C$. **Đúng.**

Từ $y(6) = 2$, $y(12) = 1$: $\begin{cases} 6k + C = \ln 2 \\ 12k + C = 0 \end{cases} \Rightarrow k = -\dfrac{\ln 2}{6},\ C = 2\ln 2$.

b) $k = -\dfrac{\ln 2}{6}$. **Đúng.**
c) $C = 2\ln 2 \ne 4\ln 2$. **Sai.**
d) $y(21) = e^{-\frac{\ln 2}{6}\cdot 21 + 2\ln 2} = 2^{-\frac{21}{6}+2} = 2^{-\frac32} = \dfrac{\sqrt2}{4} \approx 0{,}354 < 0{,}4$. Mệnh đề nói "$> 0{,}4$" nên **Sai.**

Đáp số: a) Đúng; b) Đúng; c) Sai; d) Sai.

Dạng tương tự: Mô hình phân rã/tăng trưởng $y' = ky$ → $y = e^{kt+C}$ (hay $y = y_0 e^{kt}$). Dùng hai mốc dữ liệu lập hệ tìm $k, C$; giá trị tại thời điểm khác tính bằng lũy thừa cơ số $e$ (quy về cơ số $2$ cho gọn).

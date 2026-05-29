# VDC - Tích phân & Diện tích hình phẳng (INTEGRALS) — Đề THPT QG 2021, Mã 101

---

[topic: INTEGRALS]
[source: THPT QG 2021 - Mã 101 - Câu 46]
[difficulty: ADVANCED]
[subTopic: dien_tich_hinh_phang_nhan_dien_dao_ham_g_phay]
[relatedTopics: DERIVATIVES, FUNCTIONS]
[embedKey: Cho f(x) = x^3 + ax^2 + bx + c, g(x) = f + f' + f'' có hai cực trị -3 và 6. Diện tích hình phẳng giới hạn bởi y = f(x)/(g(x)+6) và y = 1. Dạng: diện tích hình phẳng dùng nhận diện g'(x).]
[status: reviewed]

Bài: Cho hàm số $f(x) = x^3 + ax^2 + bx + c$ với $a, b, c$ là các số thực. Biết hàm số $g(x) = f(x) + f'(x) + f''(x)$ có hai giá trị cực trị là $-3$ và $6$. Diện tích hình phẳng giới hạn bởi các đường $y = \dfrac{f(x)}{g(x) + 6}$ và $y = 1$ bằng bao nhiêu?

Dạng: Tính diện tích hình phẳng khi $f, g$ liên hệ qua đạo hàm; mấu chốt là nhận ra tử số bằng $-g'(x)$ và cận tích phân là nghiệm $g'(x) = 0$.

Phương pháp: Lập $g(x)$ và $g'(x)$; biến đổi $\dfrac{f}{g+6} = 1$ về $g'(x) = 0$ để có cận $x_1, x_2$; đưa tích phân về $\int \dfrac{-g'(x)}{g(x)+6}dx = -\ln|g(x)+6|$; thay giá trị cực trị của $g$.

Lời giải:
$g(x) = f(x) + f'(x) + f''(x) = x^3 + (a+3)x^2 + (b + 2a + 6)x + (2a + b + c)$, suy ra $g'(x) = 3x^2 + 2(a+3)x + (b + 2a + 6)$.

Phương trình hoành độ giao điểm:

$$
\dfrac{f(x)}{g(x)+6} = 1 \Leftrightarrow f(x) = g(x) + 6 \Leftrightarrow g(x) - f(x) + 6 = 0.
$$

Mà $g(x) - f(x) + 6 = f'(x) + f''(x) + 6 = 3x^2 + 2(a+3)x + (b + 2a + 6) = g'(x)$.

Vậy hai giao điểm có hoành độ $x_1, x_2$ chính là hai nghiệm của $g'(x) = 0$ (hai điểm cực trị của $g$). Diện tích:

$$
S = \int_{x_1}^{x_2}\left|\dfrac{f(x)}{g(x)+6} - 1\right|dx = \int_{x_1}^{x_2}\left|\dfrac{f(x) - g(x) - 6}{g(x)+6}\right|dx = \left|\int_{x_1}^{x_2}\dfrac{-g'(x)}{g(x)+6}\,dx\right|.
$$

$$
S = \Big|\big[-\ln|g(x)+6|\big]_{x_1}^{x_2}\Big| = \big|\ln|g(x_1)+6| - \ln|g(x_2)+6|\big|.
$$

Hai giá trị cực trị của $g$ là $g(x_1), g(x_2) \in \{-3;\ 6\}$, nên $g(x_i) + 6 \in \{3;\ 12\}$:

$$
S = |\ln 3 - \ln 12| = \left|\ln\dfrac{3}{12}\right| = \ln 4 = 2\ln 2.
$$

Đáp số: $2\ln 2$ (đáp án D).

Dạng tương tự: Diện tích giữa $y = \dfrac{f}{g+6}$ và $y = 1$ khi $f, g$ liên hệ qua đạo hàm. Mẹo: nhận ra tử $f - (g+6) = -g'$ để đưa tích phân về $\int \dfrac{-g'}{g+6}dx = -\ln|g+6|$; cận tích phân là nghiệm $g'(x) = 0$ nên giá trị tại cận chính là các cực trị của $g$, thay trực tiếp.

---

[topic: INTEGRALS]
[source: Đề ôn 2022 - Câu 41]
[difficulty: APPLICATION]
[subTopic: hai_nguyen_ham_sai_khac_hang_so_dien_tich_hinh_phang]
[relatedTopics: FUNCTIONS]
[embedKey: F(x), G(x) là hai nguyên hàm của f(x), tích phân 0 đến 3 của f bằng F(3)-G(0)+a. Diện tích hình phẳng giữa y=F(x), y=G(x), x=0, x=3 bằng 15. Tìm a. Dạng: hai nguyên hàm sai khác hằng số C, diện tích hình phẳng.]
[status: reviewed]

Bài: Biết $F(x)$ và $G(x)$ là hai nguyên hàm của hàm số $f(x)$ trên $\mathbb{R}$ và $\displaystyle\int_0^3 f(x)\,dx = F(3) - G(0) + a$ $(a > 0)$. Gọi $S$ là diện tích hình phẳng giới hạn bởi các đường $y = F(x)$, $y = G(x)$, $x = 0$ và $x = 3$. Khi $S = 15$ thì $a$ bằng bao nhiêu?

Dạng: Hai nguyên hàm của cùng một hàm sai khác hằng số; liên hệ diện tích hình phẳng với hằng số đó.

Phương pháp: Dùng $F(x) = G(x) + C$; tính $S = \int_0^3 |F - G|\,dx = 3|C|$ để tìm $|C|$; dùng Newton–Leibniz $\int_0^3 f\,dx = F(3) - F(0)$ để liên hệ $a = -C$.

Lời giải:
Vì $F, G$ cùng là nguyên hàm của $f$ nên $F(x) = G(x) + C$.

Diện tích:
$$S = \int_0^3 |F(x) - G(x)|\,dx = \int_0^3 |C|\,dx = 3|C| = 15 \Rightarrow |C| = 5 \Rightarrow C = \pm 5.$$

Mặt khác:
$$\int_0^3 f(x)\,dx = F(3) - F(0) = F(3) - \big(G(0) + C\big) = F(3) - G(0) - C.$$
So sánh với giả thiết $F(3) - G(0) + a$ suy ra $a = -C$. Do $a > 0$ nên $C = -5$ và $a = 5$.

Đáp số: $5$ (đáp án D).

Dạng tương tự: Hai nguyên hàm của cùng một hàm luôn sai khác hằng số $C$; diện tích giữa hai đồ thị nguyên hàm trên $[m;n]$ là $|C|\,(n - m)$. Kết hợp công thức Newton–Leibniz để liên hệ $C$ với dữ kiện tích phân.

---

[topic: INTEGRALS]
[source: Đề ôn 2022 - Câu 47]
[difficulty: ADVANCED]
[subTopic: dien_tich_hinh_phang_f_phay_g_phay_ham_logarit]
[relatedTopics: DERIVATIVES, EXPONENTIAL_LOG]
[embedKey: g(x) = ln f(x) có bảng biến thiên với cực trị ln(43/8), ln 6, ln 2. Diện tích hình phẳng giới hạn bởi y = f'(x) và y = g'(x) thuộc khoảng nào. Dạng: diện tích giữa f' và g' khi g = ln f.]
[status: reviewed]

Bài: Cho hàm số $y = f(x)$. Biết rằng hàm số $g(x) = \ln f(x)$ có bảng biến thiên như sau. [có hình - bảng biến thiên] Cụ thể: $g$ có ba điểm tới hạn $x_1 < x_2 < x_3$; trên $(-\infty; x_1)$ hàm giảm từ $+\infty$ về cực tiểu $g(x_1) = \ln\dfrac{43}{8}$; trên $(x_1; x_2)$ tăng đến cực đại $g(x_2) = \ln 6$; trên $(x_2; x_3)$ giảm về cực tiểu $g(x_3) = \ln 2$; trên $(x_3; +\infty)$ tăng lên $+\infty$. Diện tích hình phẳng giới hạn bởi các đường $y = f'(x)$ và $y = g'(x)$ thuộc khoảng nào dưới đây?

Dạng: Diện tích hình phẳng giữa $y = f'(x)$ và $y = g'(x)$ khi $g = \ln f$; khai thác $f = e^{g}$ và đổi biến $u = g(x)$.

Phương pháp: Từ $g = \ln f \Rightarrow f = e^{g}$, $f' = g'e^{g}$; giao điểm $f' = g' \Leftrightarrow g'(e^{g}-1)=0 \Leftrightarrow g'=0$ (vì $e^{g}\ge 2$) tại $x_1,x_2,x_3$; tính $S = \int_{x_1}^{x_3}|g'(e^{g}-1)|dx$, đổi biến $u=g(x)$ để có nguyên hàm $e^{g}-g$, rồi thay các giá trị cực trị.

Lời giải:
Ta có $f(x) = e^{g(x)}$. Từ bảng biến thiên, $g(x) \ge \ln 2 \Rightarrow e^{g(x)} \ge 2$.

$f'(x) = g'(x)e^{g(x)}$. Phương trình hoành độ giao điểm của $f'$ và $g'$:
$$g'(x)e^{g(x)} - g'(x) = 0 \Leftrightarrow g'(x)\big(e^{g(x)} - 1\big) = 0 \Leftrightarrow g'(x) = 0$$
(vì $e^{g(x)} - 1 \ge 1 > 0$), tức $x = x_1, x_2, x_3$.

Trên $(x_1; x_2)$ có $g' > 0$; trên $(x_2; x_3)$ có $g' < 0$. Diện tích:
$$S = \int_{x_1}^{x_3}\big|g'(x)\big(e^{g(x)}-1\big)\big|\,dx = \int_{x_1}^{x_2} g'(e^{g}-1)\,dx - \int_{x_2}^{x_3} g'(e^{g}-1)\,dx.$$
Đổi biến $u = g(x)$: $\displaystyle\int (e^{g}-1)\,d(g) = e^{g} - g$. Do đó:
$$S = \big[e^{g}-g\big]_{x_1}^{x_2} - \big[e^{g}-g\big]_{x_2}^{x_3} = 2e^{g(x_2)} - e^{g(x_1)} - e^{g(x_3)} - 2g(x_2) + g(x_1) + g(x_3).$$
Thay $g(x_1)=\ln\dfrac{43}{8}$, $g(x_2)=\ln 6$, $g(x_3)=\ln 2$ (nên $e^{g(x_1)}=\dfrac{43}{8}$, $e^{g(x_2)}=6$, $e^{g(x_3)}=2$):
$$S = 2\cdot 6 - \dfrac{43}{8} - 2 - 2\ln 6 + \ln\dfrac{43}{8} + \ln 2 = \dfrac{37}{8} + \ln\dfrac{43}{144} \approx 3{,}416.$$

Vậy $S \approx 3{,}416 \in (3; 4)$.

Đáp số: khoảng $(3; 4)$ (đáp án D).

Dạng tương tự: Diện tích giữa $f'$ và $g'$ khi $g = \ln f$ (hay $f = e^{g}$). Mẹo: $f' = g'e^{g}$ nên giao điểm chỉ phụ thuộc $g'=0$; tích phân $\int g'(e^{g}-1)dx$ đổi biến $u=g$ thành $e^{g}-g$; chia khoảng theo dấu $g'$ và thay giá trị cực trị từ bảng biến thiên.

---

[topic: INTEGRALS]
[source: Đề ôn 2023 - Câu 40]
[difficulty: APPLICATION]
[subTopic: hai_nguyen_ham_sai_khac_hang_so_doi_bien_f_2x]
[relatedTopics: FUNCTIONS]
[embedKey: F(x), G(x) là hai nguyên hàm của f(x), F(4)+G(4)=4, F(0)+G(0)=1. Tính tích phân 0 đến 2 của f(2x)dx. Dạng: hai nguyên hàm sai khác hằng số, đổi biến f(2x).]
[status: reviewed]

Bài: Cho hàm số $f(x)$ liên tục trên $\mathbb{R}$. Gọi $F(x), G(x)$ là hai nguyên hàm của $f(x)$ trên $\mathbb{R}$ thỏa mãn $F(4) + G(4) = 4$ và $F(0) + G(0) = 1$. Khi đó $\displaystyle\int_0^2 f(2x)\,dx$ bằng bao nhiêu?

Dạng: Hai nguyên hàm sai khác hằng số, kết hợp đổi biến trong tích phân $f(2x)$.

Phương pháp: Dùng $G = F + C$ để khử $C$ từ hai dữ kiện, tính $F(4) - F(0)$; đổi biến $u = 2x$ để đưa $\int_0^2 f(2x)dx = \frac12\int_0^4 f(u)du$.

Lời giải:
Vì $F, G$ cùng là nguyên hàm của $f$ nên $G(x) = F(x) + C$. Khi đó:
$$\begin{cases} F(4) + G(4) = 4 \\ F(0) + G(0) = 1 \end{cases} \Leftrightarrow \begin{cases} 2F(4) + C = 4 \\ 2F(0) + C = 1 \end{cases} \Rightarrow 2\big(F(4) - F(0)\big) = 3 \Rightarrow F(4) - F(0) = \dfrac32.$$

Đổi biến $u = 2x$ ($du = 2\,dx$):
$$\int_0^2 f(2x)\,dx = \dfrac12\int_0^4 f(u)\,du = \dfrac{F(4) - F(0)}{2} = \dfrac{3/2}{2} = \dfrac34.$$

Đáp số: $\dfrac34$ (đáp án B).

Dạng tương tự: Hai nguyên hàm của cùng hàm sai khác hằng số $C$ — trừ hai dữ kiện để khử $C$, lấy hiệu $F(b) - F(a)$. Khi gặp $\int f(kx)dx$, đổi biến $u = kx$ để quy về $\frac1k\int f(u)du = \frac1k\big[F\big]$.

---

[topic: INTEGRALS]
[source: Đề ôn 2023 - Câu 44]
[difficulty: APPLICATION]
[subTopic: tim_ham_tu_dao_ham_tich_dien_tich_f_va_f_phay]
[relatedTopics: DERIVATIVES, FUNCTIONS]
[embedKey: f(x) + x f'(x) = 4x^3 + 4x + 2. Diện tích hình phẳng giới hạn bởi y = f(x) và y = f'(x). Dạng: nhận ra (x f(x))' để tìm f rồi tính diện tích giữa f và f'.]
[status: reviewed]

Bài: Cho hàm số $y = f(x)$ có đạo hàm liên tục trên $\mathbb{R}$ và thỏa mãn $f(x) + x f'(x) = 4x^3 + 4x + 2,\ \forall x \in \mathbb{R}$. Diện tích hình phẳng giới hạn bởi các đường $y = f(x)$ và $y = f'(x)$ bằng bao nhiêu?

Dạng: Tìm $f$ từ hệ thức chứa $f$ và $f'$ (nhận dạng đạo hàm của một tích), rồi tính diện tích hình phẳng giữa $f$ và $f'$.

Phương pháp: Nhận ra $f(x) + x f'(x) = \big(x f(x)\big)'$; lấy nguyên hàm để tìm $x f(x)$ rồi $f(x)$ (dùng tính liên tục để khử hằng số); tìm giao điểm $f = f'$ và tích phân trị tuyệt đối của hiệu.

Lời giải:
Ta có $f(x) + x f'(x) = \big(x f(x)\big)' = 4x^3 + 4x + 2$. Lấy nguyên hàm:
$$x f(x) = x^4 + 2x^2 + 2x + C \Rightarrow f(x) = \dfrac{x^4 + 2x^2 + 2x + C}{x}.$$
Vì $f$ liên tục trên $\mathbb{R}$ (kể cả tại $x = 0$) nên $C = 0$, do đó $f(x) = x^3 + 2x + 2$ và $f'(x) = 3x^2 + 2$.

Giao điểm: $x^3 + 2x + 2 = 3x^2 + 2 \Leftrightarrow x^3 - 3x^2 + 2x = 0 \Leftrightarrow x(x-1)(x-2) = 0 \Leftrightarrow x \in \{0; 1; 2\}$.

Diện tích: với nguyên hàm $\dfrac{x^4}{4} - x^3 + x^2$, biểu thức $x^3 - 3x^2 + 2x$ dương trên $(0;1)$ và âm trên $(1;2)$:
$$S = \int_0^2 \big|x^3 - 3x^2 + 2x\big|\,dx = \dfrac14 + \dfrac14 = \dfrac12.$$

Đáp số: $\dfrac12$ (đáp án C).

Dạng tương tự: Hệ thức $f + x f' = h(x)$ → nhận ra $(xf)' = h$, nguyên hàm tìm $f$ (dùng điều kiện liên tục/giá trị để khử $C$). Sau đó diện tích giữa hai đường: tìm giao điểm, tích phân $|$hiệu$|$, tách khoảng theo dấu.

---

[topic: INTEGRALS]
[source: Đề chính thức 2024 - Mã 123 - Câu 41]
[difficulty: APPLICATION]
[subTopic: tim_ham_tu_dao_ham_ln_tich_phan_f_tren_x_binh]
[relatedTopics: EXPONENTIAL_LOG, DERIVATIVES]
[embedKey: f(e) = 1/5, f'(x) = (1/3) ln x. Tính tích phân e đến e^3 của f(x)/x^2 dx = a e^-3 + b e^-1 + c. Tìm khoảng chứa a - b + c. Dạng: tìm f từ f' = (1/3)ln x rồi tính tích phân.]
[status: reviewed]

Bài: Cho hàm số $y = f(x)$ có $f(e) = \dfrac15$ và $f'(x) = \dfrac13\ln x,\ \forall x \in (0; +\infty)$. Biết $\displaystyle\int_e^{e^3} \dfrac{f(x)}{x^2}\,dx = ae^{-3} + be^{-1} + c$ với $a, b, c$ là các số hữu tỉ. Giá trị của $a - b + c$ thuộc khoảng nào?

Dạng: Tìm $f$ từ $f'$ (chứa $\ln$) rồi tính một tích phân, đồng nhất hệ số để suy ra biểu thức tham số.

Phương pháp: Nguyên hàm $f'(x) = \frac13\ln x$ (từng phần) với điều kiện $f(e)$ để tìm $f(x)$; thay vào $\int \frac{f(x)}{x^2}dx$, tách thành hai tích phân (đổi biến $u = \ln x - 1$ và nguyên hàm $x^{-2}$); đồng nhất ra $a, b, c$.

Lời giải:
Nguyên hàm hai vế: $f(x) - f(e) = \displaystyle\int_e^x \frac13\ln t\,dt = \frac13\big[t\ln t - t\big]_e^x = \frac13(x\ln x - x)$ (vì $e\ln e - e = 0$).
Suy ra $f(x) = \dfrac{x}{3}(\ln x - 1) + \dfrac15,\ \forall x > 0$.

Khi đó:
$$\int_e^{e^3} \frac{f(x)}{x^2}\,dx = \frac13\int_e^{e^3}\frac{\ln x - 1}{x}\,dx + \frac15\int_e^{e^3}\frac{1}{x^2}\,dx.$$
- $\dfrac13\displaystyle\int_e^{e^3}\frac{\ln x - 1}{x}\,dx = \frac13\cdot\frac{(\ln x - 1)^2}{2}\Big|_e^{e^3} = \frac16\big[(3-1)^2 - 0\big] = \frac23$.
- $\dfrac15\displaystyle\int_e^{e^3}x^{-2}\,dx = \frac15\Big[-\frac1x\Big]_e^{e^3} = \frac15 e^{-1} - \frac15 e^{-3}$.

Do đó $\displaystyle\int_e^{e^3}\frac{f(x)}{x^2}\,dx = -\frac15 e^{-3} + \frac15 e^{-1} + \frac23$, tức $a = -\dfrac15$, $b = \dfrac15$, $c = \dfrac23$.

$a - b + c = -\dfrac15 - \dfrac15 + \dfrac23 = \dfrac{4}{15} \approx 0{,}267 \in \left(\dfrac14; \dfrac12\right)$.

Đáp số: khoảng $\left(\dfrac14; \dfrac12\right)$ (đáp án C).

Dạng tương tự: Cho $f'$ (chứa $\ln$/đa thức) và một giá trị $f(x_0)$ → nguyên hàm (từng phần) tìm $f$. Khi tính $\int \frac{f}{x^2}$, tách thành các tích phân cơ bản, đổi biến $u = \ln x - 1$ cho phần $\frac{\ln x - 1}{x}$; đồng nhất hệ số với $ae^{-3} + be^{-1} + c$.

---

[topic: INTEGRALS]
[source: Đề chính thức 2024 - Mã 123 - Câu 46]
[difficulty: ADVANCED]
[subTopic: dien_tich_f_phay_f_hai_ham_chan_tinh_tich_phan]
[relatedTopics: DERIVATIVES]
[embedKey: f(x) = ax^3+bx^2+cx+d, a>0, hai cực trị x1+x2=0, diện tích y = f'(x)f''(x) với Ox bằng 9/4, tích phân f'(x)/(3^x+1) = -7/2. Tính tích phân (x+2)f''(x). Dạng: hàm chẵn f', diện tích và tích phân với 3^x+1.]
[status: reviewed]

Bài: Xét hàm số $f(x) = ax^3 + bx^2 + cx + d$ ($a,b,c,d \in \mathbb{R}$, $a > 0$) có hai điểm cực trị $x_1, x_2$ ($x_1 < x_2$) thỏa $x_1 + x_2 = 0$. Hình phẳng giới hạn bởi đường $y = f'(x)f''(x)$ và trục hoành có diện tích bằng $\dfrac94$. Biết $\displaystyle\int_{x_1}^{x_2}\dfrac{f'(x)}{3^x + 1}\,dx = -\dfrac72$, giá trị của $\displaystyle\int_0^{x_2}(x+2)f''(x)\,dx$ thuộc khoảng nào?

Dạng: Đa thức bậc ba có $f'$ là hàm chẵn ($x_1+x_2=0$); khai thác diện tích $y=f'f''$ và tính chất tích phân hàm chẵn chia $b^x+1$.

Phương pháp: Từ $x_1+x_2=0$ suy ra $b=0$ nên $f'$ chẵn; diện tích $y=f'f''$ với Ox bằng $\int|f'f''| = f'(0)^2 = c^2 = \frac94$; dùng tính chất $\int_{-t}^{t}\frac{g(x)}{b^x+1}dx = \int_0^t g(x)dx$ (g chẵn) để tìm $a$; thay vào tính tích phân cuối.

Lời giải:
$f'(x) = 3ax^2 + 2bx + c$; $x_1 + x_2 = -\dfrac{2b}{3a} = 0 \Rightarrow b = 0$. Vậy $f'(x) = 3ax^2 + c$ là hàm chẵn ($c < 0$ để có hai cực trị), $f''(x) = 6ax$.

Vì $f'f'' = 0 \Leftrightarrow x = 0, x_1, x_2$ và $\int f'f''\,dx = \dfrac{(f')^2}{2}$, diện tích:
$$\dfrac94 = \left|\int_{x_1}^0 f'f''\,dx\right| + \left|\int_0^{x_2} f'f''\,dx\right| = \dfrac{f'(0)^2}{2} + \dfrac{f'(0)^2}{2} = f'(0)^2 = c^2 \Rightarrow c = -\dfrac32.$$

Vì $f'$ chẵn nên $\displaystyle\int_{x_1}^{x_2}\dfrac{f'(x)}{3^x+1}\,dx = \int_0^{x_2} f'(x)\,dx = f(x_2) - f(0) = a x_2^3 + c x_2$. Với $x_2 = \dfrac{1}{\sqrt{2a}}$ (nghiệm dương của $f'=0$):
$$a x_2^3 + c x_2 = \dfrac{1}{2\sqrt{2a}} - \dfrac{3}{2\sqrt{2a}} = -\dfrac{1}{\sqrt{2a}} = -\dfrac72 \Rightarrow \sqrt{2a} = \dfrac27 \Rightarrow a = \dfrac{2}{49},\ x_2 = \dfrac72.$$

Khi đó $f''(x) = 6ax = \dfrac{12x}{49}$, nên
$$\int_0^{7/2}(x+2)\dfrac{12x}{49}\,dx = \dfrac{12}{49}\left[\dfrac{x^3}{3} + x^2\right]_0^{7/2} = \dfrac{12}{49}\cdot\dfrac{637}{24} = \dfrac{13}{2} = 6{,}5 \in (6; 7).$$

Đáp số: khoảng $(6; 7)$ (đáp án C).

Dạng tương tự: $f'$ chẵn (khi tổng hai cực trị bằng 0, $b=0$). Diện tích $y = f'f''$ với Ox quy về $f'(0)^2$ nhờ nguyên hàm $\frac{(f')^2}{2}$. Tích phân hàm chẵn chia $b^x+1$ trên đoạn đối xứng bằng nửa tích phân thường: $\int_{-t}^t \frac{g}{b^x+1} = \int_0^t g$.

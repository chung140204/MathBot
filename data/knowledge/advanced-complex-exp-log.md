# Vận dụng cao - Số phức, Mũ, Logarit (COMPLEX_NUMBERS + EXPONENTIAL_LOG)

---
[topic: COMPLEX_NUMBERS]
[source: Vận dụng cao - Tập hợp điểm trên mặt phẳng phức]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_tap_hop_diem_tren_mat_phang]
[relatedTopics: ANALYTIC_GEOMETRY]

Dạng: Tìm tập hợp điểm $M$ biểu diễn $z$ thỏa điều kiện.

$|z - z_1| + |z - z_2| = 2a$ ($2a > |z_1 - z_2|$): elip, tiêu điểm $z_1$, $z_2$
$|z - z_1| - |z - z_2| = 2a$: hyperbol
$\text{arg}(z - z_0) = \alpha$: tia từ $z_0$

Ví dụ: $|z - 1 - i| = |z + 1 + i|$ → $M$ nằm trên trung trực đoạn $A(1,1)B(-1,-1)$
→ Đường thẳng $y = -x$ (vuông góc $AB$ tại trung điểm)

Dạng cực trị: Tìm min/max $|z - a|$ khi $|z - b| = R$
- Hình học: khoảng cách ngắn nhất/dài nhất từ $a$ đến đường tròn tâm $b$ bán kính $R$
- Min = $|ab| - R$, Max = $|ab| + R$ (nếu $a$ ngoài đường tròn)

---
[topic: COMPLEX_NUMBERS]
[source: Vận dụng cao - Phương trình số phức bậc cao]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_phuong_trinh_so_phuc_bac_ca]

Dạng: Giải $z^n = w$ hoặc tìm $z$ thỏa điều kiện phức tạp.

$z^2 = a + bi$: Đặt $z = x + yi$, khai triển:
- $x^2 - y^2 = a$ và $2xy = b$
- Kết hợp với $|z|^2 = x^2 + y^2 = \sqrt{a^2 + b^2}$
- Giải hệ tìm $x, y$

Căn bậc n:
$$z_k = \sqrt[n]{r} \left(\cos\frac{\varphi + 2k\pi}{n} + i\sin\frac{\varphi + 2k\pi}{n}\right), \quad k = 0, 1, ..., n-1$$

Ví dụ: $z^3 = -8$
- $|-8| = 8$, $\arg(-8) = \pi$
- $z_k = 2\left(\cos\frac{\pi + 2k\pi}{3} + i\sin\frac{\pi + 2k\pi}{3}\right)$
- $z_0 = 1 + i\sqrt{3}$, $z_1 = -2$, $z_2 = 1 - i\sqrt{3}$

---
[topic: EXPONENTIAL_LOG]
[source: Vận dụng cao - Hệ phương trình mũ logarit]
[difficulty: APPLICATION]
[subTopic: van_dung_cao_he_phuong_trinh_mu_logarit]

Dạng: Giải hệ PT mũ-logarit.

Kỹ thuật:
1. Đặt ẩn phụ: $u = a^x$, $v = a^y$ (hoặc $u = \log x$)
2. Biến đổi về hệ đại số
3. Giải hệ → quay lại ẩn gốc

Ví dụ:
$\begin{cases} 2^x + 2^y = 6 \\ x + y = 4 \end{cases}$

Đặt $a = 2^x$, $b = 2^y$: $a + b = 6$, $ab = 2^{x+y} = 2^4 = 16$
→ $a, b$ là nghiệm $t^2 - 6t + 16 = 0$ → $\Delta = -28 < 0$ → vô nghiệm

---
[topic: EXPONENTIAL_LOG]
[source: Vận dụng cao - Bất phương trình mũ logarit tham số]
[difficulty: ADVANCED]
[subTopic: van_dung_cao_bat_phuong_trinh_mu_logarit]

Dạng: Tìm $m$ để BPT $f(x, m) \geq 0$ đúng $\forall x$ (hoặc có nghiệm).

Phương pháp:
- Đưa về dạng $m \geq g(x)$ hoặc $m \leq g(x)$ $\forall x$
- BPT đúng $\forall x$ ↔ $m \geq \max g(x)$ (hoặc $m \leq \min g(x)$)
- Khảo sát hàm $g(x)$ tìm GTLN/GTNN

Ví dụ: Tìm $m$ để $\log_2(x^2 + 2) \leq m$ $\forall x \in [-1, 1]$
- Cần $m \geq \max_{[-1,1]} \log_2(x^2 + 2)$
- $h(x) = x^2 + 2$ đạt max tại $x = \pm 1$: $h = 3$
- $m \geq \log_2 3$

---
[topic: EXPONENTIAL_LOG]
[source: Vận dụng cao - Bài toán lãi suất kép nâng cao]
[difficulty: ADVANCED]
[subTopic: van_dung_cao_bai_toan_lai_suat_kep_nang_]

Bài toán tài chính:

Gửi tiết kiệm lãi kép: $A = P(1 + r)^n$

Gửi góp đều mỗi kỳ (annuity):
$$A = T \cdot \frac{(1+r)^n - 1}{r}$$
- $T$: số tiền gửi mỗi kỳ
- $r$: lãi suất mỗi kỳ
- $n$: số kỳ

Trả nợ đều mỗi kỳ:
$$T = P \cdot \frac{r(1+r)^n}{(1+r)^n - 1}$$
- $P$: gốc vay
- $T$: số tiền trả mỗi kỳ

Ví dụ: Vay 500 triệu, lãi 0.5%/tháng, trả đều 60 tháng:
$$T = 500 \cdot \frac{0.005 \cdot 1.005^{60}}{1.005^{60} - 1} \approx 9.67 \text{ triệu/tháng}$$

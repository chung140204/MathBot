# Dãy số (SEQUENCES)

---
[topic: SEQUENCES]
[source: SGK Toán 12 - Cấp số cộng]
[difficulty: COMPREHENSION]
[subTopic: toan_12_cap_so_cong]

Cấp số cộng (CSC): dãy số mà hiệu hai số hạng liên tiếp không đổi.

Công sai: $d = u_{n+1} - u_n$

Số hạng tổng quát: $u_n = u_1 + (n-1)d$

Tổng $n$ số hạng đầu:
$$S_n = \frac{n(u_1 + u_n)}{2} = \frac{n[2u_1 + (n-1)d]}{2}$$

Tính chất: $u_k = \frac{u_{k-1} + u_{k+1}}{2}$ (trung bình cộng)

Ví dụ: CSC có $u_1 = 3$, $d = 2$:
- $u_n = 3 + 2(n-1) = 2n + 1$
- $S_{10} = \frac{10(3 + 21)}{2} = 120$

---
[topic: SEQUENCES]
[source: SGK Toán 12 - Cấp số nhân]
[difficulty: COMPREHENSION]
[subTopic: toan_12_cap_so_nhan]

Cấp số nhân (CSN): dãy số mà thương hai số hạng liên tiếp không đổi.

Công bội: $q = \frac{u_{n+1}}{u_n}$ (với $u_n \neq 0$)

Số hạng tổng quát: $u_n = u_1 \cdot q^{n-1}$

Tổng $n$ số hạng đầu:
$$S_n = \begin{cases} \frac{u_1(1-q^n)}{1-q} = \frac{u_1(q^n - 1)}{q - 1} & \text{nếu } q \neq 1 \\ nu_1 & \text{nếu } q = 1 \end{cases}$$

Tính chất: $u_k^2 = u_{k-1} \cdot u_{k+1}$ (trung bình nhân)

---
[topic: SEQUENCES]
[source: Toán 12 - Dãy số đặc biệt]
[difficulty: COMPREHENSION]
[subTopic: toan_12_day_so_dac_biet]

Nhận biết dãy số:
- CSC: $u_{n+1} - u_n = d$ (hằng số) ↔ $u_n$ là hàm bậc nhất theo $n$
- CSN: $\frac{u_{n+1}}{u_n} = q$ (hằng số) ↔ $u_n = a \cdot q^n$

Dãy truy hồi thường gặp:
- $u_{n+1} = au_n + b$: đặt $u_n = v_n + c$ (đưa về CSN)
  - $c = \frac{b}{1-a}$ (khi $a \neq 1$)
- $u_{n+1} = u_n + f(n)$: dùng tổng lồng $u_n = u_1 + \sum_{k=1}^{n-1} f(k)$

---
[topic: SEQUENCES]
[source: Toán 12 - Tổng của dãy số]
[difficulty: COMPREHENSION]
[subTopic: toan_12_tong_cua_day_so]

Các công thức tổng quan trọng:
- $1 + 2 + 3 + ... + n = \frac{n(n+1)}{2}$
- $1^2 + 2^2 + ... + n^2 = \frac{n(n+1)(2n+1)}{6}$
- $1 + q + q^2 + ... + q^{n-1} = \frac{q^n - 1}{q - 1}$ (CSN)

Tổng lồng kính (telescoping):
$$\sum_{k=1}^n [f(k+1) - f(k)] = f(n+1) - f(1)$$

Ứng dụng: $\frac{1}{k(k+1)} = \frac{1}{k} - \frac{1}{k+1}$
→ $\sum_{k=1}^n \frac{1}{k(k+1)} = 1 - \frac{1}{n+1} = \frac{n}{n+1}$

---
[topic: SEQUENCES]
[source: Toán 12 - Phương pháp quy nạp]
[difficulty: COMPREHENSION]
[subTopic: toan_12_phuong_phap_quy_nap]

Phương pháp quy nạp toán học:

Bước 1: Kiểm tra mệnh đề đúng với $n = 1$ (hoặc $n = n_0$)
Bước 2: Giả sử đúng với $n = k$ (giả thiết quy nạp)
Bước 3: Chứng minh đúng với $n = k + 1$

Ví dụ: CM $1 + 2 + ... + n = \frac{n(n+1)}{2}$
- $n=1$: $1 = \frac{1 \cdot 2}{2}$ ✓
- Giả sử đúng với $n=k$: $1+2+...+k = \frac{k(k+1)}{2}$
- Với $n=k+1$: $1+2+...+k+(k+1) = \frac{k(k+1)}{2} + (k+1) = \frac{(k+1)(k+2)}{2}$ ✓

---
[topic: SEQUENCES]
[source: Toán 12 - Mẹo thi: Dãy số]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_day_so]
[relatedTopics: LIMITS]

Mẹo thi nhanh cho dãy số:

1. Tìm $u_n$ biết $S_n$: $u_n = S_n - S_{n-1}$ (với $n \geq 2$), $u_1 = S_1$

2. CSC: $S_n$ là đa thức bậc 2 theo $n$ (không có hằng số hoặc hằng số = 0)
   CSN: $S_n = a(q^n - 1)$

3. Ba số lập CSC: đặt $a-d, a, a+d$
   Ba số lập CSN: đặt $\frac{a}{q}, a, aq$

4. Cho $u_1, d$ (CSC) tìm $n$ để $S_n$ max:
   - $S_n$ max khi $u_n \geq 0$ và $u_{n+1} \leq 0$

5. Tổng vô hạn CSN ($|q| < 1$): $S = \frac{u_1}{1-q}$

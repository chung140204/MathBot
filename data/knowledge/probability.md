# Xác suất và Tổ hợp (PROBABILITY)

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Quy tắc đếm]
[difficulty: RECOGNITION]
[subTopic: toan_12_quy_tac_dem]

Quy tắc cộng: Nếu công việc được thực hiện bằng phương án 1 ($m$ cách) HOẶC phương án 2 ($n$ cách), thì tổng số cách = $m + n$.

Quy tắc nhân: Nếu công việc gồm bước 1 ($m$ cách) VÀ bước 2 ($n$ cách), thì tổng số cách = $m \times n$.

Phân biệt: "hoặc" → cộng, "và/rồi" → nhân.

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Hoán vị, Chỉnh hợp, Tổ hợp]
[difficulty: COMPREHENSION]
[subTopic: toan_12_hoan_vi_chinh_hop_to_hop]

Hoán vị: Sắp xếp $n$ phần tử theo thứ tự
$$P_n = n! = n \times (n-1) \times ... \times 1$$

Chỉnh hợp: Chọn $k$ từ $n$, có thứ tự
$$A_n^k = \frac{n!}{(n-k)!}$$

Tổ hợp: Chọn $k$ từ $n$, không thứ tự
$$C_n^k = \binom{n}{k} = \frac{n!}{k!(n-k)!}$$

Tính chất:
- $C_n^k = C_n^{n-k}$
- $C_n^0 = C_n^n = 1$
- $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$ (Pascal)

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Nhị thức Newton]
[difficulty: COMPREHENSION]
[subTopic: toan_12_nhi_thuc_newton]
[relatedTopics: SEQUENCES]

Nhị thức Newton:
$$(a+b)^n = \sum_{k=0}^n C_n^k \cdot a^{n-k} \cdot b^k$$

Khai triển: $C_n^0 a^n + C_n^1 a^{n-1}b + C_n^2 a^{n-2}b^2 + ... + C_n^n b^n$

Hệ số của $x^k$ trong $(ax+b)^n$: $C_n^k \cdot a^{n-k} \cdot b^k$

Tính chất:
- Tổng hệ số: thay $a = b = 1$ → $2^n$
- Hệ số lớn nhất ở giữa: $C_n^{[n/2]}$
- $C_n^0 + C_n^1 + ... + C_n^n = 2^n$
- $C_n^0 - C_n^1 + C_n^2 - ... = 0$

Ví dụ: Tìm hệ số $x^3$ trong $(2x-1)^5$:
$C_5^2 \cdot (2x)^3 \cdot (-1)^2 = 10 \cdot 8 = 80$

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Xác suất cổ điển]
[difficulty: COMPREHENSION]
[subTopic: toan_12_xac_suat_co_dien]

Xác suất cổ điển:
$$P(A) = \frac{n(A)}{n(\Omega)}$$

trong đó:
- $\Omega$: không gian mẫu (tập tất cả kết quả)
- $A$: biến cố
- $n(A)$: số kết quả thuận lợi cho $A$
- $n(\Omega)$: tổng số kết quả

Điều kiện áp dụng: các kết quả đồng khả năng (khả năng xảy ra như nhau).

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Các quy tắc xác suất]
[difficulty: RECOGNITION]
[subTopic: toan_12_cac_quy_tac_xac_suat]

Quy tắc xác suất:
- $0 \leq P(A) \leq 1$
- $P(\Omega) = 1$, $P(\emptyset) = 0$
- Biến cố đối: $P(\bar{A}) = 1 - P(A)$
- Quy tắc cộng: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- Xung khắc ($A \cap B = \emptyset$): $P(A \cup B) = P(A) + P(B)$

Xác suất có điều kiện:
$$P(A|B) = \frac{P(A \cap B)}{P(B)}$$

Hai biến cố độc lập: $P(A \cap B) = P(A) \cdot P(B)$

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Biến ngẫu nhiên rời rạc]
[difficulty: COMPREHENSION]
[subTopic: toan_12_bien_ngau_nhien_roi_rac]

Biến ngẫu nhiên rời rạc $X$:
- Bảng phân phối xác suất: liệt kê các giá trị $x_i$ và $P(X = x_i)$
- Tổng xác suất: $\sum P(X = x_i) = 1$

Kỳ vọng (giá trị trung bình):
$$E(X) = \sum x_i \cdot P(X = x_i)$$

Phương sai:
$$D(X) = E(X^2) - [E(X)]^2 = \sum x_i^2 \cdot P(X = x_i) - [E(X)]^2$$

Độ lệch chuẩn: $\sigma(X) = \sqrt{D(X)}$

---
[topic: PROBABILITY]
[source: SGK Toán 12 - Phân phối nhị thức]
[difficulty: COMPREHENSION]
[subTopic: toan_12_phan_phoi_nhi_thuc]
[relatedTopics: SEQUENCES]

Phân phối nhị thức $B(n, p)$:
- $n$ phép thử độc lập, mỗi phép có xác suất thành công $p$
- $X$ = số lần thành công

$$P(X = k) = C_n^k \cdot p^k \cdot (1-p)^{n-k}$$

Kỳ vọng: $E(X) = np$
Phương sai: $D(X) = np(1-p)$

Ví dụ: Gieo xúc xắc 5 lần, XS được đúng 2 lần mặt 6:
$P(X=2) = C_5^2 \cdot (\frac{1}{6})^2 \cdot (\frac{5}{6})^3 = 10 \cdot \frac{125}{7776} = \frac{1250}{7776}$

---
[topic: PROBABILITY]
[source: Toán 12 - Bài toán xác suất hay gặp]
[difficulty: COMPREHENSION]
[subTopic: toan_12_bai_toan_xac_suat_hay_gap]

Các dạng bài xác suất thường gặp:

1. Chọn phần tử từ tập hợp:
   - Chọn $k$ từ $n$: dùng $C_n^k$
   - Chọn có điều kiện: chia trường hợp

2. Gieo xúc xắc/đồng xu:
   - Không gian mẫu: $6^n$ (n xúc xắc), $2^n$ (n đồng xu)

3. Rút thẻ/bi:
   - Rút có hoàn lại: các phép thử độc lập
   - Rút không hoàn lại: dùng tổ hợp

4. XS "ít nhất 1": $P(\text{ít nhất 1}) = 1 - P(\text{không có cái nào})$

---
[topic: PROBABILITY]
[source: Toán 12 - Mẹo thi: Xác suất]
[difficulty: ADVANCED]
[subTopic: toan_12_meo_thi_xac_suat]

Mẹo thi nhanh cho xác suất:

1. "Ít nhất" → dùng biến cố đối: $P(X \geq 1) = 1 - P(X = 0)$

2. Đếm nhanh bằng bù: Số cách thỏa mãn = Tổng - Số cách không thỏa mãn

3. Chọn nhóm có phân biệt: $C_m^a \cdot C_n^b$ (chọn $a$ từ nhóm $m$, $b$ từ nhóm $n$)

4. Sắp xếp có ràng buộc: cố định phần tử ràng buộc trước, sắp phần còn lại

5. Xác suất điều kiện: nếu thấy "biết rằng" → dùng $P(A|B)$

6. Phân phối nhị thức: nhận dạng qua "lặp lại $n$ lần", "xác suất thành công mỗi lần là $p$"

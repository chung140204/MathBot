# Vận dụng cao - Xác suất (PROBABILITY)

---
[topic: PROBABILITY]
[source: Vận dụng cao - Xác suất có điều kiện nâng cao]

Dạng: Bài toán xác suất nhiều bước, rút không hoàn lại.

Ví dụ: Hộp có 5 bi đỏ, 3 bi xanh. Rút ngẫu nhiên 3 bi. Tìm XS có đúng 2 bi đỏ.
$$P = \frac{C_5^2 \cdot C_3^1}{C_8^3} = \frac{10 \cdot 3}{56} = \frac{30}{56} = \frac{15}{28}$$

Dạng nâng cao: Rút lần lượt không hoàn lại
- Lần 1 đỏ, lần 2 đỏ, lần 3 xanh: $\frac{5}{8} \cdot \frac{4}{7} \cdot \frac{3}{6}$
- Nhưng thứ tự có thể khác → nhân với $C_3^2 = 3$ (chọn vị trí 2 bi đỏ)
- $P = 3 \cdot \frac{5}{8} \cdot \frac{4}{7} \cdot \frac{3}{6} = \frac{15}{28}$

---
[topic: PROBABILITY]
[source: Vận dụng cao - Bài toán đếm có ràng buộc]

Dạng: Đếm số cách sắp xếp/chọn có điều kiện ràng buộc.

Kỹ thuật phần bù: Số cách thỏa mãn = Tổng - Số cách KHÔNG thỏa mãn

Ví dụ: Có bao nhiêu số tự nhiên gồm 4 chữ số khác nhau đôi một, chia hết cho 5?
- Chữ số tận cùng = 0 hoặc 5
- TH1: tận cùng = 0 → chọn 3 chữ số từ {1..9}: $A_9^3 = 504$
- TH2: tận cùng = 5 → chữ số đầu $\neq 0$: $8 \cdot A_8^2 = 448$
- Tổng: $504 + 448 = 952$

Kỹ thuật chặn: Đếm cách chia $n$ vật vào $k$ nhóm
- Phương pháp ngôi sao và thanh: $C_{n+k-1}^{k-1}$

---
[topic: PROBABILITY]
[source: Vận dụng cao - Nhị thức Newton nâng cao]

Dạng: Tìm hệ số, số hạng trong khai triển nhị thức.

Số hạng tổng quát $(a + b)^n$: $T_{k+1} = C_n^k \cdot a^{n-k} \cdot b^k$

Ví dụ: Tìm hệ số $x^6$ trong $(x^2 - \frac{1}{x})^9$
- $T_{k+1} = C_9^k \cdot (x^2)^{9-k} \cdot (-\frac{1}{x})^k = C_9^k \cdot (-1)^k \cdot x^{18-3k}$
- $18 - 3k = 6 \Rightarrow k = 4$
- Hệ số: $C_9^4 \cdot (-1)^4 = 126$

Ví dụ: Tìm số hạng không chứa $x$ trong $(x + \frac{2}{x^2})^6$
- $T_{k+1} = C_6^k \cdot x^{6-k} \cdot \frac{2^k}{x^{2k}} = C_6^k \cdot 2^k \cdot x^{6-3k}$
- $6 - 3k = 0 \Rightarrow k = 2$
- Số hạng: $C_6^2 \cdot 4 = 60$

---
[topic: PROBABILITY]
[source: Vận dụng cao - Kỳ vọng và phương sai]

Dạng: Tính kỳ vọng/phương sai cho biến ngẫu nhiên phức tạp.

Kỹ thuật chia nhỏ: $X = X_1 + X_2 + ... + X_n$ (biến chỉ thị)
- $E(X) = E(X_1) + ... + E(X_n)$ (luôn đúng)
- Nếu độc lập: $D(X) = D(X_1) + ... + D(X_n)$

Ví dụ: Gieo xúc xắc 100 lần. $X$ = số lần xuất hiện mặt 6.
- $X \sim B(100, \frac{1}{6})$
- $E(X) = 100 \cdot \frac{1}{6} = \frac{50}{3} \approx 16.67$
- $D(X) = 100 \cdot \frac{1}{6} \cdot \frac{5}{6} = \frac{250}{18} \approx 13.89$
- $\sigma = \sqrt{D(X)} \approx 3.73$

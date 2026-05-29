# VDC - Xác suất & Tổ hợp (PROBABILITY) — Đề THPT 2025

---

[topic: PROBABILITY]
[source: Đề 2025 - Phần II (Đúng/Sai) - Câu 1]
[difficulty: APPLICATION]
[subTopic: so_do_cay_xac_suat_toan_phan_bayes]
[embedKey: 20% tin nhắn bị đánh dấu, trong tin bị đánh dấu 10% không phải quảng cáo, trong tin không bị đánh dấu 10% là quảng cáo. Tính P(không đánh dấu), P(không quảng cáo), P(không đánh dấu biết không quảng cáo). Dạng: sơ đồ cây, xác suất toàn phần và Bayes.]
[status: reviewed]

Bài (Đúng/Sai): Một phần mềm nhận dạng tin nhắn quảng cáo. Trong tất cả tin nhắn: $20\%$ bị đánh dấu; trong số bị đánh dấu có $10\%$ không phải quảng cáo; trong số không bị đánh dấu có $10\%$ là quảng cáo. Chọn ngẫu nhiên một tin nhắn. Gọi $A$: "tin nhắn bị đánh dấu", $B$: "tin nhắn là quảng cáo". Xét các mệnh đề:
a) Xác suất tin nhắn không bị đánh dấu là $0{,}8$.
b) Xác suất tin nhắn không phải quảng cáo, biết nó không bị đánh dấu, bằng $0{,}95$.
c) Xác suất tin nhắn không phải quảng cáo bằng $0{,}76$.
d) Xác suất tin nhắn không bị đánh dấu, biết nó không phải quảng cáo, nhỏ hơn $0{,}95$.

Dạng: Sơ đồ cây + xác suất toàn phần + công thức Bayes (xác suất có điều kiện đảo).

Phương pháp: Lập sơ đồ cây với $P(A)=0{,}2$; nhánh $A$: $P(B|A)=0{,}9$, $P(\bar B|A)=0{,}1$; nhánh $\bar A$: $P(B|\bar A)=0{,}1$, $P(\bar B|\bar A)=0{,}9$. Dùng xác suất toàn phần cho $P(\bar B)$ và Bayes cho $P(\bar A|\bar B)$.

Lời giải:
Sơ đồ cây: $P(A)=0{,}2 \Rightarrow P(\bar A)=0{,}8$; $P(B|A)=0{,}9$, $P(\bar B|A)=0{,}1$; $P(B|\bar A)=0{,}1$, $P(\bar B|\bar A)=0{,}9$.

a) $P(\bar A) = 1 - P(A) = 0{,}8$. **Đúng.**
b) $P(\bar B|\bar A) = 0{,}9 \ne 0{,}95$. **Sai.**
c) $P(\bar B) = P(\bar B|A)P(A) + P(\bar B|\bar A)P(\bar A) = 0{,}1\cdot0{,}2 + 0{,}9\cdot0{,}8 = 0{,}74 \ne 0{,}76$. **Sai.**
d) $P(\bar A|\bar B) = \dfrac{P(\bar B|\bar A)P(\bar A)}{P(\bar B)} = \dfrac{0{,}9\cdot0{,}8}{0{,}74} \approx 0{,}973 > 0{,}95$. Mệnh đề nói "$< 0{,}95$" nên **Sai.**

Đáp số: a) Đúng; b) Sai; c) Sai; d) Sai.

Dạng tương tự: Bài "đánh dấu/xét nghiệm" — lập sơ đồ cây 2 tầng, dùng $P(\bar B)=\sum P(\bar B|\cdot)P(\cdot)$ (toàn phần) và Bayes $P(\bar A|\bar B)=\dfrac{P(\bar B|\bar A)P(\bar A)}{P(\bar B)}$ để xét các mệnh đề điều kiện.

---

[topic: PROBABILITY]
[source: Đề 2025 - Phần III (Điền đáp án) - Câu 1]
[difficulty: ADVANCED]
[subTopic: xac_suat_xep_so_thanh_cap_so_cong_tren_tam_giac]
[relatedTopics: SEQUENCES]
[embedKey: Chọn 6 số từ tập {41,...,49} xếp vào A,B,C,M,N,P trên tam giác sao cho (A,M,B),(B,N,C),(C,P,A) là cấp số cộng. Xác suất = 4/a. Tìm a. Dạng: xác suất + cấp số cộng + đếm hoán vị theo tính chẵn lẻ.]
[status: reviewed]

Bài (Điền đáp án): Tập $S = \{41;42;43;44;45;46;47;48;49\}$. Chọn $6$ số khác nhau xếp vào sáu vị trí $A,B,C,M,N,P$ (ba đỉnh tam giác $A,B,C$; $M$ trên cạnh $AB$, $N$ trên $BC$, $P$ trên $CA$) sao cho mỗi bộ $(A,M,B)$, $(B,N,C)$, $(C,P,A)$ là một cấp số cộng (theo thứ tự đó). Chọn và xếp ngẫu nhiên. Xác suất đạt yêu cầu là $\dfrac{4}{a}$. Tìm $a$. [có hình - tam giác $ABC$, $M,N,P$ trên ba cạnh]

Dạng: Xác suất kết hợp điều kiện cấp số cộng và đếm hoán vị có ràng buộc tính chẵn lẻ.

Phương pháp: $|\Omega| = A_9^6$. Điều kiện cấp số cộng ⟺ $M,N,P$ là trung bình cộng các cặp đỉnh ⟹ $A,B,C$ phải cùng tính chẵn lẻ (để trung điểm nguyên thuộc $S$); loại các bộ $\{A,B,C\}$ tự lập cấp số cộng; nhân hoán vị $3!$.

Lời giải:
Số phần tử không gian mẫu: $n(\Omega) = A_9^6 = 60480$.

Vì $(A,M,B)$ là cấp số cộng nên $M = \dfrac{A+B}{2}$; tương tự $N=\dfrac{B+C}{2}$, $P=\dfrac{C+A}{2}$. Để $M,N,P$ là số nguyên thuộc $S$ thì $A,B,C$ cùng tính chẵn lẻ. Trong $S$ có $5$ số lẻ $\{41;43;45;47;49\}$ và $4$ số chẵn $\{42;44;46;48\}$.

- $A,B,C$ cùng lẻ: chọn $3$ số lẻ có $C_5^3 = 10$ cách, loại $4$ bộ tự lập cấp số cộng $(41,43,45),(43,45,47),(41,45,49),(45,47,49)$ còn $6$; hoán vị vào $A,B,C$ có $3!$ ⟹ $6\cdot3!$.
- $A,B,C$ cùng chẵn: $C_4^3 = 4$, loại $2$ bộ $(42,44,46),(44,46,48)$ còn $2$; hoán vị $3!$ ⟹ $2\cdot3!$.

$n(A) = 6\cdot3! + 2\cdot3! = 48$. Xác suất $P(A) = \dfrac{48}{60480} = \dfrac{1}{1260}$.

Theo đề $\dfrac{4}{a} = \dfrac{1}{1260} \Rightarrow a = 4\cdot1260 = 5040$.

Đáp số: $a = 5040$.

Dạng tương tự: Bài "xếp số thỏa cấp số cộng": dùng $A_n^k$ cho không gian mẫu; chuyển điều kiện CSC thành trung điểm ⟹ ràng buộc chẵn/lẻ; đếm tổ hợp cùng tính chẵn lẻ rồi trừ các bộ tự lập CSC (gây trùng giá trị), cuối cùng nhân hoán vị các vị trí đỉnh.

---

[topic: PROBABILITY]
[source: Đề 2025 - Phần III (Điền đáp án) - Câu 4]
[difficulty: ADVANCED]
[subTopic: dem_cach_xep_8_sach_vao_4_ngan_vach_ngan]
[embedKey: 4 ngăn giá sách, 8 quyển sách khác nhau, mỗi ngăn ít nhất 1 quyển, có thứ tự. T là số cách. Tính T/400. Dạng: đếm cách xếp vật phân biệt vào các nhóm liên tiếp khác rỗng bằng phương pháp vách ngăn.]
[status: reviewed]

Bài (Điền đáp án): Có bốn ngăn (đánh số $1,2,3,4$) và $8$ quyển sách khác nhau. Xếp hết $8$ quyển vào bốn ngăn sao cho mỗi ngăn có ít nhất một quyển; trong mỗi ngăn sách xếp thẳng đứng thành hàng. Hai cách xếp giống nhau nếu mỗi ngăn có cùng số lượng và cùng thứ tự sách (trái sang phải). Gọi $T$ là số cách xếp đôi một khác nhau. Tính $\dfrac{T}{400}$. [có hình - minh họa vách ngăn]

Dạng: Đếm số cách xếp các vật phân biệt (có thứ tự) vào các nhóm liên tiếp, mỗi nhóm khác rỗng — phương pháp "vách ngăn".

Phương pháp: Xếp $8$ quyển thành một hàng có $8!$ cách; giữa chúng có $7$ khoảng trống, chọn $3$ khoảng để đặt vách ngăn tạo $4$ ngăn (mỗi ngăn $\ge 1$) có $C_7^3$ cách.

Lời giải:
Xếp $8$ quyển sách khác nhau thành một hàng: $8!$ cách. Hàng có $7$ khoảng trống giữa các quyển; để chia thành $4$ ngăn liên tiếp mỗi ngăn ít nhất một quyển, chọn $3$ trong $7$ khoảng trống đặt vách ngăn: $C_7^3$ cách.

$T = 8!\cdot C_7^3 = 40320\cdot35 = 1\,411\,200$.

$\dfrac{T}{400} = \dfrac{1\,411\,200}{400} = 3528$.

Đáp số: $\dfrac{T}{400} = 3528$.

Dạng tương tự: Xếp $n$ vật phân biệt (có thứ tự trong mỗi nhóm) vào $k$ nhóm liên tiếp khác rỗng: $n!\cdot C_{n-1}^{k-1}$ (xếp hàng $n!$, đặt $k-1$ vách vào $n-1$ khoảng trống).

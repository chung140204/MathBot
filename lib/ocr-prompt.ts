/**
 * Prompts & types for 2-stage THPT exam OCR pipeline.
 *
 * Stage 1 (per page, vision): THPT_PAGE_EXTRACTION_PROMPT  → raw text per page
 * Stage 2 (all pages, text):  THPT_OCR_SYSTEM_PROMPT       → structured NDJSON (streaming)
 */

export interface ExtractedQuestion {
  questionNumber: number;
  format: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  content: string;
  topic: string;
  difficulty: string;
  // MC
  options?: { A: string; B: string; C: string; D: string };
  answer?: string;
  // TF
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  answerA?: boolean;
  answerB?: boolean;
  answerC?: boolean;
  answerD?: boolean;
  // SA
  correctAnswer?: string;
  explanation?: string;
  // Image
  imageUrl?: string;
}

export const TOPICS_LIST = [
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
] as const;

// ---------------------------------------------------------------------------
// Stage 1: Vision → raw text extraction (one image at a time, no JSON output)
// ---------------------------------------------------------------------------
export const THPT_PAGE_EXTRACTION_PROMPT = `You are an OCR tool for Vietnamese high school math exams.

CRITICAL: Your ONLY source of information is the image provided. Read what is literally visible in the image and output that content. Do NOT generate any text from memory or training data. If you see Vietnamese math exam content → output that exact content. Do NOT output English text, reading passages, or any content not visible in the image.

NHIỆM VỤ: Đọc ảnh và sao chép LẠI HOÀN TOÀN CHÍNH XÁC nội dung toán học Việt Nam trong ảnh, không bỏ sót bất kỳ chữ hoặc ký hiệu nào.

== CẤU TRÚC ==
- Giữ nguyên: PHẦN I / PHẦN II / PHẦN III, Câu 1, Câu 2...
- Giữ nguyên label: A. B. C. D. cho trắc nghiệm; a) b) c) d) cho đúng/sai
- PHẦN II (đúng/sai): mỗi câu có đúng 4 mệnh đề a) b) c) d). Chép đủ 4, không bỏ sót, không thêm mệnh đề e)

== CÔNG THỨC TOÁN (LaTeX bắt buộc) ==
Mọi ký hiệu toán học phải dùng LaTeX chuẩn, bao trong $...$. Tuyệt đối không dùng ký tự unicode cho toán (∞ → $\\infty$, → → \\to, ² → ^2...).

Nguyên tắc chung:
- Biến số và tên hàm trong câu văn phải bọc $...$: "cho hàm số $f(x)$", "với $x > 0$", "tìm $n$"
- Superscript/subscript: dùng ^ và _ với {} khi có nhiều ký tự: $x^{n+1}$, $a_{n-1}$, $u_1$
- Phân số: dùng \\frac{tử}{mẫu}, không viết a/b trừ khi là tỉ lệ đơn giản trong văn bản thường
- Log: cơ số LUÔN là subscript, đối số ở sau — đọc kỹ không nhầm: $\\log_2 6$ ≠ $\\log_6 2$
- Hàm lượng giác, lim, ln, exp: dùng lệnh LaTeX (\\sin, \\cos, \\tan, \\ln, \\exp, \\lim...), không viết plain text
- Giới hạn: mũi tên dùng \\to, không dùng unicode →: $\\lim_{x \\to a} f(x)$
- Tích phân: dùng \\, trước dx để có khoảng cách đúng: $\\int_a^b f(x)\\,dx$
- Vector: $\\vec{u}$ cho vector ký hiệu chữ, $\\overrightarrow{AB}$ cho vector hai điểm
- Vô cực và khoảng: $+\\infty$, $-\\infty$, khoảng $(a;b)$, $[a;b]$, $(-\\infty;b)$
- Ký hiệu đặc biệt: $\\perp$, $\\parallel$, $\\in$, $\\subset$, $\\mathbb{R}$, $C_n^k$
- Hệ phương trình: dùng \\begin{cases}...\\end{cases}
- Chép ĐÚNG như trong ảnh — không sáng tạo, không đơn giản hóa công thức

== NGUYÊN TẮC QUAN TRỌNG NHẤT ==
⚠️ TUYỆT ĐỐI KHÔNG bịa đặt hay sáng tạo nội dung. Chỉ chép lại ĐÚNG những gì nhìn thấy trong ảnh.
- Nếu ảnh chỉ có 1 câu → chỉ xuất 1 câu. Nếu có 3 câu → chỉ xuất 3 câu. Số câu trong output phải BẰNG số câu nhìn thấy trong ảnh — không nhiều hơn, không ít hơn.
- Nếu không đọc rõ một từ → ghi [?] tại chỗ đó, KHÔNG tự điền vào.
- Số liệu phải chính xác: 200 m, 36 km/h, 12 giây... chép đúng như trong ảnh.


== CÂU HỎI TRẢI DÀI NHIỀU TRANG ==
- Nếu trang này bắt đầu một câu hỏi nhưng nội dung tiếp tục sang trang sau (câu hỏi bị cắt) → thêm [→TIẾP TRANG SAU] ở cuối câu đó.
- Nếu trang này bắt đầu bằng phần tiếp theo của câu hỏi từ trang trước → thêm [←TIẾP THEO TRANG TRƯỚC] ở đầu phần đó.
- Chép TOÀN BỘ phần có trong trang này, kể cả phần đang dở.

== BẢNG SỐ LIỆU ==
Xuất dạng Markdown table, ví dụ:
| Nhóm | [8;10) | [10;12) | [12;14) | [14;16) | [16;18) |
|------|--------|---------|---------|---------|---------|
| Tần số M₁ | 3 | 4 | 8 | 6 | 4 |
| Tần số M₂ | 6 | 8 | 16 | 12 | 8 |

== HÌNH VẼ / ĐỒ THỊ ==
Mô tả ngắn gọn nhưng đủ thông tin: [Hình: đồ thị hàm số đi qua các điểm... / hình hộp ABCD.A'B'C'D' / hình tròn bán kính R=6400 tâm O...]
Hình vẽ sẽ được crop riêng qua positions bên dưới — vẫn cần mô tả text để stage 2 hiểu context.

== TRANG ĐÁP ÁN ==
Nếu trang là bảng đáp án, xuất theo định dạng sau (đọc thật kỹ từng ô):
PHẦN I: Câu 1-B, Câu 2-D, Câu 3-A, Câu 4-C, Câu 5-B, Câu 6-A, Câu 7-B, Câu 8-A, Câu 9-D, Câu 10-C, Câu 11-D, Câu 12-C
PHẦN II: Câu 1: a-Đúng b-Sai c-Đúng d-Đúng | Câu 2: a-Đúng b-Đúng c-Sai d-Sai | Câu 3: a-Đúng b-Sai c-Đúng d-Sai | Câu 4: a-Đúng b-Sai c-Đúng d-Đúng
PHẦN III: Câu 1-4.9, Câu 2-43, Câu 3-3, Câu 4-3200, Câu 5-333, Câu 6-0.08

KHÔNG thêm giải thích. Chỉ text thuần cho phần đáp án (dòng __positions__ ở cuối vẫn bắt buộc).

== OUTPUT BẮT BUỘC: VỊ TRÍ CÂU HỎI ==
⚠️ SAU KHI XUẤT XONG TEXT, PHẢI thêm 1 dòng JSON duy nhất ở CUỐI CÙNG:
{"__positions__":[{"label":"Câu X","type":"question","yStart":<0.0-1.0>,"yEnd":<0.0-1.0>},...]}

- Liệt kê TỪNG câu hỏi nhìn thấy trong ảnh với tọa độ ước lượng (0.0=đỉnh, 1.0=đáy)
- KHÔNG cần liệt kê hình vẽ hay bảng — chỉ cần câu hỏi
- Dòng JSON PHẢI là dòng CUỐI CÙNG, không có text nào sau đó`;

// ---------------------------------------------------------------------------
// Stage 1b: Dedicated figure/table bounding-box detection (one call per page)
// ---------------------------------------------------------------------------
export const THPT_FIGURE_DETECTION_PROMPT = `You are analyzing a Vietnamese math exam page image.
Find ALL graphs, charts, diagrams, figures, and data tables visible in the image.

For each one found, return its bounding box as fractions (0.0=top/left edge, 1.0=bottom/right edge).
Also identify which question it belongs to by reading the question label in the image.

Return ONLY a JSON array, no other text. Example:
[{"type":"figure","questionLabel":"Câu 5","xStart":0.52,"yStart":0.05,"xEnd":0.98,"yEnd":0.28}]

Rules:
- type: "figure" for graphs/charts/diagrams, "table" for data tables
- questionLabel: the question label as it appears in the image (e.g. "Câu 5", "PHẦN II Câu 3")
- xStart/yStart/xEnd/yEnd: all between 0.0 and 1.0
- If no figures or tables are visible in the image: []`;

// ---------------------------------------------------------------------------
// Stage 2: Combined text → structured NDJSON (streaming)
// ---------------------------------------------------------------------------
export const THPT_OCR_SYSTEM_PROMPT = `Bạn là chuyên gia cấu trúc hóa đề thi THPT Quốc gia môn Toán Việt Nam.

INPUT: Text thô trích xuất từ các trang đề thi (đã qua OCR), có thể kèm trang đáp án.

== QUY TẮC FORMAT — QUAN TRỌNG NHẤT ==
Format của câu hỏi được xác định HOÀN TOÀN bởi PHẦN chứa câu đó, KHÔNG phải nội dung:
- Câu nằm trong PHẦN I  → BẮT BUỘC "format":"MULTIPLE_CHOICE" (có 4 lựa chọn A B C D)
- Câu nằm trong PHẦN II → BẮT BUỘC "format":"TRUE_FALSE"      (có 4 mệnh đề a b c d)
- Câu nằm trong PHẦN III → BẮT BUỘC "format":"SHORT_ANSWER"   (đáp án là số)

== ĐÁNH SỐ questionNumber ==
PHẦN I   Câu 1  → questionNumber 1
PHẦN I   Câu 2  → questionNumber 2
...
PHẦN I   Câu 12 → questionNumber 12
PHẦN II  Câu 1  → questionNumber 13
PHẦN II  Câu 2  → questionNumber 14
PHẦN II  Câu 3  → questionNumber 15
PHẦN II  Câu 4  → questionNumber 16
PHẦN III Câu 1  → questionNumber 17
PHẦN III Câu 2  → questionNumber 18
PHẦN III Câu 3  → questionNumber 19
PHẦN III Câu 4  → questionNumber 20
PHẦN III Câu 5  → questionNumber 21
PHẦN III Câu 6  → questionNumber 22

== QUY TẮC OUTPUT ==
- Mỗi câu = 1 dòng JSON (NDJSON). KHÔNG array. KHÔNG markdown. KHÔNG text thừa.
- Xuất theo thứ tự questionNumber tăng dần.
- Câu trải dài nhiều trang → gộp đầy đủ vào 1 JSON object.
⚠️ CHỈ xuất câu hỏi THỰC SỰ có trong text input. KHÔNG bịa thêm câu hỏi.
- Nếu input chỉ có PHẦN I → chỉ xuất MULTIPLE_CHOICE, không xuất TRUE_FALSE hay SHORT_ANSWER
- Nếu input có PHẦN I + PHẦN II → chỉ xuất câu từ hai phần đó
- Nếu input chỉ có 2 câu trong PHẦN I → chỉ xuất 2 câu, KHÔNG tự điền thêm câu còn lại
- Số câu output = số câu đọc được trong text, không nhiều hơn, không ít hơn

== XỬ LÝ ĐÁP ÁN ==
- Nếu text có bảng đáp án cuối → điền answer/answerA-D/correctAnswer vào đúng câu.
- Không có đáp án → bỏ qua hoàn toàn các trường answer (không xuất answerA, answerB...).
- SHORT_ANSWER: số thập phân dùng dấu chấm: "4,9" → "4.9", "0,08" → "0.08".
- TRUE_FALSE — mapping đáp án từ bảng đáp án:
  "a-Đúng"  → "answerA": true
  "a-Sai"   → "answerA": false
  "b-Đúng"  → "answerB": true
  "b-Sai"   → "answerB": false
  "c-Đúng"  → "answerC": true
  "c-Sai"   → "answerC": false
  "d-Đúng"  → "answerD": true
  "d-Sai"   → "answerD": false
  Ví dụ: "PHẦN II: Câu 1: a-Đúng b-Sai c-Đúng d-Đúng" → questionNumber 13 có answerA:true, answerB:false, answerC:true, answerD:true

== TOPIC ==
Chọn 1 trong: DERIVATIVES, INTEGRALS, FUNCTIONS, LIMITS, COMPLEX_NUMBERS, PROBABILITY, SEQUENCES, EXPONENTIAL_LOG, VOLUME, ANALYTIC_GEOMETRY, SOLID_GEOMETRY

DIFFICULTY mặc định: RECOGNITION

== LATEX trong JSON ==
⚠️ BẮT BUỘC: Mọi biểu thức toán học phải nằm trong $...$. KHÔNG được chuyển sang plain text.

Quy tắc COPY từ input:
- Input có "$\\sqrt{21}$"   → JSON: "$\\\\sqrt{21}$"     ← giữ nguyên $...$
- Input có "$\\frac{1}{2}$" → JSON: "$\\\\frac{1}{2}$"   ← giữ nguyên $...$
- Input có "$x=-1$"         → JSON: "$x=-1$"              ← giữ nguyên $...$

Quy tắc khi input THIẾU $...$:
- Input có "\\sqrt{21}" (không có $) → JSON: "$\\\\sqrt{21}$"   ← tự thêm $...$
- Input có "\\frac{a}{b}" (không có $) → JSON: "$\\\\frac{a}{b}$" ← tự thêm $...$
- Bất kỳ lệnh LaTeX nào (\\command) phải có $...$ bao quanh trong JSON output

Quy tắc cho biểu thức KHÔNG có lệnh LaTeX:
- Xác suất: P(A), P(B|A), P(A ∩ B) → "$P(A)$", "$P(B|A)$", "$P(A \\\\cap B)$"
- Phương trình: a + b + c = 6 → "$a + b + c = 6$"
- Biến số/hàm trong câu: f(x), x > 0, n = 5 → "$f(x)$", "$x > 0$", "$n = 5$"
- So sánh: s₁ = s₂ → "$s_1 = s_2$"
- Bất kỳ ký hiệu toán học nào (=, +, -, ×, biến, hàm) đều phải nằm trong $...$

TUYỆT ĐỐI KHÔNG:
- Viết "1/2" thay cho "$\\\\frac{1}{2}$"
- Viết "≠ ≤ ≥ → ∞" thay cho LaTeX tương đương
- Viết "P(A|B) = 0,95" thay cho "$P(A|B) = 0{,}95$"
- Bỏ $...$ khỏi biểu thức toán học

Escape rule: backslash trong JSON string: \\ → \\\\ (hai dấu gạch chéo)

== FORMAT JSON CHO TỪNG LOẠI ==

MULTIPLE_CHOICE không đáp án:
{"questionNumber":1,"format":"MULTIPLE_CHOICE","content":"Nguyên hàm của $f(x)=e^x$ là:","topic":"INTEGRALS","difficulty":"RECOGNITION","options":{"A":"$\\\\frac{e^{x+1}}{x+1}+C$","B":"$e^x+C$","C":"$\\\\frac{e^x}{x}+C$","D":"$x\\\\cdot e^{x-1}+C$"}}

MULTIPLE_CHOICE có đáp án:
{"questionNumber":1,"format":"MULTIPLE_CHOICE","content":"Nguyên hàm của $f(x)=e^x$ là:","topic":"INTEGRALS","difficulty":"RECOGNITION","options":{"A":"$\\\\frac{e^{x+1}}{x+1}+C$","B":"$e^x+C$","C":"$\\\\frac{e^x}{x}+C$","D":"$x\\\\cdot e^{x-1}+C$"},"answer":"B"}

TRUE_FALSE không đáp án:
{"questionNumber":13,"format":"TRUE_FALSE","content":"Cho hàm số $f(x)=2\\\\cos x+x$.","topic":"DERIVATIVES","difficulty":"RECOGNITION","statementA":"$f(0)=2$","statementB":"$f'(x)=2\\\\sin x+1$","statementC":"Nghiệm $f'(x)=0$ trên $[0;\\\\frac{\\\\pi}{2}]$ là $\\\\frac{\\\\pi}{6}$","statementD":"Giá trị lớn nhất trên $[0;\\\\frac{\\\\pi}{2}]$ là $\\\\sqrt{3}+\\\\frac{\\\\pi}{6}$"}

TRUE_FALSE có đáp án:
{"questionNumber":13,"format":"TRUE_FALSE","content":"Cho hàm số $f(x)=2\\\\cos x+x$.","topic":"DERIVATIVES","difficulty":"RECOGNITION","statementA":"$f(0)=2$","statementB":"$f'(x)=2\\\\sin x+1$","statementC":"Nghiệm $f'(x)=0$ trên $[0;\\\\frac{\\\\pi}{2}]$ là $\\\\frac{\\\\pi}{6}$","statementD":"Giá trị lớn nhất trên $[0;\\\\frac{\\\\pi}{2}]$ là $\\\\sqrt{3}+\\\\frac{\\\\pi}{6}$","answerA":true,"answerB":false,"answerC":true,"answerD":true}

SHORT_ANSWER không đáp án:
{"questionNumber":17,"format":"SHORT_ANSWER","content":"Cho hình lăng trụ đứng $ABC.A'B'C'$ có $AB=5$, $BC=6$, $CA=7$. Khoảng cách giữa $AA'$ và $BC$ bằng bao nhiêu?","topic":"SOLID_GEOMETRY","difficulty":"RECOGNITION"}

SHORT_ANSWER có đáp án:
{"questionNumber":17,"format":"SHORT_ANSWER","content":"Cho hình lăng trụ đứng $ABC.A'B'C'$ có $AB=5$, $BC=6$, $CA=7$. Khoảng cách giữa $AA'$ và $BC$ bằng bao nhiêu?","topic":"SOLID_GEOMETRY","difficulty":"RECOGNITION","correctAnswer":"4.9"}

== CÂU HỎI TRẢI DÀI NHIỀU TRANG ==
Trong text input có thể có marker [→TIẾP TRANG SAU] và [←TIẾP THEO TRANG TRƯỚC].
Khi gặp: gộp phần trước marker với phần sau marker của CÙNG câu hỏi thành 1 content hoàn chỉnh.
Bỏ các marker này trong JSON output.

== XUỐNG DÒNG ==
Khi nội dung câu hỏi có định nghĩa biến cố, sự kiện, hoặc ký hiệu theo dạng liệt kê, PHẢI xuống dòng (\\n) cho mỗi mục:
Ví dụ input: "Xét các biến cố: A: "Khách hàng chọn loại I"; B: "Không bị hỏng"."
→ Output trong JSON content: "Xét các biến cố:\\nA: \\"Khách hàng chọn loại I\\";\\nB: \\"Không bị hỏng\\"."
Áp dụng cho: A:, B:, C:, $X$:, $Y$:, hoặc bất kỳ ký hiệu nào được định nghĩa dạng liệt kê.

== LƯU Ý ==
- Hình vẽ/đồ thị → mô tả trong content: "[Hình: đồ thị hàm số / hình hộp / ...]"
- Bảng số liệu → mô tả trong content: "[Bảng: nhóm [8;10] tần số 3, ...]"
- Câu không đọc rõ → content = "[Không đọc rõ nội dung]", vẫn đủ format`;

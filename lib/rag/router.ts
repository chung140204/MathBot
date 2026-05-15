/**
 * Query router: classifies user message topic using keyword matching.
 * Returns a Topic enum value or null (search all).
 */

const TOPIC_KEYWORDS: Record<string, string[]> = {
  DERIVATIVES: [
    'đạo hàm', "f'(x)", "y'", 'cực trị', 'cực đại', 'cực tiểu',
    'đồng biến', 'nghịch biến', 'tiếp tuyến', 'tiệm cận',
    'khảo sát', 'bảng biến thiên', 'điểm uốn', 'gtln', 'gtnn',
    'giá trị lớn nhất', 'giá trị nhỏ nhất',
  ],
  INTEGRALS: [
    'tích phân', 'nguyên hàm', 'diện tích hình phẳng',
    'thể tích tròn xoay', '∫', 'newton-leibniz',
    'đổi biến', 'từng phần', 'tích phân xác định',
  ],
  FUNCTIONS: [
    'hàm số', 'đồ thị', 'tương giao', 'bậc 3', 'bậc 4',
    'phân thức', 'trùng phương', 'số nghiệm',
  ],
  LIMITS: [
    'giới hạn', 'lim', 'liên tục', 'vô cùng', 'vô định',
    'dãy số hội tụ',
  ],
  COMPLEX_NUMBERS: [
    'số phức', 'phần thực', 'phần ảo', 'mô-đun', 'liên hợp',
    'mặt phẳng phức', 'dạng lượng giác',
  ],
  PROBABILITY: [
    'xác suất', 'tổ hợp', 'chỉnh hợp', 'hoán vị', 'nhị thức',
    'biến cố', 'kỳ vọng', 'phương sai', 'phân phối',
  ],
  SEQUENCES: [
    'cấp số cộng', 'cấp số nhân', 'dãy số', 'công sai', 'công bội',
    'quy nạp',
  ],
  EXPONENTIAL_LOG: [
    'mũ', 'logarit', 'log', 'lũy thừa', 'lãi suất',
    'phương trình mũ', 'phương trình logarit',
  ],
  VOLUME: [
    'thể tích', 'hình chóp', 'hình trụ', 'hình nón', 'hình cầu',
    'lăng trụ', 'mặt cầu', 'khối đa diện', 'hình hộp',
  ],
  ANALYTIC_GEOMETRY: [
    'đường thẳng', 'đường tròn', 'elip', 'parabol', 'oxy',
    'tọa độ', 'tiếp tuyến đường tròn', 'phương trình đường',
  ],
  SOLID_GEOMETRY: [
    'hình học không gian', 'vuông góc mặt phẳng', 'song song',
    'góc nhị diện', 'chéo nhau', 'thiết diện', 'oxyz',
    'khoảng cách hai đường',
  ],
};

export function classifyTopic(message: string): string | null {
  const lower = message.toLowerCase();

  let bestTopic: string | null = null;
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestScore >= 1 ? bestTopic : null;
}

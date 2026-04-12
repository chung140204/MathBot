import { Topic } from '@prisma/client';

export const TOPICS = [
  { id: 'DERIVATIVES', label: 'Đạo hàm' },
  { id: 'INTEGRALS', label: 'Tích phân & Nguyên hàm' },
  { id: 'FUNCTIONS', label: 'Hàm số' },
  { id: 'LIMITS', label: 'Giới hạn' },
  { id: 'COMPLEX_NUMBERS', label: 'Số phức' },
  { id: 'PROBABILITY', label: 'Xác suất - Tổ hợp' },
  { id: 'SEQUENCES', label: 'Dãy số' },
  { id: 'EXPONENTIAL_LOG', label: 'Hàm số mũ - Logarit' },
  { id: 'VOLUME', label: 'Thể tích' },
  { id: 'ANALYTIC_GEOMETRY', label: 'Hình học giải tích' },
  { id: 'SOLID_GEOMETRY', label: 'Hình học không gian' },
] as const;

export const TOPIC_LABEL: Record<Topic, string> = {
  DERIVATIVES: 'Đạo hàm',
  INTEGRALS: 'Tích phân & Nguyên hàm',
  FUNCTIONS: 'Hàm số',
  LIMITS: 'Giới hạn',
  COMPLEX_NUMBERS: 'Số phức',
  PROBABILITY: 'Xác suất - Tổ hợp',
  SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOG: 'Hàm số mũ - Logarit',
  VOLUME: 'Thể tích',
  ANALYTIC_GEOMETRY: 'Hình học giải tích',
  SOLID_GEOMETRY: 'Hình học không gian',
};

export const TOPIC_CONFIG = [
  { key: 'DERIVATIVES', label: 'Đạo hàm', color: 'green', mockAcc: 88 },
  { key: 'INTEGRALS', label: 'Tích phân & Nguyên hàm', color: 'blue', mockAcc: 75 },
  { key: 'FUNCTIONS', label: 'Hàm số', color: 'orange', mockAcc: 62 },
  { key: 'PROBABILITY', label: 'Xác suất - Tổ hợp', color: 'red', mockAcc: 45 },
  { key: 'COMPLEX_NUMBERS', label: 'Số phức', color: 'red', mockAcc: 38 },
  { key: 'EXPONENTIAL_LOG', label: 'Hàm số mũ - Logarit', color: 'blue', mockAcc: 80 },
  { key: 'SOLID_GEOMETRY', label: 'Hình học KG', color: 'purple', mockAcc: 70 },
  { key: 'SEQUENCES', label: 'Dãy số', color: 'green', mockAcc: 72 },
  { key: 'LIMITS', label: 'Giới hạn', color: 'purple', mockAcc: 65 },
  { key: 'ANALYTIC_GEOMETRY', label: 'Hình học GT', color: 'orange', mockAcc: 55 },
  { key: 'VOLUME', label: 'Thể tích', color: 'green', mockAcc: 78 },
];

export const TOPIC_SUBSECTIONS: Record<Topic, string[]> = {
  DERIVATIVES: ['Định nghĩa', 'Quy tắc tính', 'Ứng dụng', 'Bài tập mẫu'],
  INTEGRALS: ['Nguyên hàm', 'Tích phân', 'Ứng dụng', 'Phương pháp tính'],
  FUNCTIONS: ['Khảo sát', 'Cực trị', 'Tiệm cận', 'Tương giao'],
  PROBABILITY: ['Tổ hợp', 'Xác suất', 'Biến ngẫu nhiên'],
  COMPLEX_NUMBERS: ['Định nghĩa', 'Phép toán', 'Biểu diễn', 'Phương trình'],
  EXPONENTIAL_LOG: ['Hàm mũ', 'Logarit', 'Phương trình'],
  SOLID_GEOMETRY: ['Quan hệ song song', 'Quan hệ vuông góc'],
  SEQUENCES: ['Cấp số cộng', 'Cấp số nhân', 'Quy nạp'],
  LIMITS: ['Dãy số', 'Hàm số', 'Liên tục', 'Bài tập'],
  ANALYTIC_GEOMETRY: ['Tọa độ Oxy', 'Oxyz', 'Mặt cầu'],
  VOLUME: ['Khối đa diện', 'Khối tròn xoay'],
};

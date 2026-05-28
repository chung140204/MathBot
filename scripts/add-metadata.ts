/**
 * Script to add difficulty, subTopic, relatedTopics metadata to knowledge markdown files.
 * Usage: npx tsx scripts/add-metadata.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'data', 'knowledge');

// Map topic + source keywords to difficulty
function inferDifficulty(topic: string, source: string, content: string, filename: string): string {
  if (filename.startsWith('exam-vdc')) return 'ADVANCED';
  if (filename.startsWith('advanced-')) {
    if (/nâng cao|khó|tham số/i.test(source)) return 'ADVANCED';
    return 'APPLICATION';
  }
  if (/mẹo|kỹ thuật thi/i.test(source)) return 'ADVANCED';
  if (/bài toán thực tế|bài tập tổng hợp|ứng dụng|tương giao|tiếp tuyến|tích phân từng phần|đổi biến|bất phương trình/i.test(source + ' ' + content.slice(0, 200))) return 'APPLICATION';
  if (/bảng|công thức|quy tắc|định nghĩa|khái niệm|tính chất logarit/i.test(source)) return 'RECOGNITION';
  return 'COMPREHENSION';
}

// Generate subTopic from source
function inferSubTopic(source: string, heading: string): string {
  // Use first heading or source to generate snake_case subTopic
  const text = heading || source;
  return text
    .replace(/SGK.*?[-—–]?\s*/i, '')
    .replace(/Tổng hợp.*?[-—–]?\s*/i, '')
    .replace(/Đề thi.*?[-—–]?\s*/i, '')
    .replace(/Chương \d+.*?[-—–:,]?\s*/i, '')
    .replace(/Mục \d+.*?[-—–:,]?\s*/i, '')
    .trim()
    .toLowerCase()
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêếềểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[ùúủũụưứừửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
}

// Map topic → related topics
const RELATED_TOPICS: Record<string, Record<string, string[]>> = {
  DERIVATIVES: {
    default: [],
    don_dieu: ['FUNCTIONS'],
    cuc_tri: ['FUNCTIONS'],
    gtln_gtnn: ['FUNCTIONS'],
    tiep_tuyen: ['ANALYTIC_GEOMETRY'],
    tuong_giao: ['FUNCTIONS'],
    khao_sat: ['FUNCTIONS'],
    do_thi: ['FUNCTIONS'],
    bai_toan: ['FUNCTIONS'],
    tham_so: ['FUNCTIONS'],
  },
  INTEGRALS: {
    default: [],
    nguyen_ham: ['DERIVATIVES'],
    bang_nguyen: ['DERIVATIVES'],
    dien_tich: ['FUNCTIONS', 'ANALYTIC_GEOMETRY'],
    the_tich: ['FUNCTIONS', 'VOLUME'],
    ham_an: ['DERIVATIVES', 'FUNCTIONS'],
    ung_dung: ['FUNCTIONS', 'VOLUME'],
    bai_toan: ['FUNCTIONS'],
  },
  FUNCTIONS: {
    default: ['DERIVATIVES'],
    phan_thuc: [],
    tiem_can: [],
  },
  LIMITS: {
    default: [],
    gioi_han_day: ['SEQUENCES'],
    gioi_han_ham: ['FUNCTIONS'],
    lien_tuc: ['FUNCTIONS'],
    dac_biet: ['DERIVATIVES'],
  },
  COMPLEX_NUMBERS: {
    default: [],
    hinh_hoc: ['ANALYTIC_GEOMETRY'],
    tap_hop: ['ANALYTIC_GEOMETRY'],
    bieu_dien: ['ANALYTIC_GEOMETRY'],
  },
  PROBABILITY: {
    default: [],
    nhi_thuc: ['SEQUENCES'],
  },
  SEQUENCES: {
    default: [],
    meo: ['LIMITS'],
  },
  EXPONENTIAL_LOG: {
    default: [],
    ham_so: ['FUNCTIONS'],
    ly_thuyet: ['FUNCTIONS'],
    nang_cao: ['DERIVATIVES'],
    pt_bpt: ['FUNCTIONS'],
  },
  VOLUME: {
    default: ['SOLID_GEOMETRY'],
    tich_phan: ['SOLID_GEOMETRY', 'INTEGRALS'],
  },
  SOLID_GEOMETRY: {
    default: [],
    khoang_cach: ['VOLUME'],
    da_dien: ['VOLUME'],
    tron_xoay: ['VOLUME', 'INTEGRALS'],
    meo: ['VOLUME'],
  },
  ANALYTIC_GEOMETRY: {
    default: [],
    khoang_cach: ['SOLID_GEOMETRY'],
    min_max: ['FUNCTIONS', 'DERIVATIVES'],
    mat_cau: [],
    oxyz: ['SOLID_GEOMETRY'],
  },
};

function inferRelatedTopics(topic: string, subTopic: string): string[] {
  const topicMap = RELATED_TOPICS[topic];
  if (!topicMap) return [];

  // Try to match subTopic against keys
  for (const [key, related] of Object.entries(topicMap)) {
    if (key !== 'default' && subTopic.includes(key)) {
      return related;
    }
  }
  return topicMap.default || [];
}

function processFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath, '.md');

  // Split into sections by ---
  const sections = raw.split(/\n---\n/);
  const processed: string[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Check if section has topic/source metadata
    const topicMatch = section.match(/\[topic:\s*(.+?)\]/);
    const sourceMatch = section.match(/\[source:\s*(.+?)\]/);

    if (!topicMatch || !sourceMatch) {
      processed.push(section);
      continue;
    }

    // Skip if already has difficulty
    if (section.includes('[difficulty:')) {
      processed.push(section);
      continue;
    }

    const topic = topicMatch[1].trim();
    const source = sourceMatch[1].trim();

    // Find first heading for subTopic inference
    const headingMatch = section.match(/##\s+(.+)/);
    const heading = headingMatch ? headingMatch[1].trim() : '';

    const difficulty = inferDifficulty(topic, source, section, filename);
    const subTopic = inferSubTopic(source, heading);
    const relatedTopics = inferRelatedTopics(topic, subTopic);

    // Insert metadata after [source: ...] line
    const lines = section.split('\n');
    const newLines: string[] = [];
    let sourceInserted = false;

    for (const line of lines) {
      newLines.push(line);
      if (!sourceInserted && /^\[source:/.test(line)) {
        newLines.push(`[difficulty: ${difficulty}]`);
        newLines.push(`[subTopic: ${subTopic}]`);
        if (relatedTopics.length > 0) {
          newLines.push(`[relatedTopics: ${relatedTopics.join(', ')}]`);
        }
        sourceInserted = true;
      }
    }

    processed.push(newLines.join('\n'));
  }

  const result = processed.join('\n---\n');
  fs.writeFileSync(filePath, result, 'utf-8');
}

// Main
const files = fs.readdirSync(KNOWLEDGE_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => path.join(KNOWLEDGE_DIR, f));

console.log(`Processing ${files.length} knowledge files...\n`);

for (const file of files) {
  const basename = path.basename(file);
  processFile(file);
  const count = (fs.readFileSync(file, 'utf-8').match(/\[difficulty:/g) || []).length;
  console.log(`  ✓ ${basename}: ${count} sections tagged`);
}

console.log('\n✅ Done!');

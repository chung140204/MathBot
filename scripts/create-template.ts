import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

// Sheet 1: MULTIPLE_CHOICE
const mcData = [
  // Header
  ['content','option_a','option_b','option_c','option_d','answer','explanation','topic','difficulty','question_type','format'],
  // Examples
  ['Tính f\'(x) với f(x)=sin(x^2)','2xcos(x^2)','2xcos(x)','cos(x^2)','-2x','A','Áp dụng chain rule','DERIVATIVES','COMPREHENSION','PRACTICE','MULTIPLE_CHOICE'],
  ['Tính tích phân từ 0 đến 1 của x^2 dx','1/3','1/2','1','2/3','A','Công thức tích phân xác định','INTEGRALS','RECOGNITION','PRACTICE','MULTIPLE_CHOICE'],
  ['Modulus của z=3+4i là','5','7','4','3','A','|z|=sqrt(9+16)=5','COMPLEX_NUMBERS','RECOGNITION','EXAM_SET','MULTIPLE_CHOICE'],
  ['Nghiem phuong trinh 2^(2x+1)=8','x=1','x=5/2','x=3','x=3/2','A','2^(2x+1)=2^3 nen 2x+1=3 nen x=1','EXPONENTIAL_LOGARITHM','COMPREHENSION','THPT_EXAM','MULTIPLE_CHOICE'],
]

// Sheet 2: TRUE_FALSE
const tfData = [
  ['content','statement_a','statement_b','statement_c','statement_d','answer_a','answer_b','answer_c','answer_d','explanation','topic','difficulty','question_type','format'],
  ['Cho ham so f(x)=x^3-3x+2','Ham so dong bien tren (1,+inf)','Ham so nghich bien tren (-1,1)','Ham co cuc dai tai x=-1','Ham co cuc tieu tai x=1','TRUE','TRUE','TRUE','TRUE','f\'(x)=3x^2-3=3(x-1)(x+1)','FUNCTION_ANALYSIS','APPLICATION','THPT_EXAM','TRUE_FALSE'],
]

// Sheet 3: SHORT_ANSWER
const saData = [
  ['content','correct_answer','explanation','topic','difficulty','question_type','format'],
  ['Tinh dien tich hinh phang gioi han boi y=x^2 va y=x','0.1667','S=integral tu 0 den 1 cua (x-x^2)dx=1/6','INTEGRALS','ADVANCED','THPT_EXAM','SHORT_ANSWER'],
  ['Tim so nguyen duong nho nhat n sao cho C(n,2) > 100','15','C(15,2)=105>100, C(14,2)=91<100','COMBINATORICS_PROBABILITY','APPLICATION','THPT_EXAM','SHORT_ANSWER'],
]

const wb = XLSX.utils.book_new()

const ws1 = XLSX.utils.aoa_to_sheet(mcData)
ws1['!cols'] = [{wch:40},{wch:20},{wch:20},{wch:20},{wch:20},{wch:8},{wch:40},{wch:20},{wch:15},{wch:15},{wch:18}]
XLSX.utils.book_append_sheet(wb, ws1, 'MULTIPLE_CHOICE')

const ws2 = XLSX.utils.aoa_to_sheet(tfData)
XLSX.utils.book_append_sheet(wb, ws2, 'TRUE_FALSE')

const ws3 = XLSX.utils.aoa_to_sheet(saData)
XLSX.utils.book_append_sheet(wb, ws3, 'SHORT_ANSWER')

const outDir = path.join(process.cwd(), 'public/templates')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const outPath = path.join(outDir, 'questions_template.xlsx')
XLSX.writeFile(wb, outPath)
console.log('✅ Template created at:', outPath)
console.log('   Sheet 1: MULTIPLE_CHOICE —', mcData.length - 1, 'examples')
console.log('   Sheet 2: TRUE_FALSE —', tfData.length - 1, 'examples')
console.log('   Sheet 3: SHORT_ANSWER —', saData.length - 1, 'examples')

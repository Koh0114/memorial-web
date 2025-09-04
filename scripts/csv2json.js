// scripts/csv2json.js
// 사용: node scripts/csv2json.js
// 입력: 프로젝트 루트에 dots.csv (첫 줄 헤더: x,y)
// 출력: public/dots.json  { width, height, dots:[[x,y],...] }

const fs = require('fs');
const path = require('path');

const CSV = path.resolve(process.cwd(), 'dots.csv');               // dots.csv 경로
const OUT = path.resolve(process.cwd(), 'public', 'dots.json');    // 출력 경로

// 네가 좌표를 뽑았던 원본 이미지 크기(로그: 600 x 620)
const BASE_W = 600;
const BASE_H = 620;

if (!fs.existsSync(CSV)) {
  console.error('dots.csv 파일이 프로젝트 루트에 없어요:', CSV);
  process.exit(1);
}

const raw = fs.readFileSync(CSV, 'utf8').trim().split(/\r?\n/);
if (raw.length <= 1) {
  console.error('dots.csv 내용이 비어 있거나 헤더만 있습니다.');
  process.exit(1);
}

// 첫 줄 헤더(x,y)를 건너뛰고 좌표 파싱
const dots = raw.slice(1).map(line => {
  const [x, y] = line.split(',').map(n => parseInt(n.trim(), 10));
  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error(`숫자 파싱 실패: ${line}`);
  }
  return [x, y];
});

// 출력 디렉터리 보장
fs.mkdirSync(path.dirname(OUT), { recursive: true });

// JSON 저장(압축 저장, 보기 원하면 두 번째 인자 2로 들여쓰기)
fs.writeFileSync(OUT, JSON.stringify({ width: BASE_W, height: BASE_H, dots }), 'utf8');

console.log('OK →', OUT);
console.log('size:', BASE_W, 'x', BASE_H, 'count:', dots.length);
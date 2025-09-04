// app/mosaic/preview/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Dot = [number, number];
type DotsJson = { width: number; height: number; dots: Dot[] };

const GOLD = '#f5c542';
const WHITE = '#f8fafc';      // 완전 흰색보다 살짝 부드러운 흰색
const STROKE_WHITE = '#334155'; // 흰 점 테두리(어두운 배경에서 선명)

function useSeededRandom(seed = 42) {
  let x = seed % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [dots, setDots] = useState<Dot[]>([]);
  const [base, setBase] = useState({ w: 600, h: 620 });
  const [w, setW] = useState(600);
  const [h, setH] = useState(620);

  // 미리보기 모드: 흰색/금색/혼합
  const [mode, setMode] = useState<'white'|'gold'|'mix'>('mix');
  const [ratio, setRatio] = useState(30); // 혼합일 때 금색 비율(%)

  // 좌표 로드
  useEffect(() => {
    fetch('/dots.json')
      .then(r => r.json())
      .then((j: DotsJson) => {
        setDots(j.dots);
        setBase({ w: j.width, h: j.height });
        setW(j.width);
        setH(j.height);
      });
  }, []);

  // 반응형 크기
  useEffect(() => {
    const onResize = () => {
      const parent = wrapRef.current;
      if (!parent) return;
      const maxW = Math.min(parent.clientWidth, 1200);
      const scale = maxW / base.w;
      setW(Math.round(base.w * scale));
      setH(Math.round(base.h * scale));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [base]);

  // 그리기
  useEffect(() => {
    if (!canvasRef.current || dots.length === 0) return;

    const cvs = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    cvs.width = Math.floor(w * dpr);
    cvs.height = Math.floor(h * dpr);
    cvs.style.width = `${w}px`;
    cvs.style.height = `${h}px`;

    const ctx = cvs.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1) 어두운 배경 먼저 칠하기(다크모드 대비 개선)
    ctx.fillStyle = '#0b0f1a'; // 아주 짙은 남색(순수 검정은 '#000')
    ctx.fillRect(0, 0, w, h);

    const sx = w / base.w;
    const sy = h / base.h;

    // 혼합 모드일 때 금색 점 선별(시드 고정)
    const N = dots.length;
    const goldCount = mode === 'mix' ? Math.round((ratio / 100) * N)
                     : mode === 'gold' ? N
                     : 0;
    const isGold = new Array<boolean>(N).fill(false);
    if (goldCount > 0 && goldCount < N) {
      const rnd = useSeededRandom(42);
      const idxs = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
      }
      for (let k = 0; k < goldCount; k++) isGold[idxs[k]] = true;
    } else if (goldCount === N) {
      isGold.fill(true);
    }

    // 점 그리기
    for (let i = 0; i < N; i++) {
      const [dx, dy] = dots[i];
      const x = Math.round(dx * sx);
      const y = Math.round(dy * sy);
      const paid = isGold[i];
      const color = paid ? GOLD : WHITE;
      const stroke = paid ? '#b78c1b' : STROKE_WHITE;
      const size = paid ? 6 : 4;

      // 유료 윤광
      if (paid) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(245,197,66,0.18)';
        ctx.arc(x, y, size + 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
  }, [dots, w, h, base, mode, ratio]);

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-4">
      {/* 컨트롤 */}
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">현충탑 점묘화(완성본 미리보기)</h1>
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" name="mode" checked={mode==='white'} onChange={()=>setMode('white')} />
            전체 흰색
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="mode" checked={mode==='gold'} onChange={()=>setMode('gold')} />
            전체 금색
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="mode" checked={mode==='mix'} onChange={()=>setMode('mix')} />
            혼합
          </label>
          {mode === 'mix' && (
            <div className="flex items-center gap-2">
              <span>금색 비율</span>
              <input
                type="range" min={0} max={100} value={ratio}
                onChange={(e)=>setRatio(parseInt(e.target.value))}
              />
              <span>{ratio}%</span>
            </div>
          )}
        </div>
      </header>

      {/* 모자이크 래퍼에 검은 배경 적용 */}
      <div ref={wrapRef} className="relative rounded overflow-hidden bg-black">
        <canvas ref={canvasRef} className="w-full h-auto" aria-label="현충탑 점묘화 미리보기" />
      </div>

      {dots.length === 0 && (
        <p className="text-sm text-red-600">public/dots.json이 필요해. (형식: {"{ width, height, dots:[[x,y],...] }"})</p>
      )}
    </section>
  );
}
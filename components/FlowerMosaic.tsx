'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: number;
  x: number; y: number;
  is_paid: boolean | null;
  from_name: string | null;
  is_anonymous: boolean | null;
  color: string | null;
  amount?: number | null;        // 추가
  message?: string | null;       // 추가
  created_at: string;
};

type Particle = {
  id: number;
  // 현재 좌표
  x: number; y: number;
  // 목표 좌표(캔버스 스케일 반영 후)
  tx: number; ty: number;
  // 스타일
  r: number; fill: string; stroke: string;
  // 도착 여부
  settled: boolean;
};

const GOLD  = '#f5c542';
const WHITE = '#f8fafc';          // 완전 흰색(#fff)보다 살짝 부드러운 흰색
const STROKE_WHITE = '#334155';   // 흰 점 테두리(슬레이트 톤), 어두운 배경에서 선명
const BASE_W = 600;   // 너의 dots 원본 가로
const BASE_H = 620;   // 너의 dots 원본 세로

export default function FlowerMosaic() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [w, setW] = useState(600);
  const [h, setH] = useState(620);

  // 파티클 맵(id -> Particle)
  const partsRef = useRef<Map<number, Particle>>(new Map());
  const rafRef = useRef<number | null>(null);

  // 툴팁
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; text: string }>({ show: false, x: 0, y: 0, text: '' });

  // 데이터 로드
  useEffect(() => {
    supabase
      .from('offerings')
      .select('id,x,y,color,is_paid,amount,from_name,is_anonymous,message,created_at')
      .not('x', 'is', null)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error('load error:', error.message); return; }
        setRows((data as Row[]) || []);
      });
  }, []);

  // 실시간 추가
  useEffect(() => {
    const ch = supabase
      .channel('offerings-insert-anim')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'offerings' }, payload => {
        const n = payload.new as Row;
        if (n?.x == null || n?.y == null) return; // 좌표 없으면 무시
        setRows(prev => [...prev, n]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // 반응형 크기
  useEffect(() => {
    const onResize = () => {
      const parent = wrapRef.current;
      if (!parent) return;
      const pw = Math.min(parent.clientWidth, 1200);
      const ph = Math.round(pw * (BASE_H / BASE_W));
      setW(pw); setH(ph);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 파티클 생성/업데이트(목표 좌표 갱신)
  useEffect(() => {
    const sx = w / BASE_W;
    const sy = h / BASE_H;

    const parts = partsRef.current;

    // 기존 파티클들의 목표좌표만 새 크기에 맞춰 업데이트
    for (const p of parts.values()) {
      const row = rows.find(r => r.id === p.id);
      if (row) {
        p.tx = Math.round(row.x * sx);
        p.ty = Math.round(row.y * sy);
      }
    }

    // 새로 들어온 행은 파티클 생성(랜덤 스폰 시작점)
    for (const r of rows) {
      if (parts.has(r.id)) continue;

      // 랜덤 스폰 시작점(네 방향 중 랜덤, 혹은 화면 안 랜덤)
      const edge = Math.floor(Math.random() * 4); // 0:좌 1:우 2:상 3:하
      let sx0 = 0, sy0 = 0;
      if (edge === 0) { sx0 = -40; sy0 = Math.random() * h; }
      else if (edge === 1) { sx0 = w + 40; sy0 = Math.random() * h; }
      else if (edge === 2) { sx0 = Math.random() * w; sy0 = -40; }
      else { sx0 = Math.random() * w; sy0 = h + 40; }

      const paid = !!r.is_paid;
      const fill = r.color || (paid ? GOLD : WHITE);
      const stroke = paid ? '#b78c1b' : '#cbd5e1';
      const size = paid ? 6 : 4;

      const p: Particle = {
        id: r.id,
        x: sx0, y: sy0,
        tx: Math.round(r.x * sx),
        ty: Math.round(r.y * sy),
        r: size, fill, stroke,
        settled: false,
      };
      parts.set(r.id, p);
    }

    startLoop(); // 크기 변경/데이터 변경 시 루프 재가동
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, w, h]);

  // 애니메이션 루프
  const startLoop = () => {
    if (rafRef.current) return; // 이미 돌면 무시
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      drawFrame();
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const drawFrame = () => {
    const cvs = canvasRef.current; if (!cvs) return;
    const dpr = window.devicePixelRatio || 1;
    // 고해상도 설정
    if (cvs.width !== Math.floor(w * dpr) || cvs.height !== Math.floor(h * dpr)) {
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
    }
    const ctx = cvs.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0b0f1a'; // pure black이면 '#000'
ctx.fillRect(0, 0, w, h);

    const parts = partsRef.current;
    let allSettled = true;

    // 이동/그리기
    for (const p of parts.values()) {
      if (!p.settled) {
        // 랜덤 스폰 → 목표로 이징
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy);
        // 속도(거리 비례 + 감쇠)
        const speed = Math.max(0.08, Math.min(0.22, dist / 80));
        p.x += dx * speed;
        p.y += dy * speed;
        if (dist < 0.8) {
          p.x = p.tx; p.y = p.ty;
          p.settled = true;
        } else {
          allSettled = false;
        }
      }

      // 윤광(유료만)
      if (p.r > 5) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(245,197,66,0.18)';
        ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // 본 점
      ctx.beginPath();
      ctx.fillStyle = p.fill;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      // 테두리
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 모두 도착했으면 루프 잠깐 멈춰서 CPU 절약
    if (allSettled) stopLoop();
  };

  // 툴팁
  useEffect(() => {
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;

    const onMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // 파티클 히트 테스트(뒤에서부터)
      const parts = Array.from(partsRef.current.values());
      let hit: Particle | null = null;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        const rad = p.r + 6;
        const dx = mx - p.x, dy = my - p.y;
        if (dx * dx + dy * dy <= rad * rad) { hit = p; break; }
      }

      if (hit) {
  const r = rows.find(rr => rr.id === hit.id);
  const name = r?.is_anonymous ? '익명' : (r?.from_name || '헌화자');

  const amt = (r?.amount ?? 0) > 0 ? ` · ${Number(r!.amount).toLocaleString()}원` : '';
  // 메시지는 너무 길면 잘라서 보기 좋게
  const rawMsg = (r?.message || '').trim();
  const msg = rawMsg ? `\n“${rawMsg.slice(0, 100)}${rawMsg.length > 100 ? '…' : ''}”` : '';

  const wrapRect = wrap.getBoundingClientRect();
  setTip({
    show: true,
    x: e.clientX - wrapRect.left + 12,
    y: e.clientY - wrapRect.top + 12,
    text: `${name}${amt}${msg}`, // 한 줄: 이름 + 금액 + 줄바꿈 메시지
  });
} else {
  setTip(t => (t.show ? { ...t, show: false } : t));
}
    };
    const onLeave = () => setTip(t => (t.show ? { ...t, show: false } : t));

    cvs.addEventListener('mousemove', onMove);
    cvs.addEventListener('mouseleave', onLeave);
    return () => {
      cvs.removeEventListener('mousemove', onMove);
      cvs.removeEventListener('mouseleave', onLeave);
    };
  }, [rows]);

  // components/FlowerMosaic.tsx (반환부)
return (
  <div ref={wrapRef} className="relative rounded overflow-hidden bg-black">
    <canvas ref={canvasRef} className="w-full h-auto" aria-label="헌화 점묘화" />
    {tip.show && (
      <div
        className="absolute z-10 px-2 py-1 text-xs rounded shadow"
        style={{
          left: tip.x,
          top: tip.y,
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          pointerEvents: 'none',
          whiteSpace: 'pre-line',
          maxWidth: 320,
        }}
      >
        {tip.text}
      </div>
    )}
  </div>
);
}
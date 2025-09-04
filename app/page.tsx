// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

// 지도 컴포넌트를 클라이언트 전용으로 로드(SSR 끔)
const DaejeonCemeteryMap = dynamic(() => import('@/components/DaejeonCemeteryMap'), {
  ssr: false,
});

export default function Page() {
  // 왼쪽 이미지 영역 크기 측정
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const [imgRatio, setImgRatio] = useState<number | null>(null);
  const [imgHeight, setImgHeight] = useState<number | null>(null);

  // 오른쪽 버튼 스택 높이 측정
  const rightTopRef = useRef<HTMLDivElement>(null);
  const [rightTopH, setRightTopH] = useState<number | null>(null);

  // 버튼 영역과 지도 사이 간격(px)
  const GAP = 24;

  const onImgComplete = (img: HTMLImageElement) => {
    const r = img.naturalHeight / img.naturalWidth;
    setImgRatio(r);
    if (imgBoxRef.current) {
      const w = imgBoxRef.current.clientWidth;
      setImgHeight(Math.round(w * r));
    }
  };

  // 왼쪽 영역 너비 변경 감지 → 이미지 높이 재계산
  useEffect(() => {
    if (!imgRatio || !imgBoxRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setImgHeight(Math.round(w * imgRatio));
    });
    ro.observe(imgBoxRef.current);
    return () => ro.disconnect();
  }, [imgRatio]);

  // 오른쪽 버튼 블록 높이 감지
  useEffect(() => {
    if (!rightTopRef.current) return;
    const ro = new ResizeObserver(entries => {
      setRightTopH(Math.round(entries[0].contentRect.height));
    });
    ro.observe(rightTopRef.current);
    return () => ro.disconnect();
  }, []);

  // 지도 높이 계산: 이미지 높이 - 버튼 영역 높이 - 간격
  const mapH = useMemo(() => {
    if (imgHeight == null || rightTopH == null) return null;
    const h = imgHeight - rightTopH - GAP;
    return Math.max(160, Math.round(h));
  }, [imgHeight, rightTopH]);

  // 초기 렌더용 안전한 높이(fallback)
  const safeMapH = mapH ?? 360;

  // 버튼 공통 클래스
  const btn =
    'bg-gray-200 text-black px-5 py-3 rounded-lg text-center border-2 border-black hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-8">
      {/* 상단 타이틀 */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">온라인 헌화</h1>
        <h3 className="text-xl">언제 어디서든 환경 문제 없는 온라인 헌화하세요.</h3>
      </header>

      {/* 2열 레이아웃 */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* 왼쪽: 사진 전체 표시 + 출처 */}
        <div ref={imgBoxRef} className="w-full">
          <figure className="w-full">
            <Image
              src="/images/daejeon-hero.jpg"
              alt="국립대전현충원 추모 기념 사진"
              width={1200}
              height={1908}
              priority
              className="w-full h-auto rounded"
              sizes="(min-width:1024px) 66vw, 100vw"
              onLoadingComplete={onImgComplete}
            />
            <figcaption className="mt-2 text-xs text-gray-500">출처: 국립대전현충원</figcaption>
          </figure>
        </div>

        {/* 오른쪽: 버튼 스택 + 지도 */}
        <aside className="space-y-6">
          {/* 버튼 블록 */}
          <div ref={rightTopRef} className="space-y-4">
            <h2 className="text-xl font-semibold">바로가기</h2>
            <nav className="grid gap-3">
              <Link href="/offering" className={btn}>헌화하기</Link>
              <Link href="/transparency" className={btn}>현황판</Link>
              <Link href="/etiquette" className={btn}>방문 시 예절</Link>
              <Link href="/guestbook" className={btn}>방명록</Link>
              <Link href="/heroes" className={btn}>안장자 소개</Link>
              <Link href="/purpose" className={btn}>의의</Link>
              <Link href="/mosaic" className={btn}>헌화 현충탑</Link>
            </nav>
          </div>

          {/* 지도: 버튼 아래, 왼쪽 사진 하단과 맞춤 */}
          <div className="mt-6">
            <DaejeonCemeteryMap
              bare
              showHeader={false}
              showExternalLinks={true}
              heightPx={safeMapH}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
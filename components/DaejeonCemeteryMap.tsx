// components/DaejeonCemeteryMap.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

declare global { interface Window { kakao: any } }

type Props = {
  bare?: boolean;                 // true면 테두리/패딩 없이
  heightClass?: string;           // Tailwind 높이 클래스(선택)
  heightPx?: number;              // px 단위 높이(선택)
  showHeader?: boolean;
  showExternalLinks?: boolean;
};

export default function DaejeonCemeteryMap({
  bare = false,
  heightClass = 'h-[480px] md:h-[560px]',
  heightPx,
  showHeader = true,
  showExternalLinks = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) { console.warn('Kakao JS 키가 설정되지 않았어(.env.local 확인)'); return; }
    if (typeof window !== 'undefined' && window.kakao?.maps) { setReady(true); return; }
    const s = document.createElement('script');
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    s.async = true;
    s.onload = () => window.kakao.maps.load(() => setReady(true));
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const { kakao } = window;
    const map = new kakao.maps.Map(ref.current, {
      center: new kakao.maps.LatLng(36.35, 127.33),
      level: 6,
    });
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch('국립대전현충원', (data: any, status: any) => {
      if (status !== kakao.maps.services.Status.OK || !data?.length) return;
      const place = data[0];
      const latlng = new kakao.maps.LatLng(place.y, place.x);
      map.setCenter(latlng);
      map.setLevel(5);
      const marker = new kakao.maps.Marker({ position: latlng, map });
      const iw = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;">국립대전현충원</div>`,
      });
      iw.open(map, marker);
    });
  }, [ready]);

  const commonProps = {
    ref,
    className: `w-full ${heightPx ? '' : heightClass} ${bare ? '' : 'border'} rounded`,
    style: heightPx ? { height: heightPx } : undefined,
    'aria-label': '대전현충원 지도',
  } as const;

  if (bare) {
    return (
      <div className="space-y-3">
        {showHeader && <h2 className="text-xl font-semibold">대전현충원 지도</h2>}
        <div {...commonProps} />
        {showExternalLinks && (
          <div className="flex gap-3">
            <a className="text-blue-600 underline" href="https://map.kakao.com/?q=%EA%B5%AD%EB%A6%BD%EB%8C%80%EC%A0%84%ED%98%84%EC%B6%A9%EC%9B%90" target="_blank" rel="noopener noreferrer">큰 지도로 보기(카카오)</a>
            <a className="text-blue-600 underline" href="https://map.naver.com/p/search/%EA%B5%AD%EB%A6%BD%EB%8C%80%EC%A0%84%ED%98%84%EC%B6%A9%EC%9B%90" target="_blank" rel="noopener noreferrer">큰 지도로 보기(네이버)</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {showHeader && <h2 className="text-xl font-semibold">대전현충원 지도</h2>}
      <div {...commonProps} />
      {showExternalLinks && (
        <div className="flex gap-3">
          <a className="text-blue-600 underline" href="https://map.kakao.com/?q=%EA%B5%AD%EB%A6%BD%EB%8C%80%EC%A0%84%ED%98%84%EC%B6%A9%EC%9B%90" target="_blank" rel="noopener noreferrer">큰 지도로 보기(카카오)</a>
          <a className="text-blue-600 underline" href="https://map.naver.com/p/search/%EA%B5%AD%EB%A6%BD%EB%8C%80%EC%A0%84%ED%98%84%EC%B6%A9%EC%9B%90" target="_blank" rel="noopener noreferrer">큰 지도로 보기(네이버)</a>
        </div>
      )}
    </div>
  );
}
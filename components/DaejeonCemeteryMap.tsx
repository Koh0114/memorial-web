// components/DaejeonCemeteryMap.tsx (교체용)
'use client';
import { useEffect, useRef } from 'react';

type Props = {
  bare?: boolean;
  heightClass?: string;
  heightPx?: number;
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

  useEffect(() => {
    const w = window as any;

    const init = () => {
      if (!ref.current) return;
      if (!w.kakao?.maps) return;

      const { kakao } = w;

      const map = new kakao.maps.Map(ref.current, {
        center: new kakao.maps.LatLng(36.35, 127.33),
        level: 6,
      });

      if (!kakao.maps.services?.Places) {
        console.warn('kakao.maps.services가 없습니다. SDK URL에 libraries=services가 포함되어야 합니다.');
        return;
      }

      const ps = new kakao.maps.services.Places();
      ps.keywordSearch('국립대전현충원', (data: any, status: any) => {
        if (status !== kakao.maps.services.Status.OK || !data?.length) return;
        const place = data[0];
        const lat = Number(place.y);
        const lng = Number(place.x);
        const latlng = new kakao.maps.LatLng(lat, lng);
        map.setCenter(latlng);
        map.setLevel(5);
        const marker = new kakao.maps.Marker({ position: latlng, map });
        const iw = new kakao.maps.InfoWindow({
          content: `<div style="padding:6px 10px;font-size:12px;">국립대전현충원</div>`,
        });
        iw.open(map, marker);
      });
    };

    // autoload=false 이므로 load로 초기화
    if (w.kakao?.maps?.load) {
      w.kakao.maps.load(init);
    } else {
      // 혹시 스크립트가 아직이면 잠깐 대기
      const id = setInterval(() => {
        if (w.kakao?.maps?.load) {
          clearInterval(id);
          w.kakao.maps.load(init);
        }
      }, 100);
      return () => clearInterval(id);
    }
  }, []);

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
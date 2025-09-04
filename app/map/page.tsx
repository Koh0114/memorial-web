// app/map/page.tsx
'use client';
import Link from "next/link";
import DaejeonCemeteryMap from "@/components/DaejeonCemeteryMap";

export default function Page() {
  return (
    <section className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">대전현충원 지도</h1>
        <Link href="/" className="text-blue-600 underline">← 홈으로</Link>
      </header>

      {/* 박스 없이 넓게 표시 */}
      <DaejeonCemeteryMap bare showHeader={false} showExternalLinks heightClass="h-[640px] lg:h-[760px]" />

      <div className="text-sm text-gray-600">
        지도 로드가 안 보이면 .env.local의 NEXT_PUBLIC_KAKAO_JS_KEY와 카카오 허용 도메인을 확인해줘.
      </div>
    </section>
  );
}
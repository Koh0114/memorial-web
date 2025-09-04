// app/mosaic/page.tsx
import FlowerMosaic from '@/components/FlowerMosaic';

export default function Page() {
  return (
    <section className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">현충탑 헌화 점묘화</h1>
      <FlowerMosaic />
      <p className="text-sm text-gray-600">점 색/크기: 무료=흰, 유료=금(큰 점). 점 위에 마우스를 올리면 헌화자분을 볼 수 있습니다.</p>
    </section>
  );
}
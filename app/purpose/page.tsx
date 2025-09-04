// app/purpose/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <section className="p-6 max-w-3xl mx-auto space-y-8">
      {/* 페이지 헤더 */}
      <header className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">우리가 추모하는 이유(의의)</h1>
    <p className="text-sm text-gray-600">
      온라인 헌화를 통해 환경을 지키고, 예의를 지키며, 기억과 교육을 이어갑니다.
    </p>
  </div>
  <Link href="/" className="text-blue-600 underline">
    ← 홈으로
  </Link>
        
      </header>

      {/* 환경 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">환경을 지키기 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>조화 사용을 줄여 쓰레기와 미세플라스틱 배출을 감축합니다.</li>
          <li>배송·이동에 따른 탄소 배출을 줄여 지속가능한 추모 문화를 만듭니다.</li>
          <li>생화는 꼭 필요한 곳에만 쓰고, 온라인 헌화로 마음을 전합니다.</li>
        </ul>
      </section>

      {/* 예절과 존중 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">예절과 존중을 지키기 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>현장·온라인 모두에서 단정한 태도와 언어로 추모합니다.</li>
          <li>유가족과 타 방문객을 배려하고, 과도한 촬영·소음을 자제합니다.</li>
          <li>
            현장 방문 전 예절을 미리 확인해 서로에게 편안한 추모가 되게 합니다.{" "}
            <Link href="/etiquette" className="text-blue-600 underline">방문 시 예절 보기</Link>
          </li>
        </ul>
      </section>

      {/* 교육과 기억 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">교육과 기억을 잇기 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>순국선열의 생애·업적을 쉽게 접하고, 의미를 다시 배웁니다.</li>
          <li>세대와 지역을 넘어 언제든 접근해 추모의 맥락을 이해합니다.</li>
          <li>
            인물 소개와 자료를 모아 기억이 단절되지 않도록 돕습니다.{" "}
            <Link href="/heroes" className="text-blue-600 underline">순국선열 소개</Link>
          </li>
        </ul>
      </section>

      {/* 투명성과 신뢰 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">투명성과 신뢰를 높이기 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>헌화·방명록 통계를 공개해 참여의 흐름을 함께 봅니다.</li>
          <li>기부가 도입될 경우 집행 내역을 주기적으로 공개합니다.</li>
          <li>
            누구나 확인할 수 있는 공개 지표로 신뢰를 쌓습니다.{" "}
            <Link href="/transparency" className="text-blue-600 underline">투명성 대시보드</Link>
          </li>
        </ul>
      </section>

      {/* 참여와 연대 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">참여와 연대를 넓히기 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>시간·장소 제약 없이 누구나 추모에 참여할 수 있습니다.</li>
          <li>함께 남긴 메시지가 기억의 기록이 되어 다음 세대에 전해집니다.</li>
          <li>
            부담 없는 온라인 헌화로 작지만 지속적인 연대를 실천합니다.{" "}
            <Link href="/offering" className="text-blue-600 underline">온라인 헌화하기</Link>
          </li>
        </ul>
      </section>

      {/* 디지털 접근성 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">디지털 접근성을 위해</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>모바일·데스크톱 어디서나 읽기 쉬운 구조와 대비를 지킵니다.</li>
          <li>이미지 대체텍스트·자막 등 기본 접근성을 충실히 반영합니다.</li>
          <li>키보드·스크린리더 사용자도 불편 없이 사용할 수 있게 합니다.</li>
        </ul>
      </section>

      {/* 마무리/바로가기 */}
      <section className="space-y-3">
        <p className="text-sm text-black-600">
          우리의 추모는 기억을 잇고, 서로를 배려하며, 환경을 지키는 실천입니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/offering" className="bg-blue-500 text-white px-4 py-2 rounded">
            온라인 헌화하기
          </Link>
          <Link href="/etiquette" className="bg-blue-500 px-4 py-2 rounded">
            방문 시 예절
          </Link>
          <Link href="/heroes" className="bg-blue-500 px-4 py-2 rounded">
            순국선열 소개
          </Link>
          <Link href="/transparency" className="bg-blue-500 px-4 py-2 rounded">
            투명성 보기
          </Link>
        </div>
      </section>
    </section>
  );
}
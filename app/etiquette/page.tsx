// app/etiquette/page.tsx
import Link from "next/link";
export default function Page() {
  return (
    <section className="p-6 max-w-3xl mx-auto space-y-8">
      {/* 페이지 헤더 */}
      <header className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">현충원 방문 예절</h1>
    <p className="text-sm text-gray-600">
      모두가 같은 마음으로 추모할 수 있도록, 짧게 정리했습니다.
    </p>
  </div>
  <Link href="/" className="text-blue-600 underline">
    ← 홈으로
  </Link>
</header>


      {/* 방문 전 준비 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">방문 전 준비</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>복장은 단정하게, 모자/선글라스는 묘역 앞에서 벗어주세요.</li>
          <li>큰 소리 대화/스피커 음악은 자제해주세요.</li>
          <li>길 찾기, 편의시설 위치는 안내판/안내소에서 먼저 확인해주세요.</li>
        </ul>
      </section>

      {/* 현충원 내에서 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">현충원 내에서</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>걷는 속도, 말소리 톤을 낮추고 다른 방문객을 배려해주세요.</li>
          <li>묘역 앞에서는 잠시 멈춰 마음을 다해 묵념해주세요.</li>
          <li>비석, 조형물 위에 올라가거나 기대지 말아주세요.</li>
          <li>시설이나 잔디, 화단을 훼손하지 않도록 보행로를 이용해주세요.</li>
        </ul>
      </section>

      {/* 사진/영상 촬영 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">사진/영상 촬영</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>유가족이나 타인의 얼굴이 나오지 않도록 주의해주세요(동의 없는 촬영 및 업로드 금지).</li>
          <li>삼각대, 플래시, 드론 사용은 자제하거나 안내에 따라주세요.</li>
          <li>묘역, 봉안시설 내부 촬영 제한 구역 표기를 꼭 확인해주세요.</li>
        </ul>
      </section>

      {/* 어린이, 청소년과 함께라면 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">어린이, 청소년과 함께라면</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>큰 소리로 뛰지 말아주세요.</li>
          <li>쓰레기는 쓰레기통에 버려주세요.</li>
          <li>비석 글씨를 손가락으로 긁거나 문지르지 않도록 해주세요.</li>
          <li>질문이 생기면 안내소, 전시관 자료를 함께 읽어보면 좋아요.</li>
        </ul>
      </section>

      {/* 장애인, 고령자 편의 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">장애인, 고령자 편의</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>휠체어 대여/장애인 전용 화장실은 안내소에서 확인 바랍니다.</li>
          <li>보조기구, 유모차 이용 시 안전한 보행로를 이용해주세요.</li>
          <li>장시간 야외 이동이 힘들면 그늘이나 휴게 공간에서 충분히 쉬어주세요.</li>
        </ul>
      </section>

      {/* 금지·주의 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">금지·주의</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>대전현충원은 전지역 금연구역입니다.</li>
          <li>음주시에는 과음에 주의해주세요.</li>
          <li>원내 취식 행위는 전면 금지입니다.</li>
          <li>확성기, 스피커, 폭죽, 취사 도구 사용 금지.</li>
          <li>대전현충원은 반려동물 출입이 제한됩니다.</li>
        </ul>
      </section>

      {/* 환경을 위한 부탁 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">환경을 위한 부탁</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>일반 조화 대신 원내 제공되는 친환경 조화나 온라인 헌화를 권장합니다(쓰레기, 미세플라스틱 감축).</li>
          <li>개인 쓰레기는 쓰레기통에 버려주시고, 분리배출 표시에 맞춰 버려주십시오.</li>
          <li>과도한 포장이나 일회용품 사용을 줄여주시면 감사하겠습니다.</li>
        </ul>
      </section>

      {/* 긴급·문의 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">긴급·문의</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>분실물, 안전 사고는 가까운 안내소에 즉시 알려주시길 바랍니다.</li>
          <li>응급 상황 시 119, 주변 안내요원, 경비 인력에 도움을 요청해 주세요.</li>
        </ul>
      </section>
    </section>
  );
}
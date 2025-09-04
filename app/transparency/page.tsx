// app/transparency/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Count = {
  offerings: number;
  guestbook: number;
  todayOfferings: number;
  todayGuestbook: number;
};

type Impact = {
  id: string;
  kind: 'volunteer' | 'donation';
  title: string;
  date: string;      // YYYY-MM-DD
  url: string;       // 유튜브 "링크" 전체 (watch, youtu.be, shorts 다 OK)
  amount?: number;   // 금액(원) 선택
  desc?: string;     // 설명 선택
};

// 여기에 “링크”만 넣으면 돼
const IMPACTS: Impact[] = [
  {
    id: 'vol-1',
    kind: 'volunteer',
    title: '현충원 봉사 스냅',
    date: '2025-08-15',
    url: 'https://www.youtube.com/watch?v=roVkDahlRFk', // 시작 30초도 반영
    desc: '제초·청소·안내 봉사 하이라이트',
  },
  {
    id: 'don-1',
    kind: 'donation',
    title: '기부 집행 보고(1차)',
    date: '2025-07-30',
    url: 'https://www.youtube.com/watch?v=roVkDahlRFk',
    amount: 100000,
    desc: '헌화 기부금 일부 집행 내역 요약',
  },
];

// 유튜브 링크 → 임베드 src 변환(프라이버시 모드, 시작시간 반영)
function toYouTubeEmbedSrc(raw: string): string | null {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace('www.', '');
    let id: string | null = null;

    // 시작시간 파라미터 파싱 (t=1m30s, t=90s, start=90)
    const t = u.searchParams.get('t') || u.searchParams.get('start');
    const parseT = (v: string | null) => {
      if (!v) return 0;
      if (/^\d+$/.test(v)) return parseInt(v, 10);
      const m = v.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
      if (!m) return 0;
      const h = parseInt(m[1] || '0', 10);
      const mnt = parseInt(m[2] || '0', 10);
      const s = parseInt(m[3] || '0', 10);
      return h * 3600 + mnt * 60 + s;
    };
    const start = parseT(t);

    if (host === 'youtu.be') {
      // https://youtu.be/ID
      id = u.pathname.split('/').filter(Boolean)[0] || null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') {
        id = u.searchParams.get('v');
      } else if (u.pathname.startsWith('/embed/')) {
        id = u.pathname.split('/')[2] || null;
      } else if (u.pathname.startsWith('/shorts/')) {
        id = u.pathname.split('/')[2] || null;
      }
    } else if (host === 'www.youtube.com') {
      // 일부 환경에서 www. 제거가 안 된 경우 대비
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || null;
      if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || null;
    }

    if (!id) return null;
    const base = `https://www.youtube-nocookie.com/embed/${id}`;
    return start > 0 ? `${base}?start=${start}` : base;
  } catch {
    return null;
  }
}

export default function Page() {
  const [count, setCount] = useState<Count>({
    offerings: 0, guestbook: 0, todayOfferings: 0, todayGuestbook: 0,
  });
  const [loading, setLoading] = useState(true);

  // 상단 요약 카드(누적/오늘)
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { count: offeringsCount } = await supabase
        .from('offerings').select('*', { count: 'exact', head: true });

      const { count: guestbookCount } = await supabase
        .from('guestbook').select('*', { count: 'exact', head: true });

      const start = new Date(); start.setHours(0, 0, 0, 0);

      const { count: todayOfferings } = await supabase
        .from('offerings').select('*', { count: 'exact', head: true })
        .gte('created_at', start.toISOString());

      const { count: todayGuestbook } = await supabase
        .from('guestbook').select('*', { count: 'exact', head: true })
        .gte('created_at', start.toISOString());

      setCount({
        offerings: offeringsCount ?? 0,
        guestbook: guestbookCount ?? 0,
        todayOfferings: todayOfferings ?? 0,
        todayGuestbook: todayGuestbook ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="p-6 space-y-10">
      {/* 제목 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">현황판</h1>
        <p className="text-sm text-gray-600">누적/오늘 현황과 봉사·기부 임팩트 영상</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">누적 헌화</div>
          <div className="text-2xl font-semibold">
            {loading ? '—' : count.offerings.toLocaleString()}
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">누적 방명록</div>
          <div className="text-2xl font-semibold">
            {loading ? '—' : count.guestbook.toLocaleString()}
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">오늘 헌화</div>
          <div className="text-2xl font-semibold">
            {loading ? '—' : count.todayOfferings.toLocaleString()}
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">오늘 방명록</div>
          <div className="text-2xl font-semibold">
            {loading ? '—' : count.todayGuestbook.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 임팩트(유튜브 링크 임베드) */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">임팩트 스토리(봉사·기부)</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {IMPACTS.map((it) => {
            const embed = toYouTubeEmbedSrc(it.url);
            return (
              <li key={it.id} className="space-y-2">
                <div className="relative w-full pt-[56.25%] rounded overflow-hidden bg-black">
                  {embed ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embed}
                      title={it.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center text-blue-200 underline"
                    >
                      영상 보기
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded border ${it.kind === 'donation' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {it.kind === 'donation' ? '기부 집행' : '봉사'}
                  </span>
                  <span className="text-gray-500">{it.date}</span>
                  {typeof it.amount === 'number' && it.amount > 0 && (
                    <span className="text-yellow-700">{it.amount.toLocaleString()}원</span>
                  )}
                </div>

                <div className="font-semibold">{it.title}</div>
                {it.desc && <div className="text-sm text-gray-600">{it.desc}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
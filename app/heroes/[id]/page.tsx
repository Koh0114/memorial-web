// app/heroes/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Hero = {
  id: string;
  name: string;
  birth: string | null;
  death: string | null;
  field: string | null;
  bio: string | null;
  achievements: string | null;
  impact: string | null;
  media_urls: string[] | null;
  photo_url?: string | null;
};

// 로컬 파일 매핑(원하는 인물만 추가)
// 파일은 public/images/heroes/ 아래에 넣고 경로는 /images/heroes/파일명 으로.
const localPhotos: Record<string, string> = {
  // 예시:
  // 'ahn-jung-geun': '/images/heroes/ahn.jpg',
  // 'yu-gwan-sun': '/images/heroes/yu.jpg',
  'Hong-beom-do' : '/images/heroes/Hong-Boem-Do.jpg',
  'Lee-duck-san' : '/images/heroes/Lee-Duck-San.jpg',
  'choi-kyu-ha' : '/images/heroes/Choi-Gyu-Ha.jpg',
  'son-ki-jung' : '/images/heroes/Son-Ki-Jung.jpg',
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setHero(data as Hero);
      setLoading(false);
    })();
  }, [id]);

  // 사진 우선순위: DB photo_url > 로컬 매핑 > media_urls 내 이미지 링크
  const imageFromMedia =
    hero?.media_urls?.find((u) => /\.(png|jpe?g|webp)$/i.test(u)) || null;
  const photo = (hero?.photo_url && hero.photo_url.trim()) ||
                (hero?.id && localPhotos[hero.id]) ||
                imageFromMedia ||
                null;

  if (loading) {
    return (
      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">불러오는 중…</h1>
      </section>
    );
  }

  if (!hero) {
    return (
      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">인물을 찾을 수 없어요.</h1>
        <Link href="/heroes" className="text-blue-600 underline mt-2 inline-block">
          ← 목록으로
        </Link>
      </section>
    );
  }

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-8">
      {/* 헤더(페이지 타이틀 영역) */}
      <header className="space-y-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl font-bold leading-tight">{hero.name}</h1>
          <div className="text-gray-500">
            {(hero.birth || '?')}{' '}
            <span aria-hidden>–</span>{' '}
            {(hero.death || '?')}
          </div>
        </div>
        <div className="text-sm text-gray-600">{hero.field || '분야 미상'}</div>
      </header>

      {/* 본문(좌) + 사이드(우) */}
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* 본문: 박스 없이 섹션만 */}
        <article className="space-y-8">
          {hero.bio && (
            <section id="bio" className="space-y-2">
              <h2 className="text-xl font-semibold">생애</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                {hero.bio}
              </p>
            </section>
          )}

          {hero.achievements && (
            <section id="achievements" className="space-y-2">
              <h2 className="text-xl font-semibold">업적</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                {hero.achievements}
              </p>
            </section>
          )}

          {hero.impact && (
            <section id="impact" className="space-y-2">
              <h2 className="text-xl font-semibold">영향</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                {hero.impact}
              </p>
            </section>
          )}

          {/* 자료(링크 목록) */}
          {hero.media_urls && hero.media_urls.length > 0 && (
            <section id="resources" className="space-y-2">
              <h2 className="text-xl font-semibold">자료</h2>
              <ul className="list-disc pl-5 space-y-1">
                {hero.media_urls.map((u, i) => (
                  <li key={i}>
                    <a
                      href={u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* 사이드: 사진 + 기본정보(박스 없이 깔끔) */}
        <aside className="space-y-4 lg:sticky lg:top-6 self-start">
          {photo && (
            <figure className="relative w-full aspect-[3/4] rounded overflow-hidden bg-black/5">
              <Image
                src={photo}
                alt={`${hero.name} 사진`}
                fill
                sizes="(min-width:1024px) 320px, 100vw"
                className="object-cover"
              />
            </figure>
          )}
          <div className="text-sm space-y-1">
            <div><span className="text-gray-500">이름</span> · {hero.name}</div>
            <div><span className="text-gray-500">출생</span> · {hero.birth || '?'}</div>
            <div><span className="text-gray-500">서거</span> · {hero.death || '?'}</div>
            <div><span className="text-gray-500">분야</span> · {hero.field || '미상'}</div>
          </div>
          <Link href="/heroes" className="text-blue-600 underline inline-block">
            ← 목록으로
          </Link>
        </aside>
      </div>
    </section>
  );
}
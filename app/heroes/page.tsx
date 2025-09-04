'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Hero = { id: string; name: string; field: string | null; birth: string | null; death: string | null; };

export default function Page() {
  const [items, setItems] = useState<Hero[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase.from('heroes').select('id,name,field,birth,death').order('name', { ascending: true })
      .then(({ data }) => setItems((data as Hero[]) || []));
  }, []);

  const filtered = items.filter(h => {
    const s = `${h.name} ${h.field ?? ''}`.toLowerCase();
    return s.includes(q.toLowerCase());
  });

  return (
    <section className="p-6 space-y-6">
      <div className="border rounded-lg p-4 space-y-3">
        <h1 className="text-2xl font-bold">안장자 소개</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름/분야 검색"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">목록</h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">검색 결과가 없어요.</p>
        ) : (
          <ul className="space-y-2">
            {filtered.map(h => (
              <li key={h.id} className="border rounded p-3">
                <div className="font-semibold">{h.name}</div>
                <div className="text-sm text-gray-500">{h.field || '분야 미상'} · {h.birth || '?'}–{h.death || '?'}</div>
                <div className="mt-2">
                  <Link href={`/heroes/${h.id}`} className="text-blue-600 underline">자세히 보기</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
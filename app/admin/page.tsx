'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type GB = {
  id: number;
  nickname: string;
  message: string;
  type: 'online'|'onsite'|'donor';
  section: string | null;
  created_at: string;
  reports: number | null;
  is_public: boolean | null;
};
type OF = {
  id: number;
  flower: 'chrysanthemum'|'white-lily'|'none';
  message: string;
  from_name: string | null;
  created_at: string;
  reports: number | null;
  is_public: boolean | null;
};

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

export default function Page() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  const [gb, setGb] = useState<GB[]>([]);
  const [of, setOf] = useState<OF[]>([]);

  const gate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASS) {
      setAuthed(true);
      setPw('');
    } else {
      alert('비밀번호가 맞지 않아.');
    }
  };

  const load = async () => {
    setLoading(true);

    const gbq = supabase
      .from('guestbook')
      .select('*')
      .or('reports.gte.1,is_public.eq.false')
      .order('reports', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100);

    const ofq = supabase
      .from('offerings')
      .select('*')
      .or('reports.gte.1,is_public.eq.false')
      .order('reports', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100);

    const [{ data: gbd }, { data: ofd }] = await Promise.all([gbq, ofq]);
    setGb((gbd as GB[]) || []);
    setOf((ofd as OF[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const hideGb = async (row: GB) => {
    await supabase.from('guestbook').update({ is_public: false }).eq('id', row.id);
    await load();
  };
  const showGb = async (row: GB) => {
    await supabase.from('guestbook').update({ is_public: true, reports: 0 }).eq('id', row.id);
    await load();
  };
  const delGb = async (row: GB) => {
    if (!confirm('정말 삭제할까? 되돌릴 수 없어.')) return;
    await supabase.from('guestbook').delete().eq('id', row.id);
    await load();
  };

  const hideOf = async (row: OF) => {
    await supabase.from('offerings').update({ is_public: false }).eq('id', row.id);
    await load();
  };
  const showOf = async (row: OF) => {
    await supabase.from('offerings').update({ is_public: true, reports: 0 }).eq('id', row.id);
    await load();
  };
  const delOf = async (row: OF) => {
    if (!confirm('정말 삭제할까? 되돌릴 수 없어.')) return;
    await supabase.from('offerings').delete().eq('id', row.id);
    await load();
  };

  const gbCount = useMemo(() => gb.length, [gb]);
  const ofCount = useMemo(() => of.length, [of]);

  if (!authed) {
    return (
      <section className="p-6 space-y-6">
        <div className="border rounded-lg p-4 space-y-3">
          <h1 className="text-2xl font-bold">관리자 로그인</h1>
          <form onSubmit={gate} className="space-y-3 max-w-sm">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full border rounded px-3 py-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">입장</button>
          </form>
          <p className="text-sm text-gray-500">
            임시 게이트야. 추후 Supabase Auth나 서버 보호로 바꾸자.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 space-y-6">
      {/* 요약 박스 */}
      <div className="border rounded-lg p-4 space-y-3">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        {loading ? (
          <p className="text-sm text-gray-500">불러오는 중…</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded p-3">
              <div className="text-sm text-gray-500">조치 대상(방명록)</div>
              <div className="text-2xl font-semibold">{gbCount.toLocaleString()}건</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-gray-500">조치 대상(헌화)</div>
              <div className="text-2xl font-semibold">{ofCount.toLocaleString()}건</div>
            </div>
          </div>
        )}
        <div>
          <button onClick={load} className="mt-2 border rounded px-3 py-1 text-sm">
            새로고침
          </button>
        </div>
      </div>

      {/* 방명록 조치 박스 */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">방명록(신고/비공개)</h2>
        {gb.length === 0 ? (
          <p className="text-sm text-gray-500">조치할 항목이 없어.</p>
        ) : (
          <ul className="space-y-2">
            {gb.map((it) => (
              <li key={it.id} className="border rounded p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">
                      {it.type} · {new Date(it.created_at).toLocaleString()}
                      {it.section ? ` · ${it.section}` : ''} · 신고 {it.reports ?? 0}회
                      {it.is_public === false ? ' · 비공개' : ''}
                    </div>
                    <div className="font-semibold">{it.nickname}</div>
                    <div className="whitespace-pre-wrap">{it.message}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {it.is_public ? (
                      <button className="border rounded px-2 py-1 text-xs" onClick={() => hideGb(it)}>
                        비공개
                      </button>
                    ) : (
                      <button className="border rounded px-2 py-1 text-xs" onClick={() => showGb(it)}>
                        공개
                      </button>
                    )}
                    <button
                      className="border rounded px-2 py-1 text-xs hover:bg-red-50"
                      onClick={() => delGb(it)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 헌화 조치 박스 */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">헌화(신고/비공개)</h2>
        {of.length === 0 ? (
          <p className="text-sm text-gray-500">조치할 항목이 없어.</p>
        ) : (
          <ul className="space-y-2">
            {of.map((it) => (
              <li key={it.id} className="border rounded p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">
                      {new Date(it.created_at).toLocaleString()} · 신고 {it.reports ?? 0}회
                      {it.is_public === false ? ' · 비공개' : ''}
                    </div>
                    <div className="font-semibold">{it.from_name || '익명'}</div>
                    <div className="whitespace-pre-wrap">{it.message}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {it.is_public ? (
                      <button className="border rounded px-2 py-1 text-xs" onClick={() => hideOf(it)}>
                        비공개
                      </button>
                    ) : (
                      <button className="border rounded px-2 py-1 text-xs" onClick={() => showOf(it)}>
                        공개
                      </button>
                    )}
                    <button
                      className="border rounded px-2 py-1 text-xs hover:bg-red-50"
                      onClick={() => delOf(it)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
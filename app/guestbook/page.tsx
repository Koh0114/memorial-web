'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Entry = {
  id: number;
  nickname: string;
  message: string;
  type: 'online' | 'onsite' | 'donor';
  section: string | null;
  created_at: string;
  reports: number | null;
  is_public: boolean | null;
};

export default function Page() {
  const [items, setItems] = useState<Entry[]>([]);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Entry['type']>('online');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);

  // 공개 글만 읽기
  const load = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      console.error('guestbook load error:', error.message);
      return;
    }
    setItems((data as Entry[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  // 신고: 3회 이상이면 비공개 처리
  const report = async (it: Entry) => {
    const nextReports = (it.reports ?? 0) + 1;
    const { error } = await supabase
      .from('guestbook')
      .update({
        reports: nextReports,
        is_public: nextReports >= 3 ? false : true,
      })
      .eq('id', it.id);

    if (error) {
      return alert('신고 실패: ' + error.message);
    }
    await load();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) {
      return alert('닉네임과 메시지를 입력해주세요.');
    }

    setLoading(true);
    const { error } = await supabase.from('guestbook').insert({
      nickname: nickname.trim().slice(0, 20),
      message: message.trim().slice(0, 500),
      type,
      section: section.trim() || null,
      // reports / is_public 은 테이블 기본값 사용
    });
    setLoading(false);

    if (error) return alert(`저장 실패: ${error.message}`);

    setNickname('');
    setMessage('');
    setSection('');
    await load();
    alert('방명록이 저장됐습니다.');
  };

  return (
    <section className="p-6 space-y-6">
      {/* 폼 박스 */}
      <div className="border rounded-lg p-4 space-y-3">
        <h1 className="text-2xl font-bold">방명록</h1>

        <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
          <div className="flex gap-2">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="flex-1 border rounded px-3 py-2"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Entry['type'])}
              className="border rounded px-3"
            >
              <option value="online">온라인</option>
              <option value="onsite">현장 방문</option>
              <option value="donor">기부 참여</option>
            </select>
          </div>

          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="묘역/섹션(선택)"
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="메시지"
            className="w-full border rounded px-3 py-2"
          />

          <button disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? '저장 중...' : '남기기'}
          </button>
        </form>
      </div>

      {/* 최근 방명록 박스 */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">최근 방명록</h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">아직 방명록이 없어요.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="border rounded p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">
                      {it.type} · {new Date(it.created_at).toLocaleString()}
                      {it.section ? ` · ${it.section}` : ''}
                    </div>
                    <div className="font-semibold">{it.nickname}</div>
                    <div className="whitespace-pre-wrap">{it.message}</div>
                  </div>

                  <button
                    className="text-xs border px-2 py-1 rounded hover:bg-gray-50"
                    onClick={() => report(it)}
                    title="신고 3회 이상이면 비공개 처리돼요"
                  >
                    신고 {it.reports ?? 0}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
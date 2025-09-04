// app/offering/page.tsx (정중앙 버전)
'use client';
import { useState } from 'react';

export default function Page() {
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState('');
  const [anon, setAnon] = useState(true);
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return alert('메시지를 입력해주세요.');
    setSubmitting(true);
    try {
      const res = await fetch('/api/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flower: 'chrysanthemum',
          is_paid: isPaid,
          amount: isPaid ? amount : 0,
          from_name: anon ? null : (name || null),
          is_anonymous: anon,
          message: msg.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) return alert('저장 실패: ' + (json?.message || `HTTP ${res.status}`));
      setMsg(''); if (isPaid) setAmount(0);
      alert('헌화 완료!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6 min-h-[80vh] grid place-items-center">
      <div className="w-full max-w-md text-center space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">온라인 헌화</h1>
          <p className="text-sm text-gray-600">무료=흰색/유료=금색.</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
            유료 헌화(금색)___
          </label>

          {isPaid && (
            <input
              type="number"
              min={1000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              placeholder="금액(원)"
              className="w-full border rounded px-3 py-2"
            />
          )}

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
            익명
          </label>

          {!anon && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full border rounded px-3 py-2"
            />
          )}

          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={3}
            placeholder="메시지"
            className="w-full border rounded px-3 py-2"
          />

          <button
            disabled={submitting}
            className="bg-gray-200 text-black px-5 py-3 rounded-lg border-2 border-black w-full hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {submitting ? '저장 중…' : '헌화하기'}
          </button>
        </form>
      </div>
    </section>
  );
}
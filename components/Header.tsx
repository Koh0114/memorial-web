// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = { href: string; label: string };

const nav: NavItem[] = [
  { href: '/offering', label: '헌화하기' },
  { href: '/transparency', label: '현황판' },
  { href: '/mosaic', label: '헌화 현충탑' },
  { href: '/guestbook', label: '방명록' },
  { href: '/heroes', label: '순국선열' },
  { href: '/etiquette', label: '예절' },
  { href: '/purpose', label: '의의' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const btnCTA =
    'bg-gray-200 text-black px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--surface,white)]/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        {/* 좌: 로고/브랜드 */}
        <Link href="/" className="font-bold tracking-tight">
          온라인 헌화
        </Link>

        {/* 중: 내비(데스크톱) */}
        <nav className="ml-6 hidden md:flex items-center gap-4 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? 'page' : undefined}
              className={[
                'px-2 py-1 rounded',
                isActive(n.href)
                  ? 'font-semibold underline underline-offset-4'
                  : 'text-gray-600 hover:text-black',
              ].join(' ')}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 우: 액션(헌화하기) */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <Link href="/offering" className={btnCTA}>
            헌화하기
          </Link>
        </div>

        {/* 모바일: 햄버거 */}
        <button
          className="ml-auto md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-gray-300"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* 모바일: 드롭다운 메뉴 */}
      {open && (
        <div className="md:hidden border-t bg-[var(--surface,white)]">
          <nav className="mx-auto max-w-6xl px-4 py-3 grid gap-2 text-sm">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(n.href) ? 'page' : undefined}
                className={[
                  'block px-2 py-2 rounded',
                  isActive(n.href)
                    ? 'font-semibold bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/offering"
              onClick={() => setOpen(false)}
              className={['mt-1', 'text-center', 'w-full', 'block', 'border-2', 'border-black', 'bg-gray-200', 'text-black', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-100'].join(' ')}
            >
              헌화하기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
// app/layout.tsx (교체용)
import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: '온라인 헌화',
  description: '언제 어디서든 환경 문제 없는 온라인 헌화',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false&libraries=services,clusterer`}
          strategy="afterInteractive"
        />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
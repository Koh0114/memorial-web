import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '온라인 헌화',
  description: '조화 없는 추모, 투명한 공개',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* 바탕/글자색을 전역으로 두고 싶으면 style로 지정해도 됨 */}
      <body>
        <Header />
        {/* 페이지마다 컨테이너(padding, max-w)를 이미 쓰고 있으니 main은 비워둠 */}
        <main>{children}</main>
      </body>
    </html>
  );

}
// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';


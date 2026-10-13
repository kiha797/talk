import './contacts.css';
import './navigation.css';
import './mail.css';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동원HUB · 동원약품그룹 업무 플랫폼",
  description: "동원의 모든 업무와 정보, 한곳에서. 주소록·메일·메신저·인사이트·전자결재·메디맵·HR",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

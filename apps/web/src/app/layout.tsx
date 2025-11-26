import type { Metadata } from "next";
import "../styles/globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "SoloKey — 個人音準室",
  description: "上傳 MP3、即時練唱、延遲校正與自動評分的個人音準室。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import Link from "next/link";
import { UploadWidget } from "../components/UploadWidget.js";
import { demoResult } from "../lib/demoData.js";

export default function HomePage() {
  const latest = demoResult;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="sk-card space-y-3">
          <p className="text-sm text-[var(--sk-color-text-muted)]">個人練唱進度</p>
          <p className="text-3xl font-semibold">歡迎回來，準備好開始練唱了嗎？</p>
          <p className="text-sm text-[var(--sk-color-text-muted)]">
            上傳 MP3 後，我們會先生成目標音準曲線，再引導你開啟麥克風雙曲線對照。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sing"
              className="rounded-full bg-[var(--sk-color-primary)] px-5 py-2 text-sm font-medium text-[var(--sk-color-text-main)]"
            >
              進入 Studio
            </Link>
            <Link
              href="/result/demo"
              className="rounded-full border border-[var(--sk-color-border)] px-5 py-2 text-sm text-[var(--sk-color-text-muted)]"
            >
              查看最新成績
            </Link>
          </div>
        </div>
        <div className="sk-card space-y-2">
          <p className="text-sm text-[var(--sk-color-text-muted)]">最新結果</p>
          <p className="text-4xl font-semibold text-[var(--sk-color-accent)]">{latest.total}</p>
          <p className="text-sm text-[var(--sk-color-text-muted)]">上次練唱時間 03:28 · 等級 A</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <UploadWidget />
        <div className="sk-card space-y-3">
          <p className="text-lg font-semibold">練唱建議</p>
          <ul className="space-y-3 text-sm text-[var(--sk-color-text-muted)]">
            <li>．先完成延遲校正，確保目標與麥克風曲線重疊。</li>
            <li>．段落練習時可設定迴圈，專注突破難點。</li>
            <li>．在 Results 頁面點擊段落，即可返回 Studio 指定位置。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

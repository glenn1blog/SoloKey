import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "儀表板" },
  { href: "/library", label: "歌曲庫" },
  { href: "/sing", label: "練唱室" },
  { href: "/result/demo", label: "練習結果" },
  { href: "/settings", label: "設定" }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--sk-color-bg)] text-[var(--sk-color-text-main)]">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-[var(--sk-color-border)] bg-[var(--sk-color-surface)] lg:flex">
        <div className="px-6 py-6 text-xl font-semibold">SoloKey</div>
        <nav className="flex-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2 text-sm text-[var(--sk-color-text-muted)] transition hover:bg-[var(--sk-color-surface-soft)] hover:text-[var(--sk-color-text-main)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-6 text-xs text-[var(--sk-color-text-muted)]">練唱專注模式</div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-[var(--sk-color-border)] bg-[var(--sk-color-surface)] px-6 py-4">
          <div>
            <p className="text-sm text-[var(--sk-color-text-muted)]">SoloKey · 個人音準室</p>
            <p className="text-xl font-semibold">音準訓練工作室</p>
          </div>
          <div className="rounded-full bg-[var(--sk-color-surface-soft)] px-4 py-2 text-sm">Beta</div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

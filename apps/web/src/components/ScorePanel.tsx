import type { TScoreSegment } from "@solokey/shared";

interface ScorePanelProps {
  total: number;
  segments: readonly TScoreSegment[];
}

export function ScorePanel({ total, segments }: ScorePanelProps) {
  return (
    <section className="sk-card space-y-4">
      <header>
        <p className="text-lg font-semibold">本次分數</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">依照 2 秒為單位計算音準穩定度</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--sk-color-surface-soft)] px-6 py-4">
          <p className="text-sm text-[var(--sk-color-text-muted)]">總分</p>
          <p className="text-4xl font-semibold">{total.toFixed(1)}</p>
        </div>
        <div className="rounded-2xl bg-[var(--sk-color-surface-soft)] px-6 py-4">
          <p className="text-sm text-[var(--sk-color-text-muted)]">穩定段落</p>
          <p className="text-4xl font-semibold">{segments.filter((seg) => seg.note === "穩定").length}</p>
        </div>
        <div className="rounded-2xl bg-[var(--sk-color-surface-soft)] px-6 py-4">
          <p className="text-sm text-[var(--sk-color-text-muted)]">需加強</p>
          <p className="text-4xl font-semibold">
            {segments.filter((seg) => seg.note === "稍高" || seg.note === "稍低").length}
          </p>
        </div>
      </div>
    </section>
  );
}

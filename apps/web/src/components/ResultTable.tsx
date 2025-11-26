import type { TScoreSegment } from "@solokey/shared";

interface ResultTableProps {
  segments: readonly TScoreSegment[];
}

export function ResultTable({ segments }: ResultTableProps) {
  return (
    <section className="sk-card">
      <header className="mb-4">
        <p className="text-lg font-semibold">分段詳細</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">點擊任一段可在 Studio 快速回放。</p>
      </header>
      <div className="overflow-hidden rounded-xl border border-[var(--sk-color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--sk-color-surface-soft)]">
            <tr>
              <th className="px-4 py-3 font-semibold">時間區間</th>
              <th className="px-4 py-3 font-semibold">分數</th>
              <th className="px-4 py-3 font-semibold">提示</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr
                key={`${segment.start}-${segment.end}`}
                className="cursor-pointer border-t border-[var(--sk-color-border)] transition hover:bg-[var(--sk-color-surface-soft)]"
              >
                <td className="px-4 py-3">
                  {segment.start.toFixed(1)}s ~ {segment.end.toFixed(1)}s
                </td>
                <td className="px-4 py-3 font-semibold">{segment.score.toFixed(1)}</td>
                <td className="px-4 py-3 text-[var(--sk-color-text-muted)]">{segment.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

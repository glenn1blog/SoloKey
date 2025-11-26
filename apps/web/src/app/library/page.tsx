export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <section className="sk-card space-y-3">
        <p className="text-lg font-semibold">歌曲庫</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">
          搜尋或上傳歌曲，標示語系與是否含目標音準曲線。
        </p>
      </section>
      <section className="sk-card">
        <p className="text-sm text-[var(--sk-color-text-muted)]">功能建置中，請先使用 Dashboard 與 Studio。</p>
      </section>
    </div>
  );
}

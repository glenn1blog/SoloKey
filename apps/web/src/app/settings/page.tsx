export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="sk-card space-y-3">
        <p className="text-lg font-semibold">帳號設定</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">調整暱稱、主題與語言偏好。</p>
      </section>
      <section className="sk-card space-y-3">
        <p className="text-lg font-semibold">裝置</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">設定預設麥克風與延遲校正結果。</p>
      </section>
    </div>
  );
}

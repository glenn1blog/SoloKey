import { demoActual, demoReference } from "@/lib/demoData";
import { PitchPlot } from "@/components/PitchPlot";
import { LatencyCalibrator } from "@/components/LatencyCalibrator";
import { Button } from "@/components/Button";
import { SingBootstrap } from "@/components/SingBootstrap";

export default function SingPage() {
  return (
    <div className="space-y-6">
      <SingBootstrap reference={demoReference} actual={demoActual} />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <PitchPlot reference={demoReference} actual={demoActual} />
        <div className="space-y-6">
          <LatencyCalibrator />
          <section className="sk-card space-y-4">
            <header>
              <p className="text-lg font-semibold">麥克風狀態</p>
              <p className="text-sm text-[var(--sk-color-text-muted)]">確保已授權瀏覽器存取。</p>
            </header>
            <div className="rounded-2xl bg-[var(--sk-color-surface-soft)] px-4 py-3 text-sm">
              裝置：RØDE NT-USB — 48kHz
            </div>
            <div className="flex gap-3">
              <Button size="lg">開始錄製</Button>
              <Button size="lg" variant="secondary">
                停止
              </Button>
            </div>
          </section>
        </div>
      </div>

      <section className="sk-card space-y-3">
        <p className="text-lg font-semibold">歌詞與提示</p>
        <div className="rounded-2xl border border-[var(--sk-color-border)] px-4 py-3 text-sm text-[var(--sk-color-text-muted)]">
          <p className="text-base text-[var(--sk-color-text-main)]">「向世界大聲唱出你的頻率」</p>
          <p>下一句：請保持氣息穩定，準備升到 G4。</p>
        </div>
      </section>
    </div>
  );
}

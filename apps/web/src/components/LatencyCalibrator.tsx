"use client";

import { useState } from "react";
import { Button } from "./Button";
import { useSoloKeyStore } from "@/hooks/useSoloKeyStore";

export function LatencyCalibrator() {
  const offsetMs = useSoloKeyStore((state) => state.offsetMs);
  const setOffset = useSoloKeyStore((state) => state.setOffset);
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");

  const handleAuto = async () => {
    setStatus("running");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setOffset(120);
    setStatus("done");
  };

  return (
    <section className="sk-card space-y-4">
      <header>
        <p className="text-lg font-semibold">延遲校正</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">先偵測系統延遲，再手動微調。</p>
      </header>

      <div className="flex items-center gap-3">
        <Button onClick={handleAuto} disabled={status === "running"}>
          {status === "running" ? "偵測中…" : "自動偵測"}
        </Button>
        <span className="text-sm text-[var(--sk-color-text-muted)]">目前 offset：{offsetMs} ms</span>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span>手動微調</span>
        <input
          type="range"
          min={-300}
          max={300}
          value={offsetMs}
          onChange={(event) => setOffset(Number(event.target.value))}
        />
        <div className="flex justify-between text-xs text-[var(--sk-color-text-muted)]">
          <span>-300ms</span>
          <span>0</span>
          <span>+300ms</span>
        </div>
      </label>
    </section>
  );
}

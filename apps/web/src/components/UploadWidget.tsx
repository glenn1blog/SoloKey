"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "./Button.js";
import { fetchReferenceSample, uploadAudio } from "../services/api.js";
import { useSoloKeyStore } from "../hooks/useSoloKeyStore.js";
import { demoActual, demoReference } from "../lib/demoData.js";

export function UploadWidget() {
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "done">("idle");
  const [message, setMessage] = useState<string>();
  const setReference = useSoloKeyStore((state) => state.setReference);
  const setActual = useSoloKeyStore((state) => state.setActual);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setStatus("uploading");
      setMessage("上傳中…");
      await uploadAudio(file);
      setReference(demoReference);
      setActual(demoActual);
      setStatus("done");
      setMessage("上傳完成，已載入示範音準曲線。");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("上傳失敗，請稍後再試。");
    }
  };

  const handleSample = async () => {
    setStatus("uploading");
    setMessage("載入範例中…");
    const sample = await fetchReferenceSample();
    setReference(sample.length ? sample : demoReference);
    setActual(demoActual);
    setStatus("done");
    setMessage("已載入 demo 曲線。");
  };

  return (
    <section className="sk-card space-y-4">
      <div>
        <p className="text-lg font-semibold">上傳 MP3 或載入範例</p>
        <p className="text-sm text-[var(--sk-color-text-muted)]">限制 50MB，支援 MP3 / WAV</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--sk-color-border)] px-6 py-10 text-center hover:border-[var(--sk-color-primary)]">
        <span className="text-base font-medium">拖放檔案或點擊選擇</span>
        <span className="text-sm text-[var(--sk-color-text-muted)]">目前僅示範流程，會自動載入 demo 曲線</span>
        <input type="file" className="hidden" accept="audio/*" onChange={handleFile} />
      </label>

      <div className="flex items-center gap-3">
        <Button onClick={handleSample}>快速載入 demo</Button>
        <Button variant="secondary">查看歷史練唱</Button>
      </div>

      {message && (
        <p
          className={`text-sm ${status === "error" ? "text-[var(--sk-color-danger)]" : "text-[var(--sk-color-text-muted)]"}`}
        >
          {message}
        </p>
      )}
    </section>
  );
}

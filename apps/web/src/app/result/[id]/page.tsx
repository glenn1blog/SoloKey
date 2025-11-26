import { notFound } from "next/navigation";
import { demoActual, demoReference, demoResult } from "@/lib/demoData";
import { ScorePanel } from "@/components/ScorePanel";
import { ResultTable } from "@/components/ResultTable";
import { PitchPlot } from "@/components/PitchPlot";

interface ResultPageProps {
  params?: { id?: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  const resultId = params?.id ?? "demo";
  if (!resultId) {
    notFound();
  }

  const result = demoResult;

  return (
    <div className="space-y-6">
      <ScorePanel total={result.total} segments={result.segments} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PitchPlot reference={demoReference} actual={demoActual} />
        <ResultTable segments={result.segments} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { demoActual, demoReference, demoResult } from "../../../lib/demoData.js";
import { ScorePanel } from "../../../components/ScorePanel.js";
import { ResultTable } from "../../../components/ResultTable.js";
import { PitchPlot } from "../../../components/PitchPlot.js";

interface ResultPageProps {
  params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  if (!params.id) {
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

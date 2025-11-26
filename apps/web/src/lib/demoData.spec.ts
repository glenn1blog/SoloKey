import { describe, expect, it } from "vitest";
import { demoActual, demoReference, demoResult } from "@/lib/demoData";

describe("demo data", () => {
  it("provides reference and actual frames", () => {
    expect(demoReference.length).toBeGreaterThan(0);
    expect(demoActual.length).toBeGreaterThan(0);
  });

  it("exposes a sample result", () => {
    expect(demoResult.total).toBeGreaterThan(0);
    expect(demoResult.segments.length).toBeGreaterThan(0);
  });
});

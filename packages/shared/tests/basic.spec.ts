import { describe, expect, it } from "vitest";
import { PitchFrame } from "../src/schemas.js";

describe("shared schemas", () => {
  it("defines PitchFrame schema", () => {
    expect(PitchFrame.properties).toMatchObject({
      t: { type: "number" },
      f0: { type: "number" }
    });
  });
});

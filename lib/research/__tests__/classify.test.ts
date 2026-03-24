import { describe, expect, it } from "vitest";
import { classifySystem, computeCoupling } from "../classify";

describe("computeCoupling", () => {
  it("returns bounded coupling in [0,1]", () => {
    const c = computeCoupling(0.5, 0.2, 0.3);
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThanOrEqual(1);
  });
});

describe("classifySystem", () => {
  it("classifies low stress as Type 1", () => {
    const r = classifySystem(0.1, 0.1, 0.05, 1);
    expect(r.systemType).toBe(1);
  });

  it("classifies high fragmentation and coupling as Type 4", () => {
    const r = classifySystem(0.9, 0.9, 0.2, 2);
    expect(r.systemType).toBe(4);
  });

  it("classifies corrupted band (Type 3)", () => {
    const r = classifySystem(0.65, 0.65, 0.1, 2);
    expect(r.systemType).toBe(3);
  });
});

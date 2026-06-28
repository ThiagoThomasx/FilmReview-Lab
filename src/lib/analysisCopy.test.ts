import { describe, test, expect } from "vitest";
import {
  getEditorialDiagnosis,
  getScoreStateLabel,
  getLibraryStatusPhrase,
  simpleHash,
} from "./analysisCopy";
import type { ReviewTemperature } from "../types";

describe("getEditorialDiagnosis", () => {
  const temperatures: ReviewTemperature[] = ["hot", "warm", "cool", "cold", "frozen"];

  test("returns a non-empty string for every temperature", () => {
    for (const temp of temperatures) {
      expect(getEditorialDiagnosis(temp).length).toBeGreaterThan(0);
    }
  });

  test("hot diagnosis mentions high temperature or publication", () => {
    const text = getEditorialDiagnosis("hot");
    expect(text.toLowerCase()).toMatch(/alta|publicação/);
  });

  test("frozen diagnosis mentions impression or synopsis", () => {
    const text = getEditorialDiagnosis("frozen");
    expect(text.toLowerCase()).toMatch(/impressão|sinopse/);
  });

  test("each temperature produces a distinct diagnosis", () => {
    const texts = temperatures.map(getEditorialDiagnosis);
    const unique = new Set(texts);
    expect(unique.size).toBe(temperatures.length);
  });
});

describe("getScoreStateLabel", () => {
  test("returns Forte for scores >= 70", () => {
    expect(getScoreStateLabel(70)).toBe("Forte");
    expect(getScoreStateLabel(100)).toBe("Forte");
    expect(getScoreStateLabel(85)).toBe("Forte");
  });

  test("returns Em desenvolvimento for scores 40-69", () => {
    expect(getScoreStateLabel(40)).toBe("Em desenvolvimento");
    expect(getScoreStateLabel(55)).toBe("Em desenvolvimento");
    expect(getScoreStateLabel(69)).toBe("Em desenvolvimento");
  });

  test("returns Frágil for scores < 40", () => {
    expect(getScoreStateLabel(0)).toBe("Frágil");
    expect(getScoreStateLabel(39)).toBe("Frágil");
    expect(getScoreStateLabel(20)).toBe("Frágil");
  });
});

describe("getLibraryStatusPhrase", () => {
  const temperatures: ReviewTemperature[] = ["hot", "warm", "cool", "cold", "frozen"];

  test("returns a non-empty string for every temperature", () => {
    for (const temp of temperatures) {
      expect(getLibraryStatusPhrase(temp).length).toBeGreaterThan(0);
    }
  });

  test("hot returns phrase containing 'quente'", () => {
    expect(getLibraryStatusPhrase("hot").toLowerCase()).toContain("quente");
  });

  test("each temperature produces a distinct phrase", () => {
    const phrases = temperatures.map(getLibraryStatusPhrase);
    const unique = new Set(phrases);
    expect(unique.size).toBe(temperatures.length);
  });
});

describe("simpleHash", () => {
  test("returns same hash for identical strings", () => {
    expect(simpleHash("Hello world")).toBe(simpleHash("Hello world"));
  });

  test("returns different hashes for different strings", () => {
    expect(simpleHash("abc")).not.toBe(simpleHash("xyz"));
  });

  test("trims text before hashing", () => {
    expect(simpleHash("  hello  ")).toBe(simpleHash("hello"));
  });

  test("returns a string", () => {
    expect(typeof simpleHash("test")).toBe("string");
  });

  test("empty string produces stable hash", () => {
    expect(simpleHash("")).toBe(simpleHash(""));
  });

  test("detects single character change", () => {
    expect(simpleHash("A film about war")).not.toBe(simpleHash("A film about was"));
  });

  test("compatible with reviews without stored hash — no crash on empty", () => {
    const hash = simpleHash("");
    expect(hash).toBeDefined();
  });
});

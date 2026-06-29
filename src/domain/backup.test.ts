import { describe, it, expect, beforeEach } from "vitest";
import {
  createBackup,
  serializeBackup,
  parseBackup,
  validateBackup,
  importBackup,
  type ReviewHeatBackup,
} from "./backup";
import { getReviews, clearReviews, createReview } from "./reviews";
import type { ReviewEntry } from "../types";

const MOVIE = {
  title: "Filme Teste",
  year: "2020",
};

function makeReview(): ReviewEntry {
  return createReview({ movie: MOVIE, text: "Texto de review para teste." });
}

describe("backup", () => {
  beforeEach(() => {
    clearReviews();
  });

  describe("createBackup", () => {
    it("cria backup com campo app correto", () => {
      const b = createBackup();
      expect(b.app).toBe("review-heat");
    });

    it("cria backup com version 1", () => {
      const b = createBackup();
      expect(b.version).toBe(1);
    });

    it("cria backup com exportedAt como string ISO", () => {
      const b = createBackup();
      expect(typeof b.exportedAt).toBe("string");
      expect(() => new Date(b.exportedAt)).not.toThrow();
    });

    it("cria backup com reviews do storage", () => {
      makeReview();
      const b = createBackup();
      expect(b.data.reviews).toHaveLength(1);
    });

    it("cria backup com lista vazia quando não há reviews", () => {
      const b = createBackup();
      expect(b.data.reviews).toHaveLength(0);
    });

    it("backup contém reviews com todos os campos esperados", () => {
      makeReview();
      const b = createBackup();
      const r = b.data.reviews[0];
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("movie");
      expect(r).toHaveProperty("text");
      expect(r).toHaveProperty("status");
    });
  });

  describe("serializeBackup", () => {
    it("serializa backup como string JSON válida", () => {
      const b = createBackup();
      const s = serializeBackup(b);
      expect(typeof s).toBe("string");
      expect(() => JSON.parse(s)).not.toThrow();
    });

    it("JSON serializado contém campo app", () => {
      const b = createBackup();
      const parsed = JSON.parse(serializeBackup(b));
      expect(parsed.app).toBe("review-heat");
    });
  });

  describe("parseBackup", () => {
    it("parseia JSON válido de backup", () => {
      const b = createBackup();
      const json = serializeBackup(b);
      const parsed = parseBackup(json);
      expect(parsed.app).toBe("review-heat");
      expect(parsed.version).toBe(1);
    });

    it("lança erro para JSON malformado", () => {
      expect(() => parseBackup("não é json")).toThrow("JSON malformado");
    });

    it("lança erro para JSON válido mas com formato inválido", () => {
      expect(() => parseBackup('{"app": "outro-app", "version": 1}')).toThrow(
        "formato não reconhecido",
      );
    });

    it("lança erro quando app está ausente", () => {
      expect(() =>
        parseBackup('{"version": 1, "exportedAt": "2025-01-01", "data": {"reviews": []}}'),
      ).toThrow();
    });

    it("lança erro quando version está ausente ou errada", () => {
      expect(() =>
        parseBackup(
          '{"app": "review-heat", "version": 2, "exportedAt": "2025-01-01", "data": {"reviews": []}}',
        ),
      ).toThrow();
    });
  });

  describe("validateBackup", () => {
    const validBackup: ReviewHeatBackup = {
      app: "review-heat",
      version: 1,
      exportedAt: "2025-01-01T00:00:00.000Z",
      data: { reviews: [] },
    };

    it("valida backup correto", () => {
      expect(validateBackup(validBackup)).toBe(true);
    });

    it("rejeita app incorreto", () => {
      expect(validateBackup({ ...validBackup, app: "outro-app" })).toBe(false);
    });

    it("rejeita version incorreta", () => {
      expect(validateBackup({ ...validBackup, version: 2 as unknown as 1 })).toBe(false);
    });

    it("rejeita quando exportedAt está ausente", () => {
      const { exportedAt: _, ...withoutDate } = validBackup;
      expect(validateBackup(withoutDate)).toBe(false);
    });

    it("rejeita quando reviews não é array", () => {
      expect(
        validateBackup({ ...validBackup, data: { reviews: null } }),
      ).toBe(false);
    });

    it("rejeita null", () => {
      expect(validateBackup(null)).toBe(false);
    });

    it("rejeita string", () => {
      expect(validateBackup("review-heat")).toBe(false);
    });

    it("aceita campos extras sem rejeitar", () => {
      const withExtras = {
        ...validBackup,
        extraField: "valor extra",
        data: { reviews: [], recentSearches: [], campoDesconhecido: true },
      };
      expect(validateBackup(withExtras)).toBe(true);
    });
  });

  describe("importBackup", () => {
    it("substitui reviews quando backup é válido", () => {
      makeReview();
      expect(getReviews()).toHaveLength(1);

      const backup: ReviewHeatBackup = {
        app: "review-heat",
        version: 1,
        exportedAt: "2025-01-01T00:00:00.000Z",
        data: {
          reviews: [
            {
              id: "imported-1",
              movie: { title: "Importado" },
              text: "Texto importado",
              status: "draft",
              tags: [],
              createdAt: "2025-01-01T00:00:00.000Z",
              updatedAt: "2025-01-01T00:00:00.000Z",
            },
            {
              id: "imported-2",
              movie: { title: "Outro Importado" },
              text: "Outro texto importado",
              status: "ready",
              tags: ["tag"],
              createdAt: "2025-01-02T00:00:00.000Z",
              updatedAt: "2025-01-02T00:00:00.000Z",
            },
          ],
        },
      };

      importBackup(backup);
      const reviews = getReviews();
      expect(reviews).toHaveLength(2);
      expect(reviews.map((r) => r.id)).toContain("imported-1");
      expect(reviews.map((r) => r.id)).toContain("imported-2");
    });

    it("substitui dados com lista vazia quando backup contém reviews vazia", () => {
      makeReview();
      const backup: ReviewHeatBackup = {
        app: "review-heat",
        version: 1,
        exportedAt: "2025-01-01T00:00:00.000Z",
        data: { reviews: [] },
      };
      importBackup(backup);
      expect(getReviews()).toHaveLength(0);
    });

    it("parseBackup+importBackup: não sobrescreve dados se JSON inválido", () => {
      makeReview();
      const before = getReviews();

      expect(() => parseBackup("json inválido")).toThrow();

      const after = getReviews();
      expect(after).toHaveLength(before.length);
    });

    it("parseBackup+importBackup: não sobrescreve dados se app incorreto", () => {
      makeReview();
      const before = getReviews();

      const badJson = JSON.stringify({
        app: "outro-app",
        version: 1,
        exportedAt: "2025-01-01T00:00:00.000Z",
        data: { reviews: [] },
      });
      expect(() => parseBackup(badJson)).toThrow();

      const after = getReviews();
      expect(after).toHaveLength(before.length);
    });
  });
});

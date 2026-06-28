import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  clearReviews,
  countWords,
} from "./reviews";

const mockMovie = {
  title: "Stalker",
  year: "1979",
  tmdbId: 275,
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("createReview", () => {
  it("cria review válida", () => {
    const r = createReview({ movie: mockMovie, text: "Obra singular." });
    expect(r.id).toBeTruthy();
    expect(r.movie.title).toBe("Stalker");
    expect(r.text).toBe("Obra singular.");
    expect(r.status).toBe("draft");
    expect(r.createdAt).toBeTruthy();
    expect(r.updatedAt).toBeTruthy();
  });

  it("não cria review sem texto", () => {
    expect(() => createReview({ movie: mockMovie, text: "" })).toThrow();
    expect(() => createReview({ movie: mockMovie, text: "   " })).toThrow();
  });

  it("normaliza tags — trim, sem vazias, sem duplicatas case-insensitive", () => {
    const r = createReview({
      movie: mockMovie,
      text: "Texto.",
      tags: ["  Tarkovsky  ", "tarkovsky", "", "Ficção", "ficção"],
    });
    expect(r.tags).toEqual(["Tarkovsky", "Ficção"]);
  });

  it("usa status draft por padrão", () => {
    const r = createReview({ movie: mockMovie, text: "x" });
    expect(r.status).toBe("draft");
  });

  it("aceita status customizado", () => {
    const r = createReview({ movie: mockMovie, text: "x", status: "idea" });
    expect(r.status).toBe("idea");
  });

  it("aceita campos opcionais", () => {
    const r = createReview({
      movie: mockMovie,
      text: "Texto.",
      title: "Minha crítica",
      personalRating: 9,
      letterboxdUrl: "https://letterboxd.com/user/film",
    });
    expect(r.title).toBe("Minha crítica");
    expect(r.personalRating).toBe(9);
    expect(r.letterboxdUrl).toBe("https://letterboxd.com/user/film");
  });
});

describe("getReviews", () => {
  it("retorna lista vazia quando storage está vazio", () => {
    expect(getReviews()).toEqual([]);
  });

  it("lista reviews existentes", () => {
    createReview({ movie: mockMovie, text: "A" });
    createReview({ movie: mockMovie, text: "B" });
    expect(getReviews()).toHaveLength(2);
  });

  it("ordena por updatedAt decrescente", () => {
    const a = createReview({ movie: mockMovie, text: "A" });
    const b = createReview({ movie: mockMovie, text: "B" });
    const list = getReviews();
    expect(list[0].id).toBe(b.id);
    expect(list[1].id).toBe(a.id);
  });
});

describe("getReviewById", () => {
  it("retorna review por id", () => {
    const r = createReview({ movie: mockMovie, text: "texto" });
    expect(getReviewById(r.id)?.id).toBe(r.id);
  });

  it("retorna undefined para id inexistente", () => {
    expect(getReviewById("nao-existe")).toBeUndefined();
  });
});

describe("updateReview", () => {
  it("atualiza review existente", () => {
    const r = createReview({ movie: mockMovie, text: "original" });
    const updated = updateReview(r.id, { text: "atualizado" });
    expect(updated?.text).toBe("atualizado");
  });

  it("mantém createdAt no update", () => {
    const r = createReview({ movie: mockMovie, text: "x" });
    const updated = updateReview(r.id, { text: "novo" });
    expect(updated?.createdAt).toBe(r.createdAt);
  });

  it("atualiza updatedAt no update", () => {
    const r = createReview({ movie: mockMovie, text: "x" });
    const before = r.updatedAt;
    // força diferença de timestamp
    vi.setSystemTime(new Date(Date.now() + 100));
    const updated = updateReview(r.id, { text: "novo" });
    expect(updated?.updatedAt).not.toBe(before);
  });

  it("normaliza tags no update", () => {
    const r = createReview({ movie: mockMovie, text: "x" });
    const updated = updateReview(r.id, { tags: ["Drama", "drama", "  "] });
    expect(updated?.tags).toEqual(["Drama"]);
  });

  it("retorna undefined para id inexistente", () => {
    expect(updateReview("fantasma", { text: "x" })).toBeUndefined();
  });
});

describe("deleteReview", () => {
  it("exclui review existente", () => {
    const r = createReview({ movie: mockMovie, text: "x" });
    expect(deleteReview(r.id)).toBe(true);
    expect(getReviewById(r.id)).toBeUndefined();
  });

  it("retorna false para id inexistente", () => {
    expect(deleteReview("fantasma")).toBe(false);
  });
});

describe("clearReviews", () => {
  it("limpa todas as reviews", () => {
    createReview({ movie: mockMovie, text: "A" });
    createReview({ movie: mockMovie, text: "B" });
    clearReviews();
    expect(getReviews()).toHaveLength(0);
  });
});

describe("countWords", () => {
  it("conta palavras corretamente", () => {
    expect(countWords("Um dois três")).toBe(3);
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("palavra")).toBe(1);
  });
});

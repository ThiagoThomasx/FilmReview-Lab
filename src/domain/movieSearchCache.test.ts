import { describe, it, expect, beforeEach } from "vitest";
import {
  saveSearch,
  loadSearchCache,
  clearSearchCache,
  getRecentQueries,
  findCachedSearch,
} from "./movieSearchCache";
import type { MovieInfo } from "../types";

const mockMovie: MovieInfo = {
  tmdbId: 497,
  title: "A Baleia",
  year: "2022",
  overview: "Um professor recluso...",
};

const mockMovie2: MovieInfo = {
  tmdbId: 872585,
  title: "Oppenheimer",
  year: "2023",
};

beforeEach(() => {
  localStorage.clear();
});

describe("loadSearchCache", () => {
  it("retorna array vazio quando não há cache", () => {
    expect(loadSearchCache()).toEqual([]);
  });
});

describe("saveSearch", () => {
  it("salva uma busca com query, resultados e timestamp", () => {
    saveSearch("baleia", [mockMovie]);
    const cache = loadSearchCache();
    expect(cache).toHaveLength(1);
    expect(cache[0].query).toBe("baleia");
    expect(cache[0].results).toEqual([mockMovie]);
    expect(cache[0].searchedAt).toBeTruthy();
  });

  it("não salva quando query está vazia", () => {
    saveSearch("", [mockMovie]);
    expect(loadSearchCache()).toHaveLength(0);
  });

  it("não salva quando query é só espaços", () => {
    saveSearch("   ", [mockMovie]);
    expect(loadSearchCache()).toHaveLength(0);
  });

  it("trimeia a query antes de salvar", () => {
    saveSearch("  baleia  ", [mockMovie]);
    expect(loadSearchCache()[0].query).toBe("baleia");
  });

  it("mantém a busca mais recente no topo", () => {
    saveSearch("baleia", [mockMovie]);
    saveSearch("oppenheimer", [mockMovie2]);
    const queries = getRecentQueries();
    expect(queries[0]).toBe("oppenheimer");
    expect(queries[1]).toBe("baleia");
  });

  it("evita duplicatas — move para o topo em vez de duplicar", () => {
    saveSearch("baleia", [mockMovie]);
    saveSearch("oppenheimer", [mockMovie2]);
    saveSearch("baleia", [mockMovie]); // repetição
    const cache = loadSearchCache();
    expect(cache).toHaveLength(2);
    expect(cache[0].query).toBe("baleia");
  });

  it("deduplicação é case-insensitive", () => {
    saveSearch("Baleia", [mockMovie]);
    saveSearch("BALEIA", [mockMovie]);
    expect(loadSearchCache()).toHaveLength(1);
  });

  it("limita a 8 entradas", () => {
    for (let i = 0; i < 10; i++) {
      saveSearch(`filme ${i}`, [mockMovie]);
    }
    expect(loadSearchCache()).toHaveLength(8);
  });

  it("ao atingir o limite mantém as buscas mais recentes", () => {
    for (let i = 0; i < 9; i++) {
      saveSearch(`filme ${i}`, []);
    }
    const queries = getRecentQueries();
    expect(queries[0]).toBe("filme 8");
    expect(queries).not.toContain("filme 0"); // a mais antiga foi removida
  });
});

describe("clearSearchCache", () => {
  it("remove todas as entradas", () => {
    saveSearch("baleia", [mockMovie]);
    saveSearch("oppenheimer", [mockMovie2]);
    clearSearchCache();
    expect(loadSearchCache()).toHaveLength(0);
  });
});

describe("getRecentQueries", () => {
  it("retorna apenas as queries como strings", () => {
    saveSearch("baleia", [mockMovie]);
    saveSearch("oppenheimer", [mockMovie2]);
    expect(getRecentQueries()).toEqual(["oppenheimer", "baleia"]);
  });

  it("retorna array vazio quando cache está vazio", () => {
    expect(getRecentQueries()).toEqual([]);
  });
});

describe("findCachedSearch", () => {
  it("encontra uma entrada pelo nome exato", () => {
    saveSearch("baleia", [mockMovie]);
    const entry = findCachedSearch("baleia");
    expect(entry).toBeDefined();
    expect(entry?.results).toEqual([mockMovie]);
  });

  it("encontra uma entrada case-insensitive", () => {
    saveSearch("baleia", [mockMovie]);
    expect(findCachedSearch("BALEIA")).toBeDefined();
    expect(findCachedSearch("Baleia")).toBeDefined();
  });

  it("retorna undefined quando query não está no cache", () => {
    expect(findCachedSearch("inexistente")).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
  clearStorage,
} from "./storage";

describe("storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("loadFromStorage", () => {
    it("returns fallback when key does not exist", () => {
      const result = loadFromStorage("missing-key", []);
      expect(result).toEqual([]);
    });

    it("returns parsed value when key exists", () => {
      localStorage.setItem("my-key", JSON.stringify({ name: "Mulholland Drive" }));
      const result = loadFromStorage("my-key", null);
      expect(result).toEqual({ name: "Mulholland Drive" });
    });

    it("returns fallback when stored value is invalid JSON", () => {
      localStorage.setItem("bad-json", "not { valid json");
      const result = loadFromStorage("bad-json", "default");
      expect(result).toBe("default");
    });

    it("returns fallback of correct type for arrays", () => {
      const result = loadFromStorage<string[]>("no-array", []);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it("returns stored number correctly", () => {
      localStorage.setItem("count", JSON.stringify(42));
      const result = loadFromStorage("count", 0);
      expect(result).toBe(42);
    });

    it("returns stored boolean correctly", () => {
      localStorage.setItem("flag", JSON.stringify(false));
      const result = loadFromStorage("flag", true);
      expect(result).toBe(false);
    });
  });

  describe("saveToStorage", () => {
    it("saves a value and returns true", () => {
      const success = saveToStorage("test-key", { id: "1" });
      expect(success).toBe(true);
      expect(localStorage.getItem("test-key")).toBe(JSON.stringify({ id: "1" }));
    });

    it("saves an array correctly", () => {
      const data = ["a", "b", "c"];
      saveToStorage("arr", data);
      expect(JSON.parse(localStorage.getItem("arr")!)).toEqual(data);
    });

    it("overwrites an existing value", () => {
      saveToStorage("key", "first");
      saveToStorage("key", "second");
      expect(loadFromStorage("key", "")).toBe("second");
    });

    it("returns false when localStorage throws", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });
      const result = saveToStorage("key", "value");
      expect(result).toBe(false);
    });
  });

  describe("removeFromStorage", () => {
    it("removes an existing key and returns true", () => {
      localStorage.setItem("to-remove", "yes");
      const result = removeFromStorage("to-remove");
      expect(result).toBe(true);
      expect(localStorage.getItem("to-remove")).toBeNull();
    });

    it("returns true even when key does not exist (no-op)", () => {
      const result = removeFromStorage("nonexistent");
      expect(result).toBe(true);
    });
  });

  describe("clearStorage", () => {
    it("removes all keys and returns true", () => {
      localStorage.setItem("a", "1");
      localStorage.setItem("b", "2");
      const result = clearStorage();
      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });
  });
});

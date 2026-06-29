import type { ReviewEntry } from "../types";
import type { SearchCacheEntry } from "./movieSearchCache";
import { getReviews, replaceReviews } from "./reviews";
import { loadSearchCache } from "./movieSearchCache";

export type ReviewHeatBackup = {
  app: "review-heat";
  version: 1;
  exportedAt: string;
  data: {
    reviews: ReviewEntry[];
    recentSearches?: SearchCacheEntry[];
  };
};

export function createBackup(): ReviewHeatBackup {
  return {
    app: "review-heat",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      reviews: getReviews(),
      recentSearches: loadSearchCache(),
    },
  };
}

export function serializeBackup(backup: ReviewHeatBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function parseBackup(json: string): ReviewHeatBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Backup inválido: JSON malformado.");
  }
  if (!validateBackup(parsed)) {
    throw new Error(
      "Backup inválido: formato não reconhecido. Verifique se o arquivo é um backup do Review Heat.",
    );
  }
  return parsed;
}

export function validateBackup(input: unknown): input is ReviewHeatBackup {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;

  if (obj["app"] !== "review-heat") return false;
  if (obj["version"] !== 1) return false;
  if (typeof obj["exportedAt"] !== "string") return false;

  const data = obj["data"];
  if (typeof data !== "object" || data === null) return false;
  const dataObj = data as Record<string, unknown>;

  if (!Array.isArray(dataObj["reviews"])) return false;

  return true;
}

export function importBackup(backup: ReviewHeatBackup): void {
  replaceReviews(backup.data.reviews);
}

export function downloadBackup(): void {
  const backup = createBackup();
  const json = serializeBackup(backup);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `review-heat-backup-${date}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

import type { ReviewTemperature } from "../types";

export function getEditorialDiagnosis(temperature: ReviewTemperature): string {
  switch (temperature) {
    case "hot":
      return "Esta crítica já opera em temperatura alta: há leitura formal, opinião sustentada e vocabulário específico o suficiente para publicação.";
    case "warm":
      return "Esta review tem boa base crítica, mas ainda pode ganhar calor com exemplos mais concretos e uma tese mais evidente.";
    case "cool":
      return "O texto está no meio do caminho: apresenta leitura válida, mas alterna análise com impressões ainda genéricas.";
    case "cold":
      return "A crítica ainda está fria: há reação ao filme, mas faltam sustentação, cena, forma e recorte argumentativo.";
    case "frozen":
      return "O texto ainda funciona mais como registro de impressão ou sinopse do que como crítica desenvolvida.";
  }
}

export function getScoreStateLabel(score: number): "Forte" | "Em desenvolvimento" | "Frágil" {
  if (score >= 70) return "Forte";
  if (score >= 40) return "Em desenvolvimento";
  return "Frágil";
}

export function getLibraryStatusPhrase(temperature: ReviewTemperature): string {
  switch (temperature) {
    case "hot":
      return "Parecer quente";
    case "warm":
      return "Parecer em desenvolvimento";
    case "cool":
      return "Requer atenção";
    case "cold":
      return "Precisa reescrita";
    case "frozen":
      return "Muito inicial";
  }
}

export function simpleHash(text: string): string {
  let hash = 5381;
  const str = text.trim();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash | 0;
  }
  return String(hash >>> 0);
}

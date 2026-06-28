import type { ReviewAnalysis, ReviewTemperature } from "../types";
import { TECHNICAL_TERMS } from "../data/technicalTerms";
import { VAGUE_TERMS } from "../data/vagueTerms";
import { ARGUMENT_TERMS } from "../data/argumentTerms";
import { CINEMA_ELEMENTS } from "../data/cinemaElements";

const MIN_WORDS_DEPTH = 80;
const MIN_WORDS_PUBLISHABLE = 120;
const IDEAL_SENTENCE_LENGTH = 25;
const MAX_SENTENCE_LENGTH = 60;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sáàâãéèêíìîóòôõúùûüçñ-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function getSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function findMatchingTerms(tokens: string[], termList: string[]): string[] {
  const text = tokens.join(" ");
  return termList.filter((term) => {
    const termLower = term.toLowerCase();
    return (
      text.includes(termLower) ||
      tokens.some((t) => t === termLower)
    );
  });
}

function scoreDepth(wordCount: number, sentences: string[], allTerms: string[]): number {
  let score = 0;

  if (wordCount >= MIN_WORDS_DEPTH) score += 30;
  else if (wordCount >= 40) score += 15;
  else if (wordCount >= 20) score += 5;

  const themeTerms = ["tema", "subtexto", "proposta", "narrativa", "estrutura", "dramaturgia", "alegoria", "metáfora", "simbolismo", "universo"];
  const themeMatches = allTerms.filter((t) => themeTerms.some((th) => t.includes(th)));
  score += Math.min(themeMatches.length * 8, 40);

  if (sentences.length >= 5) score += 15;
  else if (sentences.length >= 3) score += 8;

  const avgWords = sentences.length > 0 ? wordCount / sentences.length : 0;
  if (avgWords >= 10 && avgWords <= 35) score += 15;

  return Math.min(score, 100);
}

function scoreSpecificity(foundTechnical: string[], foundCinema: string[], wordCount: number): number {
  let score = 0;
  const specificTerms = foundTechnical.length + foundCinema.length;

  score += Math.min(specificTerms * 7, 60);

  if (wordCount > 0) {
    const density = specificTerms / (wordCount / 10);
    if (density >= 1) score += 25;
    else if (density >= 0.5) score += 15;
    else if (density >= 0.2) score += 8;
  }

  if (specificTerms >= 6) score += 15;
  else if (specificTerms >= 3) score += 8;

  return Math.min(score, 100);
}

function scoreArgument(foundArgument: string[], sentences: string[]): number {
  let score = 0;
  score += Math.min(foundArgument.length * 10, 60);

  if (sentences.length >= 3) score += 20;

  const hasCausality = foundArgument.some((t) =>
    ["porque", "pois", "portanto", "logo", "por isso", "por conseguinte"].includes(t)
  );
  if (hasCausality) score += 10;

  const hasContrast = foundArgument.some((t) =>
    ["entretanto", "no entanto", "contudo", "todavia", "por outro lado", "em contrapartida", "ao contrário"].includes(t)
  );
  if (hasContrast) score += 10;

  return Math.min(score, 100);
}

function scoreStyle(text: string, wordCount: number, sentences: string[]): number {
  let score = 0;

  if (wordCount < 5) return 0;

  const words = tokenize(text);
  const uniqueWords = new Set(words.filter((w) => w.length > 3));
  const variety = uniqueWords.size / Math.max(words.length, 1);
  if (variety >= 0.7) score += 35;
  else if (variety >= 0.5) score += 20;
  else if (variety >= 0.3) score += 10;

  if (sentences.length > 0) {
    const lengths = sentences.map((s) => s.split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const longSentences = lengths.filter((l) => l > MAX_SENTENCE_LENGTH).length;
    const proportion = longSentences / lengths.length;

    if (avg <= IDEAL_SENTENCE_LENGTH && proportion < 0.2) score += 35;
    else if (avg <= 40 && proportion < 0.4) score += 20;
    else score += 5;

    const hasMix = lengths.some((l) => l <= 8) && lengths.some((l) => l >= 15);
    if (hasMix) score += 15;
  }

  if (wordCount >= 50) score += 15;

  return Math.min(score, 100);
}

function scoreTechnical(foundTechnical: string[]): number {
  let score = 0;
  score += Math.min(foundTechnical.length * 12, 80);
  if (foundTechnical.length >= 5) score += 20;
  return Math.min(score, 100);
}

function scorePublishability(
  wordCount: number,
  depthScore: number,
  specificityScore: number,
  argumentScore: number,
  styleScore: number,
  foundVague: string[],
): number {
  let score = 0;

  if (wordCount >= MIN_WORDS_PUBLISHABLE) score += 25;
  else if (wordCount >= MIN_WORDS_DEPTH) score += 15;
  else if (wordCount >= 40) score += 5;

  const avgCore = (depthScore + specificityScore + argumentScore + styleScore) / 4;
  score += Math.round(avgCore * 0.5);

  const vagueRatio = foundVague.length / Math.max(wordCount / 10, 1);
  if (vagueRatio < 0.3) score += 25;
  else if (vagueRatio < 0.8) score += 12;

  return Math.min(score, 100);
}

function calcOverall(scores: number[]): number {
  const weights = [0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
  const weighted = scores.reduce((acc, s, i) => acc + s * weights[i], 0);
  return Math.round(Math.min(weighted, 100));
}

function getTemperature(score: number): ReviewTemperature {
  if (score >= 90) return "hot";
  if (score >= 70) return "warm";
  if (score >= 50) return "cool";
  if (score >= 30) return "cold";
  return "frozen";
}

function buildStrengths(
  depthScore: number,
  specificityScore: number,
  argumentScore: number,
  styleScore: number,
  technicalScore: number,
  foundTechnical: string[],
  foundArgument: string[],
): string[] {
  const strengths: string[] = [];

  if (technicalScore >= 50)
    strengths.push("A crítica usa vocabulário cinematográfico com precisão.");
  if (foundTechnical.length >= 5)
    strengths.push("Há referência a múltiplos elementos formais do filme.");
  if (argumentScore >= 60)
    strengths.push("O texto apresenta boa sustentação argumentativa.");
  if (foundArgument.length >= 3)
    strengths.push("Há conectores que constroem relações de causa e contraste.");
  if (depthScore >= 60)
    strengths.push("A crítica vai além da sinopse e toca aspectos temáticos ou narrativos.");
  if (specificityScore >= 60)
    strengths.push("O texto cita elementos concretos do filme.");
  if (styleScore >= 60)
    strengths.push("A prosa é clara, variada e tem boa fluidez.");
  if (depthScore >= 80)
    strengths.push("O desenvolvimento é substancial para uma crítica publicável.");

  return strengths;
}

function buildWeaknesses(
  depthScore: number,
  specificityScore: number,
  argumentScore: number,
  styleScore: number,
  wordCount: number,
  foundVague: string[],
): string[] {
  const weaknesses: string[] = [];

  if (wordCount < MIN_WORDS_DEPTH)
    weaknesses.push("O texto é curto para uma crítica com profundidade.");
  if (foundVague.length >= 3)
    weaknesses.push("A crítica depende de impressões genéricas e adjetivos vagos.");
  if (specificityScore < 40)
    weaknesses.push("Faltam exemplos concretos de cenas ou escolhas formais.");
  if (argumentScore < 40)
    weaknesses.push("O texto apresenta opiniões sem justificativa clara.");
  if (styleScore < 40)
    weaknesses.push("A prosa tem frases longas demais ou vocabulário repetitivo.");
  if (depthScore < 40)
    weaknesses.push("A crítica parece ainda superficial — fica na reação imediata.");

  return weaknesses;
}

function buildSuggestions(
  depthScore: number,
  specificityScore: number,
  argumentScore: number,
  styleScore: number,
  wordCount: number,
  foundVague: string[],
): string[] {
  const suggestions: string[] = [];

  if (wordCount < MIN_WORDS_PUBLISHABLE)
    suggestions.push("Desenvolva mais o texto — uma crítica publicável tem ao menos 120 palavras.");
  if (specificityScore < 50)
    suggestions.push("Cite uma cena específica para sustentar sua leitura do filme.");
  if (argumentScore < 50)
    suggestions.push("Adicione uma frase-tese que deixe clara sua posição sobre o filme.");
  if (foundVague.length >= 3)
    suggestions.push("Substitua adjetivos genéricos por observações mais precisas sobre o que você viu.");
  if (depthScore < 50)
    suggestions.push("Explore o que o filme propõe além da história — tema, forma, impacto.");
  if (styleScore < 50)
    suggestions.push("Quebre frases longas para dar mais ritmo e clareza ao texto.");
  if (depthScore >= 50 && specificityScore < 60)
    suggestions.push("Explique como a direção ou a fotografia constroem a atmosfera que você menciona.");
  if (argumentScore >= 50 && depthScore < 60)
    suggestions.push("Use os conectores argumentativos para aprofundar a análise dos elementos que cita.");

  return suggestions;
}

export function analyzeReview(text: string): ReviewAnalysis {
  const trimmed = text.trim();
  const wordCount = countWords(trimmed);

  if (!trimmed || wordCount === 0) {
    return {
      overallScore: 0,
      temperature: "frozen",
      depthScore: 0,
      specificityScore: 0,
      argumentScore: 0,
      styleScore: 0,
      technicalScore: 0,
      publishabilityScore: 0,
      wordCount: 0,
      strengths: [],
      weaknesses: ["O texto está vazio. Escreva uma crítica para analisar."],
      suggestions: ["Comece escrevendo ao menos uma frase sobre o que você sentiu ou observou no filme."],
      detectedTerms: [],
      vagueTerms: [],
    };
  }

  const tokens = tokenize(trimmed);
  const sentences = getSentences(trimmed);

  const foundTechnical = findMatchingTerms(tokens, TECHNICAL_TERMS);
  const foundVague = findMatchingTerms(tokens, VAGUE_TERMS);
  const foundArgument = findMatchingTerms(tokens, ARGUMENT_TERMS);
  const foundCinema = findMatchingTerms(tokens, CINEMA_ELEMENTS);

  const allTerms = [...foundTechnical, ...foundCinema];

  const depthScore = scoreDepth(wordCount, sentences, allTerms);
  const specificityScore = scoreSpecificity(foundTechnical, foundCinema, wordCount);
  const argumentScore = scoreArgument(foundArgument, sentences);
  const styleScore = scoreStyle(trimmed, wordCount, sentences);
  const technicalScore = scoreTechnical(foundTechnical);
  const publishabilityScore = scorePublishability(
    wordCount,
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    foundVague,
  );

  const overallScore = calcOverall([
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    technicalScore,
    publishabilityScore,
  ]);

  const temperature = getTemperature(overallScore);

  const strengths = buildStrengths(
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    technicalScore,
    foundTechnical,
    foundArgument,
  );
  const weaknesses = buildWeaknesses(
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    wordCount,
    foundVague,
  );
  const suggestions = buildSuggestions(
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    wordCount,
    foundVague,
  );

  const uniqueTechnical = [...new Set([...foundTechnical, ...foundCinema])];

  return {
    overallScore,
    temperature,
    depthScore,
    specificityScore,
    argumentScore,
    styleScore,
    technicalScore,
    publishabilityScore,
    wordCount,
    strengths,
    weaknesses,
    suggestions,
    detectedTerms: uniqueTechnical,
    vagueTerms: foundVague,
  };
}

export const TEMPERATURE_LABELS: Record<string, string> = {
  hot: "QUENTE",
  warm: "MORNA",
  cool: "FRESCA",
  cold: "FRIA",
  frozen: "CONGELADA",
};

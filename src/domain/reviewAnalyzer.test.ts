import { describe, it, expect } from "vitest";
import { analyzeReview, TEMPERATURE_LABELS } from "./reviewAnalyzer";

const EMPTY_TEXT = "";
const VERY_SHORT = "Gostei muito.";
const VAGUE_TEXT =
  "O filme foi muito bom. Legal demais. Muito interessante e bonito. Incrível mesmo. Gostei bastante. Muito bacana.";
const TECHNICAL_TEXT =
  "A fotografia de Néstor Almendros usa o enquadramento e a iluminação natural para construir uma atmosfera de tensão singular. " +
  "A montagem respeita o ritmo interno das cenas, enquanto a trilha reforça o subtexto emocional do roteiro. " +
  "A direção de arte e o som ambiente criam uma mise-en-scène densa, onde cada plano dialoga com o tema central do filme.";
const ARGUMENT_TEXT =
  "O filme é desconcertante porque a câmera recusa qualquer explicação fácil. Portanto, o espectador é forçado a habitar a incerteza. " +
  "Por outro lado, essa escolha formal enfraquece o arco dramático. Entretanto, a performance do elenco ainda assim sustenta a narrativa. " +
  "A tensão entre ambiguidade e clareza revela o problema central da proposta do diretor.";
const DEEP_TEXT =
  "Stalker propõe uma meditação sobre a fé e o desejo que transcende o gênero da ficção científica. " +
  "A estrutura narrativa decompõe o tempo de forma quase ritualística, recusando qualquer aceleração dramática convencional. " +
  "A fotografia oscila entre o sépia do mundo externo e o verde da Zona, construindo uma divisão simbólica entre o cotidiano e o sagrado. " +
  "A mise-en-scène de Tarkovsky é minuciosamente calculada: cada plano é uma tese sobre a possibilidade do transcendente no cinema. " +
  "O roteiro evita respostas para sustentar o peso existencial das perguntas. Isso reforça a força do filme como obra filosófica. " +
  "A trilha de Eduard Artemyev dissolve os limites entre o diegético e o extradiegético, criando uma atmosfera única. " +
  "A atuação de Alexander Kaidanovsky é austera porque o personagem precisa ser ao mesmo tempo real e alegórico. " +
  "Portanto, Stalker é um dos filmes mais rigorosos da história do cinema, não apesar de sua lentidão, mas por causa dela.";

describe("analyzeReview — texto vazio", () => {
  it("retorna score zero e temperatura congelada", () => {
    const result = analyzeReview(EMPTY_TEXT);
    expect(result.overallScore).toBe(0);
    expect(result.temperature).toBe("frozen");
    expect(result.wordCount).toBe(0);
  });

  it("retorna fraqueza explicativa", () => {
    const result = analyzeReview(EMPTY_TEXT);
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });

  it("não retorna pontos fortes", () => {
    const result = analyzeReview(EMPTY_TEXT);
    expect(result.strengths).toHaveLength(0);
  });
});

describe("analyzeReview — texto muito curto", () => {
  it("retorna score baixo", () => {
    const result = analyzeReview(VERY_SHORT);
    expect(result.overallScore).toBeLessThan(40);
  });

  it("retorna temperatura fria ou congelada", () => {
    const result = analyzeReview(VERY_SHORT);
    expect(["cold", "frozen"]).toContain(result.temperature);
  });
});

describe("analyzeReview — texto vago", () => {
  it("detecta termos vagos", () => {
    const result = analyzeReview(VAGUE_TEXT);
    expect(result.vagueTerms.length).toBeGreaterThan(0);
  });

  it("score baixo de publicabilidade", () => {
    const result = analyzeReview(VAGUE_TEXT);
    expect(result.publishabilityScore).toBeLessThan(60);
  });
});

describe("analyzeReview — texto com termos técnicos", () => {
  it("detecta termos técnicos", () => {
    const result = analyzeReview(TECHNICAL_TEXT);
    expect(result.detectedTerms.length).toBeGreaterThan(3);
  });

  it("retorna score técnico elevado", () => {
    const result = analyzeReview(TECHNICAL_TEXT);
    expect(result.technicalScore).toBeGreaterThan(50);
  });

  it("retorna especificidade elevada", () => {
    const result = analyzeReview(TECHNICAL_TEXT);
    expect(result.specificityScore).toBeGreaterThan(40);
  });
});

describe("analyzeReview — texto argumentativo", () => {
  it("retorna score de argumento elevado", () => {
    const result = analyzeReview(ARGUMENT_TEXT);
    expect(result.argumentScore).toBeGreaterThan(50);
  });
});

describe("analyzeReview — texto profundo", () => {
  it("retorna temperatura quente ou morna", () => {
    const result = analyzeReview(DEEP_TEXT);
    expect(["hot", "warm"]).toContain(result.temperature);
  });

  it("retorna score geral elevado", () => {
    const result = analyzeReview(DEEP_TEXT);
    expect(result.overallScore).toBeGreaterThan(60);
  });

  it("retorna pontos fortes", () => {
    const result = analyzeReview(DEEP_TEXT);
    expect(result.strengths.length).toBeGreaterThan(0);
  });
});

describe("analyzeReview — invariantes", () => {
  const cases = [EMPTY_TEXT, VERY_SHORT, VAGUE_TEXT, TECHNICAL_TEXT, ARGUMENT_TEXT, DEEP_TEXT];

  it("todos os scores ficam entre 0 e 100", () => {
    for (const text of cases) {
      const r = analyzeReview(text);
      const scores = [
        r.overallScore,
        r.depthScore,
        r.specificityScore,
        r.argumentScore,
        r.styleScore,
        r.technicalScore,
        r.publishabilityScore,
      ];
      for (const s of scores) {
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(100);
      }
    }
  });

  it("wordCount é calculado corretamente", () => {
    expect(analyzeReview(EMPTY_TEXT).wordCount).toBe(0);
    expect(analyzeReview(VERY_SHORT).wordCount).toBe(2);
    const deep = analyzeReview(DEEP_TEXT);
    expect(deep.wordCount).toBeGreaterThan(100);
  });

  it("análise é determinística para o mesmo texto", () => {
    const r1 = analyzeReview(TECHNICAL_TEXT);
    const r2 = analyzeReview(TECHNICAL_TEXT);
    expect(r1.overallScore).toBe(r2.overallScore);
    expect(r1.temperature).toBe(r2.temperature);
    expect(r1.detectedTerms).toEqual(r2.detectedTerms);
  });

  it("texto profundo tem score maior que texto curto", () => {
    const deep = analyzeReview(DEEP_TEXT);
    const short = analyzeReview(VERY_SHORT);
    expect(deep.overallScore).toBeGreaterThan(short.overallScore);
  });

  it("sugestões aparecem quando há problemas", () => {
    const result = analyzeReview(VERY_SHORT);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("pontos fortes aparecem quando há qualidades", () => {
    const result = analyzeReview(DEEP_TEXT);
    expect(result.strengths.length).toBeGreaterThan(0);
  });
});

describe("TEMPERATURE_LABELS", () => {
  it("mapeia todas as temperaturas para rótulos em português", () => {
    expect(TEMPERATURE_LABELS["hot"]).toBe("QUENTE");
    expect(TEMPERATURE_LABELS["warm"]).toBe("MORNA");
    expect(TEMPERATURE_LABELS["cool"]).toBe("FRESCA");
    expect(TEMPERATURE_LABELS["cold"]).toBe("FRIA");
    expect(TEMPERATURE_LABELS["frozen"]).toBe("CONGELADA");
  });
});

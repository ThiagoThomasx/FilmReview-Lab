import type { ReviewEntry } from "../types";
import { analyzeReview } from "../domain/reviewAnalyzer";
import { simpleHash } from "../lib/analysisCopy";

const DEMO_BASE_DATE = "2025-01-01T00:00:00.000Z";

function makeDate(offsetDays: number): string {
  const d = new Date(DEMO_BASE_DATE);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

const JEANNE_TEXT = `Jeanne Dielman é um dos filmes mais rigorosos e perturbadores da história do cinema. Chantal Akerman filma o cotidiano doméstico de uma viúva belga com uma atenção quase científica: cada tarefa repetida em tempo real, cada silêncio carregado de tensão acumulada. A câmera nunca se move por vaidade — ela observa, registra, recusa o espetáculo. O resultado é um retrato devastador da opressão estrutural camuflada como rotina. A interpretação de Delphine Seyrig é de uma economia absoluta; ela não precisa de gestos dramáticos porque a própria estrutura do filme é a performance. A decisão de filmar em planos fixos e longos não é experimentalismo gratuito — é a única forma honesta de mostrar como o tempo sufoca. Um dos raros filmes que muda o modo como você vê o mundo depois que as luzes se acendem.`;

const STALKER_TEXT = `Tarkovsky constrói o tempo de uma forma que poucos diretores sequer tentaram. Em Stalker, a Zona não é apenas um espaço físico — é uma exteriorização do estado interior de quem a atravessa. O plano-sequência do túnel é um dos momentos mais hipnóticos do cinema: câmera lenta, sons industriais sobrepostos, a sensação de que o próprio filme respira. A filosofia que permeia o roteiro de Strugatsky é densa mas nunca pedante; as conversas entre os três personagens revelam visões de mundo incompatíveis sem que nenhuma delas saia como vencedora. O desfecho é deliberadamente ambíguo de um modo que não frustra — ele pertence a essa ambiguidade. Minha única resistência é ao ritmo das últimas cenas, que por vezes parecem testar a paciência além do necessário. Mas talvez essa resistência seja exatamente o ponto.`;

const PARASITE_TEXT = `Parasita é um thriller de classe social eficiente e bem construído, mas saí do cinema com a sensação de que havia algo calculado demais em sua estrutura. Bong Joon-ho é um cineasta habilidoso — a mise-en-scène da casa Parks é exemplar, cada detalhe do cenário carregado de significado. Mas a virada do segundo ato parece apostar demais no choque e sacrifica alguma coisa da sutileza anterior. Os personagens da família Kim são vívidos, porém os Parks permanecem deliberadamente vazios de um modo que achei redutivo. A crítica ao capitalismo é certeira mas não muito mais sofisticada do que o que Bong já havia feito em Snowpiercer. Ainda assim, o roteiro é impecável no nível da mecânica e o filme sustenta a tensão de ponta a ponta.`;

const JEANNE_ANALYSIS = analyzeReview(JEANNE_TEXT);
const STALKER_ANALYSIS = analyzeReview(STALKER_TEXT);

const DEMO_REVIEWS: ReviewEntry[] = [
  {
    id: "demo-001",
    movie: {
      tmdbId: 16084,
      title: "Jeanne Dielman, 23, quai du Commerce, 1080 Bruxelles",
      originalTitle: "Jeanne Dielman, 23 Quai du Commerce, 1080 Bruxelles",
      year: "1975",
      genres: ["Drama"],
    },
    title: "O tempo como instrumento de opressão",
    text: JEANNE_TEXT,
    personalRating: 10,
    status: "published",
    tags: ["feminismo", "tempo real", "vanguarda", "akerman"],
    analysis: JEANNE_ANALYSIS,
    analysisTextHash: simpleHash(JEANNE_TEXT),
    createdAt: makeDate(0),
    updatedAt: makeDate(2),
    publishedAt: makeDate(2),
  },
  {
    id: "demo-002",
    movie: {
      tmdbId: 275,
      title: "Stalker",
      originalTitle: "Сталкер",
      year: "1979",
      genres: ["Drama", "Ficção científica"],
    },
    title: "A Zona e o peso da crença",
    text: STALKER_TEXT,
    personalRating: 9,
    status: "ready",
    tags: ["tarkovsky", "filosofia", "tempo", "soviético"],
    analysis: STALKER_ANALYSIS,
    analysisTextHash: simpleHash(STALKER_TEXT),
    createdAt: makeDate(5),
    updatedAt: makeDate(7),
  },
  {
    id: "demo-003",
    movie: {
      tmdbId: 496243,
      title: "Parasita",
      originalTitle: "기생충",
      year: "2019",
      genres: ["Thriller", "Drama", "Comédia"],
    },
    title: "Mecânica precisa, sutileza sacrificada",
    text: PARASITE_TEXT,
    personalRating: 8,
    status: "needs_revision",
    tags: ["bong joon-ho", "classe social", "thriller", "palme d'or"],
    createdAt: makeDate(10),
    updatedAt: makeDate(11),
  },
  {
    id: "demo-004",
    movie: {
      tmdbId: 807,
      title: "Se7en",
      originalTitle: "Se7en",
      year: "1995",
      genres: ["Crime", "Thriller"],
    },
    text: "Fincher no auge da sua obsessão com a podridão urbana. A fotografia de Darius Khondji cria um mundo onde a chuva nunca para e nenhuma superfície parece limpa. O roteiro de Andrew Kevin Walker é uma máquina de tensão crescente com um terceiro ato que ainda causa impacto três décadas depois. Brad Pitt e Morgan Freeman têm química de parceiros que nunca precisam se gostar de verdade para funcionar.",
    personalRating: 9,
    status: "analyzed",
    tags: ["fincher", "neo-noir", "serial killer"],
    analysis: analyzeReview(
      "Fincher no auge da sua obsessão com a podridão urbana. A fotografia de Darius Khondji cria um mundo onde a chuva nunca para e nenhuma superfície parece limpa. O roteiro de Andrew Kevin Walker é uma máquina de tensão crescente com um terceiro ato que ainda causa impacto três décadas depois. Brad Pitt e Morgan Freeman têm química de parceiros que nunca precisam se gostar de verdade para funcionar.",
    ),
    analysisTextHash: simpleHash(
      "Fincher no auge da sua obsessão com a podridão urbana. A fotografia de Darius Khondji cria um mundo onde a chuva nunca para e nenhuma superfície parece limpa. O roteiro de Andrew Kevin Walker é uma máquina de tensão crescente com um terceiro ato que ainda causa impacto três décadas depois. Brad Pitt e Morgan Freeman têm química de parceiros que nunca precisam se gostar de verdade para funcionar.",
    ),
    createdAt: makeDate(14),
    updatedAt: makeDate(15),
  },
  {
    id: "demo-005",
    movie: {
      tmdbId: 637,
      title: "O Leopardo",
      originalTitle: "Il Gattopardo",
      year: "1963",
      genres: ["Drama", "História"],
    },
    text: "Visconti e a melancolia da aristocracia em declínio.",
    status: "draft",
    tags: ["visconti", "itália", "aristocracia"],
    createdAt: makeDate(18),
    updatedAt: makeDate(18),
  },
  {
    id: "demo-006",
    movie: {
      tmdbId: 289,
      title: "Casablanca",
      originalTitle: "Casablanca",
      year: "1942",
      genres: ["Romance", "Drama", "Guerra"],
    },
    text: "Existe algo quase milagroso em como Casablanca funciona tão bem sendo tão deliberadamente construído para funcionar bem. Curtiz sabia exatamente o que estava fazendo.",
    status: "idea",
    tags: ["clássico hollywood", "guerra", "romance"],
    createdAt: makeDate(20),
    updatedAt: makeDate(20),
  },
  {
    id: "demo-007",
    movie: {
      tmdbId: 77338,
      title: "O Artista",
      originalTitle: "The Artist",
      year: "2011",
      genres: ["Romance", "Comédia", "Drama"],
    },
    text: "Uma homenagem competente ao cinema mudo que nunca consegue transcender o exercício de estilo. Dujardin é magnético, Hazanavicius é cuidadoso, mas o filme permanece na superfície do que celebra. Ganhar o Oscar foi uma escolha segura da Academia.",
    personalRating: 6,
    status: "archived",
    tags: ["oscar", "cinema mudo", "homenagem", "france"],
    createdAt: makeDate(3),
    updatedAt: makeDate(22),
  },
];

export function getDemoReviews(): ReviewEntry[] {
  return DEMO_REVIEWS;
}

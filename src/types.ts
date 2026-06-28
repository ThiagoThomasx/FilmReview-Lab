export type ReviewTemperature = "hot" | "warm" | "cool" | "cold" | "frozen";

export type ReviewStatus =
  | "idea"
  | "draft"
  | "analyzed"
  | "needs_revision"
  | "ready"
  | "published"
  | "archived";

export type MovieInfo = {
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  year?: string;
  releaseDate?: string;
  posterPath?: string;
  backdropPath?: string;
  overview?: string;
  genres?: string[];
  voteAverage?: number;
};

export type ReviewAnalysis = {
  overallScore: number;
  temperature: ReviewTemperature;
  depthScore: number;
  specificityScore: number;
  argumentScore: number;
  styleScore: number;
  technicalScore: number;
  publishabilityScore: number;
  wordCount: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detectedTerms: string[];
  vagueTerms: string[];
};

export type ReviewEntry = {
  id: string;
  movie: MovieInfo;
  title?: string;
  text: string;
  personalRating?: number;
  status: ReviewStatus;
  tags: string[];
  analysis?: ReviewAnalysis;
  letterboxdUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

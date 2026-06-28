import type { MovieInfo } from "../types";
import { MovieResultItem } from "./MovieResultItem";

type SearchStatus = "idle" | "loading" | "error" | "success" | "no-api-key";

type Props = {
  status: SearchStatus;
  results: MovieInfo[];
  errorMessage: string;
  onSelect: (movie: MovieInfo) => void;
};

export function MovieResultList({ status, results, errorMessage, onSelect }: Props) {
  if (status === "idle") {
    return (
      <div style={{ paddingTop: "var(--spacing-32)" }}>
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-pebble)",
          }}
        >
          Digite o título de um filme para começar.
        </p>
      </div>
    );
  }

  if (status === "no-api-key") {
    return (
      <div
        style={{
          paddingTop: "var(--spacing-32)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-12)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-sepia)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          Chave TMDb não configurada
        </span>
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            lineHeight: 1.6,
            color: "var(--color-ash)",
          }}
        >
          Crie um arquivo <code>.env.local</code> na raiz do projeto com:
          <br />
          <code>VITE_TMDB_API_KEY=sua_chave_aqui</code>
          <br />
          Obtenha sua chave gratuitamente em{" "}
          <strong>themoviedb.org/settings/api</strong>.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div style={{ paddingTop: "var(--spacing-32)" }}>
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-pebble)",
          }}
        >
          Consultando arquivo...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ paddingTop: "var(--spacing-32)" }}>
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-sepia)",
          }}
        >
          {errorMessage || "Erro ao buscar filmes. Tente novamente."}
        </p>
      </div>
    );
  }

  if (status === "success" && results.length === 0) {
    return (
      <div style={{ paddingTop: "var(--spacing-32)" }}>
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-pebble)",
          }}
        >
          Nenhum filme encontrado para essa busca.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "var(--spacing-16)" }}>
      <div
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: "var(--color-ash)",
          paddingBottom: "var(--spacing-12)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
      </div>
      <div>
        {results.map((movie) => (
          <MovieResultItem
            key={movie.tmdbId ?? movie.title}
            movie={movie}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

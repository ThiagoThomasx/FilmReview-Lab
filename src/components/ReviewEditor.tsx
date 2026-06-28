import { useState, useEffect, useCallback, useRef } from "react";
import type { ReviewEntry, ReviewStatus, MovieInfo, ReviewAnalysis } from "../types";
import {
  createReview,
  updateReview,
  countWords,
  STATUS_LABELS,
  ALL_STATUSES,
} from "../domain/reviews";
import { analyzeReview } from "../domain/reviewAnalyzer";
import { simpleHash } from "../lib/analysisCopy";
import { TagInput } from "./TagInput";
import { ReviewAnalysisPanel } from "./ReviewAnalysisPanel";

type Props = {
  movie: MovieInfo | null;
  existingReview?: ReviewEntry;
  onSaved: (review: ReviewEntry) => void;
};

type SaveState = "idle" | "saving" | "saved" | "error";
type AnalysisState = "idle" | "analyzing" | "done";

export function ReviewEditor({ movie, existingReview, onSaved }: Props) {
  const [text, setText] = useState(existingReview?.text ?? "");
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [personalRating, setPersonalRating] = useState(
    existingReview?.personalRating?.toString() ?? "",
  );
  const [status, setStatus] = useState<ReviewStatus>(
    existingReview?.status ?? "draft",
  );
  const [tags, setTags] = useState<string[]>(existingReview?.tags ?? []);
  const [letterboxdUrl, setLetterboxdUrl] = useState(
    existingReview?.letterboxdUrl ?? "",
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [validationError, setValidationError] = useState("");
  const [analysis, setAnalysis] = useState<ReviewAnalysis | undefined>(
    existingReview?.analysis,
  );
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const analysedTextRef = useRef<string>(existingReview?.text ?? "");

  useEffect(() => {
    if (existingReview) {
      setText(existingReview.text);
      setTitle(existingReview.title ?? "");
      setPersonalRating(existingReview.personalRating?.toString() ?? "");
      setStatus(existingReview.status);
      setTags(existingReview.tags);
      setLetterboxdUrl(existingReview.letterboxdUrl ?? "");
      setAnalysis(existingReview.analysis);
      analysedTextRef.current = existingReview.text;
    }
  }, [existingReview?.id]);

  const words = countWords(text);

  const storedHash = existingReview?.analysisTextHash;
  const isStale =
    analysis !== undefined &&
    (storedHash !== undefined
      ? simpleHash(text) !== storedHash
      : text.trim() !== analysedTextRef.current.trim());

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) {
      setValidationError("Escreva o texto da review antes de analisar.");
      return;
    }
    setValidationError("");
    setAnalysisState("analyzing");

    const result = analyzeReview(text);
    const hash = simpleHash(text);
    setAnalysis(result);
    analysedTextRef.current = text;
    setAnalysisState("done");

    if (existingReview) {
      updateReview(existingReview.id, { analysis: result, analysisTextHash: hash });
    }
  }, [text, existingReview]);

  const handleSave = useCallback(() => {
    if (!movie) return;
    if (!text.trim()) {
      setValidationError("O texto da review não pode estar vazio.");
      return;
    }
    setValidationError("");
    setSaveState("saving");

    try {
      const ratingNum = personalRating.trim()
        ? parseFloat(personalRating)
        : undefined;

      let saved: ReviewEntry;
      if (existingReview) {
        const updated = updateReview(existingReview.id, {
          text,
          title: title || undefined,
          personalRating: ratingNum,
          status,
          tags,
          letterboxdUrl: letterboxdUrl || undefined,
          analysis: analysis ?? existingReview.analysis,
        });
        if (!updated) throw new Error("Review não encontrada.");
        saved = updated;
      } else {
        saved = createReview({
          movie,
          text,
          title: title || undefined,
          personalRating: ratingNum,
          status,
          tags,
          letterboxdUrl: letterboxdUrl || undefined,
        });
        if (analysis) {
          const withAnalysis = updateReview(saved.id, {
            analysis,
            analysisTextHash: simpleHash(text),
          });
          if (withAnalysis) saved = withAnalysis;
        }
      }

      setSaveState("saved");
      onSaved(saved);
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar.";
      setValidationError(msg);
      setSaveState("error");
    }
  }, [movie, text, title, personalRating, status, tags, letterboxdUrl, analysis, existingReview, onSaved]);

  if (!movie) {
    return (
      <div
        style={{
          border: "1px dashed var(--color-midstone)",
          borderRadius: "var(--radius-cards)",
          padding: "var(--spacing-64)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-louize-display)",
            fontSize: "var(--text-heading-sm)",
            fontWeight: "var(--font-weight-regular)",
            color: "var(--color-pebble)",
            lineHeight: "var(--leading-heading-sm)",
          }}
        >
          Selecione um filme acima
          <br />
          para começar a escrever.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
      {/* Título da review */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        <label style={labelStyle}>Título da crítica <span style={{ color: "var(--color-midstone)" }}>(opcional)</span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: O peso do silêncio em Stalker"
          style={inputStyle}
        />
      </div>

      {/* Corpo da review */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <label style={labelStyle}>Texto da crítica</label>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-midstone)",
            }}
          >
            {words} {words === 1 ? "palavra" : "palavras"}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua crítica aqui…"
          rows={14}
          style={{
            ...inputStyle,
            resize: "vertical",
            lineHeight: "var(--leading-body)",
            fontFamily: "var(--font-louize)",
            fontSize: "var(--text-body)",
          }}
        />
        {validationError && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-ash)",
            }}
          >
            {validationError}
          </span>
        )}
      </div>

      {/* Status e nota */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-16)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
          <label style={labelStyle}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReviewStatus)}
            style={inputStyle}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
          <label style={labelStyle}>Nota pessoal <span style={{ color: "var(--color-midstone)" }}>(0–10, opcional)</span></label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={personalRating}
            onChange={(e) => setPersonalRating(e.target.value)}
            placeholder="Ex.: 8.5"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        <label style={labelStyle}>Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Letterboxd */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        <label style={labelStyle}>Link Letterboxd <span style={{ color: "var(--color-midstone)" }}>(opcional)</span></label>
        <input
          type="url"
          value={letterboxdUrl}
          onChange={(e) => setLetterboxdUrl(e.target.value)}
          placeholder="https://letterboxd.com/…"
          style={inputStyle}
        />
      </div>

      {/* Ações */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-16)", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving"}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            border: "1px solid var(--color-headline-ink)",
            borderRadius: "var(--radius-buttons)",
            padding: "12px 32px",
            background: "var(--color-headline-ink)",
            color: "var(--color-paper)",
            cursor: saveState === "saving" ? "wait" : "pointer",
            opacity: saveState === "saving" ? 0.6 : 1,
          }}
        >
          {existingReview ? "Atualizar crítica" : "Salvar crítica"}
        </button>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analysisState === "analyzing"}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            border: "1px solid var(--color-headline-ink)",
            borderRadius: "var(--radius-buttons)",
            padding: "12px 32px",
            background: "transparent",
            color: "var(--color-headline-ink)",
            cursor: analysisState === "analyzing" ? "wait" : "pointer",
            opacity: analysisState === "analyzing" ? 0.6 : 1,
          }}
        >
          {analysisState === "analyzing" ? "Analisando…" : "Analisar crítica"}
        </button>

        {saveState === "saved" && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              color: "var(--color-ash)",
            }}
          >
            ✓ Salvo
          </span>
        )}
        {saveState === "error" && !validationError && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-ash)",
            }}
          >
            Erro ao salvar.
          </span>
        )}
      </div>

      {/* Painel de análise */}
      {analysis && (
        <ReviewAnalysisPanel analysis={analysis} isStale={isStale} />
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  color: "var(--color-ash)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-cards)",
  padding: "12px 16px",
  background: "transparent",
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-body)",
  color: "var(--color-headline-ink)",
  outline: "none",
};

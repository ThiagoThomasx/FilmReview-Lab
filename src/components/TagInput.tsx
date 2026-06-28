import { useState, type KeyboardEvent } from "react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const exists = tags.some((t) => t.toLowerCase() === lower);
    if (!exists) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--spacing-8)",
        alignItems: "center",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-cards)",
        padding: "var(--spacing-12) var(--spacing-16)",
        background: "transparent",
        minHeight: "48px",
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--spacing-4)",
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            border: "1px solid var(--color-midstone)",
            borderRadius: "var(--radius-tags)",
            padding: "2px 10px",
            color: "var(--color-ash)",
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            aria-label={`Remover tag ${tag}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-midstone)",
              padding: "0 0 0 2px",
              lineHeight: 1,
              fontSize: "14px",
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? "Adicione tags (Enter ou vírgula)" : ""}
        style={{
          flex: 1,
          minWidth: "140px",
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-body)",
          color: "var(--color-headline-ink)",
        }}
      />
    </div>
  );
}

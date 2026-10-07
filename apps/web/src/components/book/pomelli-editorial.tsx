"use client";

import { useMemo } from "react";
import { Quote } from "lucide-react";
import "./pomelli-editorial.css";

export interface PomelliEditorialProps {
  title: string;
  date: string;
  person: string;
  caption: string;
  chapterNumber: number;
  totalChapters?: number;
  mode?: "classic" | "pomelli-twocolumn" | "argon-telemetry";
  className?: string;
}

export function PomelliEditorial({
  title,
  date,
  person,
  caption,
  chapterNumber,
  totalChapters = 3,
  mode = "pomelli-twocolumn",
  className = "",
}: PomelliEditorialProps) {
  // Extract first letter for the sculpted Pomelli Roman drop cap
  const { dropCap, restText } = useMemo(() => {
    const clean = caption.trim();
    if (!clean) return { dropCap: "W", restText: "e were here. And that was everything." };
    const first = clean.charAt(0);
    const rest = clean.slice(1);
    return { dropCap: first, restText: rest };
  }, [caption]);

  const romanNumeral = useMemo(() => {
    const nums = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return nums[chapterNumber - 1] || String(chapterNumber);
  }, [chapterNumber]);

  return (
    <article className={`pomelli-editorial-root mode-${mode} ${className}`} aria-label={`Editorial spread for chapter ${chapterNumber}`}>
      {/* Pomelli Folio Header */}
      <div className="pomelli-folio-header">
        <div className="pomelli-folio-left">
          <span className="pomelli-folio-brand">M E M O R A</span>
          <span className="pomelli-folio-divider">·</span>
          <span className="pomelli-folio-edition">VOL. 01 — SUMMER SOLSTICE</span>
        </div>
        <div className="pomelli-folio-right">
          <span className="pomelli-folio-cap">CAP. {romanNumeral}</span>
          <span className="pomelli-folio-divider">/</span>
          <span className="pomelli-folio-total">{totalChapters}</span>
        </div>
      </div>

      {/* Main Chapter Title & Kicker */}
      <header className="pomelli-article-header">
        <div className="pomelli-kicker-row">
          <span className="pomelli-kicker-dot" />
          <time dateTime="2026-06-14" className="pomelli-date-tag">
            {date}
          </time>
          <span className="pomelli-with-tag">
            WITH <strong>{person.toUpperCase()}</strong>
          </span>
        </div>
        <h2 className="pomelli-headline">{title}</h2>
        <div className="pomelli-title-flourish" aria-hidden="true">
          <span className="flourish-line" />
          <span className="flourish-symbol">❧</span>
          <span className="flourish-line" />
        </div>
      </header>

      {/* Pomelli Two-Column Fine-Art Layout */}
      {mode === "pomelli-twocolumn" ? (
        <div className="pomelli-twocolumn-body">
          {/* Column 1: Poetic Prose with Sculpted Drop-Cap */}
          <div className="pomelli-col pomelli-col-prose">
            <p className="pomelli-prose-paragraph">
              <span className="pomelli-dropcap" aria-hidden="true">
                {dropCap}
              </span>
              <span className="pomelli-rest-text">{restText}</span>
            </p>
            <div className="pomelli-colophon-mark">
              <span className="colophon-author">Recorded with {person}</span>
              <span className="colophon-location">Archival Keepsake Registry · Edition 1 of 1</span>
            </div>
          </div>

          {/* Column 2: Italian Fine-Art Pull Quote & Gilded Note */}
          <div className="pomelli-col pomelli-col-pullquote">
            <div className="pomelli-pullquote-card">
              <Quote size={20} className="pomelli-quote-icon" aria-hidden="true" />
              <blockquote className="pomelli-quote-text">
                “Some afternoons refuse to fade into yesterday.”
              </blockquote>
              <cite className="pomelli-quote-cite">— From the Summer Journal</cite>
            </div>

            {/* Stitch Design System & Archival Proof Tokens */}
            <div className="pomelli-stitch-tokens">
              <div className="stitch-token-row">
                <span className="token-label">TYPOGRAPHY</span>
                <span className="token-val">Cormorant 64 / Newsreader 18</span>
              </div>
              <div className="stitch-token-row">
                <span className="token-label">GRID PROPORTION</span>
                <span className="token-val">Golden Ratio ϕ (1.618)</span>
              </div>
              <div className="stitch-token-row">
                <span className="token-label">PRINT GAMUT</span>
                <span className="token-val">Mohawk 140gsm Eggshell</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Classic Single Column View */
        <div className="pomelli-classic-body">
          <p className="pomelli-prose-paragraph">
            <span className="pomelli-dropcap" aria-hidden="true">
              {dropCap}
            </span>
            <span className="pomelli-rest-text">{restText}</span>
          </p>
        </div>
      )}
    </article>
  );
}

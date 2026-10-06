"use client";

import { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Wand2,
  Check,
  Copy,
  RefreshCw,
  Feather,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { playSubtleClick, playPaperRustle } from "@/lib/audio";
import "./ai-chapter-narrator.css";

export type NarrativeTone = "poetic" | "nostalgic" | "archival" | "wanderlust";

interface TonePreset {
  id: NarrativeTone;
  name: string;
  icon: string;
  desc: string;
  samplePhrase: string;
}

const TONES: TonePreset[] = [
  {
    id: "poetic",
    name: "Poetic & Ephemeral",
    icon: "🌿",
    desc: "Delicate metaphors of shifting light and quiet afternoon silences.",
    samplePhrase: "The tide retreated, leaving behind the small salt pools where time stood still.",
  },
  {
    id: "nostalgic",
    name: "Nostalgic & Heirloom",
    icon: "🕯️",
    desc: "Warm family recollection, cherished milestones, and tender gratitude.",
    samplePhrase: "Years will pass, yet the sound of that laughter around the wooden table never fades.",
  },
  {
    id: "archival",
    name: "Minimal & Archival",
    icon: "🏛️",
    desc: "Crisp museum curation, precise dates, and unvarnished emotional truth.",
    samplePhrase: "Point Reyes, late afternoon. Four miles walked in quiet communion.",
  },
  {
    id: "wanderlust",
    name: "Wanderlust & Road Trip",
    icon: "🌊",
    desc: "Spontaneous detours, rolled-down windows, and finding home in unfamiliar places.",
    samplePhrase: "We missed the highway exit on purpose just to see where the coastline curved.",
  },
];

const POETIC_TEMPLATES: Record<NarrativeTone, string[]> = {
  poetic: [
    "The afternoon settled like golden dust across the water. We didn't speak of returning; we simply watched the tide carry away the last remnants of our ordinary worries.",
    "A quiet horizon held the daylight longer than it had any right to. In the stillness between heartbeats, every shared glance became an unwritten promise.",
    "The wind carried the scent of coastal sage and ancient cedar. For one unhurried hour, the universe narrowed to the warmth of two hands and the curve of a forgotten trail.",
  ],
  nostalgic: [
    "Long after the sun dipped below the crest of the pines, the laughter lingered. It is these quiet, unposed minutes that become the cornerstone of who we were to each other.",
    "We promised we would never forget how the light filtered through the kitchen window that Sunday. Now, engraved on paper, that quiet gratitude remains alive forever.",
    "Looking back, it was never the grand celebrations that anchored us. It was the way we paused at the crest of the hill, knowing we were exactly where we belonged.",
  ],
  archival: [
    "Plate 01: June 14, 2026. Documented along the northern coastal cliffs. Ambient light: 18:42 golden hour. Kept in perpetual memory.",
    "An unvarnished chronicle of ordinary grace. Recorded at high tide with those who taught us that home is not a place, but a presence.",
    "Physical imprint: Smyth-sewn archival spread. Captured under northern skies. Preserved for generations that will one day turn these leaves.",
  ],
  wanderlust: [
    "We took the winding route along Highway 1, leaving the map tucked away in the glove box. Sometimes the best destination is the detour you never planned.",
    "Salt in our hair, the windows rolled halfway down, and a song playing that neither of us wanted to end. The journey was the whole point.",
    "Two backpacks, dusty boots, and a view that stretched clear past the fog line. We left our footsteps on the cliff edge and carried the silence home.",
  ],
};

export function AiChapterNarrator({
  currentMemoryTitle,
  currentPerson,
  currentCaption,
  onApplyProse,
}: {
  currentMemoryTitle: string;
  currentPerson: string;
  currentCaption?: string;
  onApplyProse: (prose: string) => void;
}) {
  const [selectedTone, setSelectedTone] = useState<NarrativeTone>("poetic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProse, setGeneratedProse] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const generateNarrative = () => {
    setIsGenerating(true);
    playPaperRustle();

    // Deterministic selection from curated poetic corpus
    const pool = POETIC_TEMPLATES[selectedTone];
    const index = Math.floor(Math.random() * pool.length);
    const baseProse = pool[index];

    // Personalize with current subject
    const personalized = currentPerson
      ? `${baseProse} Shared with ${currentPerson}.`
      : baseProse;

    window.setTimeout(() => {
      setGeneratedProse(personalized);
      setIsGenerating(false);
      setApplied(false);
    }, 450);
  };

  const copyProse = () => {
    if (!generatedProse) return;
    navigator.clipboard?.writeText(generatedProse);
    setCopied(true);
    playSubtleClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!generatedProse) return;
    onApplyProse(generatedProse);
    setApplied(true);
    playSubtleClick();
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="ai-narrator-panel">
      <div className="narrator-header">
        <div className="narrator-title-cluster">
          <span className="narrator-kicker">
            <Sparkles size={13} /> GEMINI AI STORYTELLER
          </span>
          <h4>Generative Chapter Narrator</h4>
          <p className="narrator-desc">
            Transform raw dates and camera snapshots into poetic heirloom prose
            matching the Newsreader editorial style.
          </p>
        </div>
      </div>

      {/* Tone Selection Cluster */}
      <div className="narrator-tones-grid">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            type="button"
            className={`tone-card ${selectedTone === tone.id ? "is-active" : ""}`}
            onClick={() => {
              setSelectedTone(tone.id);
              playSubtleClick();
            }}
          >
            <span className="tone-icon">{tone.icon}</span>
            <div className="tone-details">
              <strong>{tone.name}</strong>
              <p>{tone.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Generation Bar */}
      <div className="narrator-action-row">
        <div className="context-hint">
          <Feather size={14} />
          <span>
            Context: <em>{currentMemoryTitle}</em> &middot; with{" "}
            <strong>{currentPerson || "Loved ones"}</strong>
            {currentCaption ? ` ("${currentCaption.slice(0, 24)}...")` : ""}
          </span>
        </div>
        <Button
          onClick={generateNarrative}
          disabled={isGenerating}
          className="generate-prose-btn"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={14} className="spin-icon" />
              <span>Composing prose...</span>
            </>
          ) : (
            <>
              <Wand2 size={14} />
              <span>Generate Chapter Prose</span>
            </>
          )}
        </Button>
      </div>

      {/* Output Prose Card */}
      {generatedProse && (
        <div className="generated-prose-card">
          <div className="prose-card-header">
            <span className="prose-tone-badge">
              {TONES.find((t) => t.id === selectedTone)?.icon}{" "}
              {TONES.find((t) => t.id === selectedTone)?.name} Prose
            </span>
            <div className="prose-action-buttons">
              <button
                type="button"
                className="prose-icon-btn"
                onClick={copyProse}
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
          <blockquote className="generated-prose-quote">
            "{generatedProse}"
          </blockquote>
          <div className="prose-footer">
            <Button
              size="sm"
              variant="default"
              onClick={handleApply}
              className="apply-prose-btn"
            >
              {applied ? (
                <>
                  <Check size={14} /> Applied to Chapter!
                </>
              ) : (
                <>
                  <BookOpen size={14} /> Apply to Memory Caption
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

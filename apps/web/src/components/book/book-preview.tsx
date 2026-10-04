"use client";

import { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
  BookOpen,
  Disc3,
  Play,
  Pause,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { memories } from "@/lib/content";
import {
  playPaperRustle,
  playSubtleClick,
  playVinylNeedleDrop,
  playVoiceMemoKeep,
  isSoundEnabled,
  toggleSound,
  setSoundEnabled,
} from "@/lib/audio";
import "./book-preview.css";

type Memory = (typeof memories)[number];
type Turn = { from: number; to: number; direction: "next" | "prev" };
type ReaderState = { page: number; turn: Turn | null };
type ReaderAction =
  { type: "go"; page: number; immediate: boolean } | { type: "finish" };
const TURN_DURATION = 720;

function readerReducer(state: ReaderState, action: ReaderAction): ReaderState {
  if (action.type === "finish") {
    return state.turn ? { page: state.turn.to, turn: null } : state;
  }
  if (state.turn || action.page === state.page) return state;
  return action.immediate
    ? { page: action.page, turn: null }
    : {
        ...state,
        turn: {
          from: state.page,
          to: action.page,
          direction: action.page > state.page ? "next" : "prev",
        },
      };
}

function PhotoPage({
  memory,
  index,
  decorative = false,
}: {
  memory: Memory;
  index: number;
  decorative?: boolean;
}) {
  return (
    <div className="reader-photo-page">
      <div className="reader-photo">
        <Image
          src={memory.image}
          alt={decorative ? "" : memory.alt}
          fill
          sizes="(max-width: 720px) 90vw, 480px"
        />
        <span className="reader-photo-date">{memory.date}</span>
      </div>
      <div className="reader-photo-caption">
        <span>PLATE {String(index + 1).padStart(2, "0")}</span>
        <em>A moment worth keeping.</em>
      </div>
    </div>
  );
}

function StoryPage({
  memory,
  index,
  total,
  captions,
  playingMemoId,
  onPlayMemo,
}: {
  memory: Memory;
  index: number;
  total: number;
  captions?: Record<string, string>;
  playingMemoId?: string | null;
  onPlayMemo?: (id: string) => void;
}) {
  const isPlaying = playingMemoId === memory.id;

  return (
    <div className="reader-story-page">
      <div className="reader-story-kicker">
        <span>OUR SUMMER</span>
        <span>CHAPTER {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="reader-story-body">
        <p className="reader-date">{memory.date}</p>
        <h3>{memory.title}</h3>
        <span className="reader-rule" aria-hidden="true" />
        <blockquote>
          {captions?.[memory.id]?.trim() || memory.caption}
        </blockquote>
        <p className="reader-person">
          With <em>{memory.person}.</em>
        </p>

        {onPlayMemo && (
          <div className="reader-voice-keepsake">
            <button
              type="button"
              className={`voice-keepsake-btn ${isPlaying ? "is-playing" : ""}`}
              onClick={() => onPlayMemo(memory.id)}
              aria-label={
                isPlaying
                  ? "Pause keepsake audio note"
                  : `Play audio keepsake with ${memory.person}`
              }
            >
              <Disc3
                size={14}
                className={`voice-disc-icon ${isPlaying ? "is-spinning" : ""}`}
              />
              <span className="voice-btn-text">
                {isPlaying
                  ? "Playing keepsake..."
                  : `Audio note · ${memory.person}`}
              </span>
              <span className="voice-wave-bars" aria-hidden="true">
                <span className="wave-bar bar-1" />
                <span className="wave-bar bar-2" />
                <span className="wave-bar bar-3" />
                <span className="wave-bar bar-4" />
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="reader-page-footer">
        <span>THE DAYS BETWEEN · VOL. 01</span>
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function BookReader({
  pages,
  captions,
}: {
  pages: readonly Memory[];
  captions?: Record<string, string>;
}) {
  const [{ page, turn }, dispatch] = useReducer(readerReducer, {
    page: 0,
    turn: null,
  });
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [playingMemoId, setPlayingMemoId] = useState<string | null>(null);
  const [isCinematic, setIsCinematic] = useState(false);
  const [showPrintSpecs, setShowPrintSpecs] = useState(false);
  const reducedMotion = useReducedMotion();
  const memory = pages[page];
  const target = turn ? pages[turn.to] : memory;
  const next = turn?.direction === "next";

  // Complete a turn even if a browser suppresses its animation event, and clean up on close.
  useEffect(() => {
    if (!turn) return;
    const timer = window.setTimeout(
      () => dispatch({ type: "finish" }),
      reducedMotion ? 0 : TURN_DURATION + 80,
    );
    return () => window.clearTimeout(timer);
  }, [turn, reducedMotion]);

  const navigate = (destination: number) => {
    if (!pages.length || turn) return;
    const bounded = Math.max(0, Math.min(destination, pages.length - 1));
    if (bounded === page) return;
    playPaperRustle();
    dispatch({ type: "go", page: bounded, immediate: reducedMotion });
  };

  const handlePlayMemo = (id: string) => {
    if (playingMemoId === id) {
      setPlayingMemoId(null);
      playSubtleClick();
    } else {
      setPlayingMemoId(id);
      if (!soundOn) {
        setSoundEnabled(true);
        setSoundOn(true);
      }
      playVinylNeedleDrop();
      window.setTimeout(() => {
        playVoiceMemoKeep();
      }, 100);
      window.setTimeout(() => {
        setPlayingMemoId((current) => (current === id ? null : current));
      }, 2700);
    }
  };

  // Cinematic auto-play page turns
  useEffect(() => {
    if (!isCinematic || !pages.length || Boolean(turn)) return;
    const timer = window.setTimeout(() => {
      const nextDest = (page + 1) % pages.length;
      playPaperRustle();
      dispatch({ type: "go", page: nextDest, immediate: reducedMotion });
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [isCinematic, page, pages.length, turn, reducedMotion]);

  return (
    <Dialog.Content
      className="book-dialog memora-reader"
      data-lenis-prevent
      onKeyDown={(event) => {
        const element = event.target as HTMLElement;
        if (
          element.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName)
        )
          return;
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        navigate(
          event.key === "ArrowRight"
            ? page + 1
            : event.key === "ArrowLeft"
              ? page - 1
              : event.key === "Home"
                ? 0
                : pages.length - 1,
        );
      }}
    >
      <header className="reader-header">
        <div>
          <p className="reader-edition">MEMORA LIBRARY · A SAMPLE EDITION</p>
          <Dialog.Title className="preview-title">
            The days between.
          </Dialog.Title>
          <Dialog.Description className="preview-description">
            A little summer book. Your words make it yours.
          </Dialog.Description>
        </div>
        <div className="reader-header-actions">
          <button
            type="button"
            className={`reader-cinematic-btn ${isCinematic ? "is-active" : ""}`}
            aria-pressed={isCinematic}
            aria-label={
              isCinematic ? "Pause cinematic story" : "Play cinematic story"
            }
            title={
              isCinematic ? "Pause cinematic story" : "Play cinematic story"
            }
            onClick={() => {
              setIsCinematic((prev) => !prev);
              playSubtleClick();
            }}
          >
            {isCinematic ? <Pause size={14} /> : <Play size={14} />}
            <span>{isCinematic ? "Pause" : "Cinematic"}</span>
          </button>

          <button
            type="button"
            className={`reader-print-specs-btn ${showPrintSpecs ? "is-active" : ""}`}
            onClick={() => {
              setShowPrintSpecs((prev) => !prev);
              playSubtleClick();
            }}
            aria-label="View fine-art print specifications"
            title="Fine-Art Print Specifications"
          >
            <Printer size={15} />
            <span>Print Specs</span>
          </button>

          <button
            type="button"
            className="reader-sound-toggle"
            aria-pressed={soundOn}
            aria-label={
              soundOn ? "Mute paper turn sounds" : "Enable paper turn sounds"
            }
            title={
              soundOn ? "Mute paper turn sounds" : "Enable paper turn sounds"
            }
            onClick={() => {
              const enabled = toggleSound();
              setSoundOn(enabled);
              if (enabled) playSubtleClick();
            }}
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="reader-close"
              aria-label="Close book preview"
            >
              <X size={19} />
            </Button>
          </Dialog.Close>
        </div>
      </header>

      {showPrintSpecs && (
        <div className="reader-print-panel">
          <div className="print-specs-card">
            <div className="specs-header">
              <h4>
                <Sparkles size={14} /> ARCHIVAL PRINT SPECIFICATIONS
              </h4>
              <button
                type="button"
                className="specs-close-btn"
                onClick={() => setShowPrintSpecs(false)}
                aria-label="Close print specifications"
              >
                <X size={14} />
              </button>
            </div>
            <div className="specs-grid">
              <div>
                <strong>Format</strong>
                <span>8.5 × 8.5" Square Keepsake</span>
              </div>
              <div>
                <strong>Paper Stock</strong>
                <span>140 gsm Mohawk Superfine Eggshell</span>
              </div>
              <div>
                <strong>Binding</strong>
                <span>Smyth-Sewn Hardcover · Lay-Flat</span>
              </div>
              <div>
                <strong>Cover Cloth</strong>
                <span>Buckram Natural Linen with Gold Foil</span>
              </div>
              <div>
                <strong>Resolution</strong>
                <span>300 DPI Fine-Art Archival CMYK</span>
              </div>
            </div>
            <div className="specs-actions">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  playSubtleClick();
                  window.print();
                }}
              >
                <Printer size={14} /> Print / Export PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {memory && target ? (
        <div
          className="reader-book"
          aria-label="Sample book spread"
          aria-busy={Boolean(turn)}
        >
          <div
            className="reader-spread"
            aria-hidden={Boolean(turn) || undefined}
          >
            <PhotoPage
              memory={turn && !next ? target : memory}
              index={turn && !next ? turn.to : page}
            />
            <StoryPage
              memory={turn && next ? target : memory}
              index={turn && next ? turn.to : page}
              total={pages.length}
              captions={captions}
              playingMemoId={playingMemoId}
              onPlayMemo={handlePlayMemo}
            />
          </div>
          <div className="reader-spine" aria-hidden="true" />
          {turn && !reducedMotion && (
            <>
              <div
                className="reader-spread reader-mobile-target"
                aria-hidden="true"
              >
                <PhotoPage memory={target} index={turn.to} decorative />
                <StoryPage
                  memory={target}
                  index={turn.to}
                  total={pages.length}
                  captions={captions}
                />
              </div>
              <div
                className={`reader-turn reader-turn-${turn.direction}`}
                aria-hidden="true"
                onAnimationEnd={(event) => {
                  if (event.target === event.currentTarget)
                    dispatch({ type: "finish" });
                }}
              >
                <div className="reader-leaf-face reader-leaf-front">
                  {next ? (
                    <StoryPage
                      memory={memory}
                      index={page}
                      total={pages.length}
                      captions={captions}
                    />
                  ) : (
                    <PhotoPage memory={memory} index={page} decorative />
                  )}
                </div>
                <div className="reader-leaf-face reader-leaf-back">
                  {next ? (
                    <PhotoPage memory={target} index={turn.to} decorative />
                  ) : (
                    <StoryPage
                      memory={target}
                      index={turn.to}
                      total={pages.length}
                      captions={captions}
                    />
                  )}
                </div>
                <div className="reader-mobile-leaf">
                  <PhotoPage memory={memory} index={page} decorative />
                  <StoryPage
                    memory={memory}
                    index={page}
                    total={pages.length}
                    captions={captions}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="reader-empty">
          <BookOpen size={35} strokeWidth={1} />
          <h3>A book begins with someone.</h3>
          <p>Choose a person in your story to see their memories here.</p>
        </div>
      )}

      <footer className="reader-controls">
        <Button
          size="icon"
          variant="outline"
          aria-label="Previous page"
          disabled={!pages.length || page === 0 || Boolean(turn)}
          onClick={() => navigate(page - 1)}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="reader-pagination">
          <p role="status" aria-live="polite" aria-atomic="true">
            {pages.length
              ? `Page ${page + 1} of ${pages.length}`
              : "No memories selected"}
          </p>
          <div className="reader-page-dots" aria-label="Choose a page">
            {pages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Jump to page ${index + 1}`}
                title={item.title}
                aria-current={index === page ? "page" : undefined}
                disabled={Boolean(turn)}
                onClick={() => navigate(index)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <Button
          size="icon"
          variant="outline"
          aria-label="Next page"
          disabled={!pages.length || page === pages.length - 1 || Boolean(turn)}
          onClick={() => navigate(page + 1)}
        >
          <ArrowRight size={18} />
        </Button>
      </footer>
      <p className="reader-keyboard-hint">
        Use the arrow keys to turn a page{" "}
        <span aria-hidden="true">← &nbsp; →</span>
      </p>
    </Dialog.Content>
  );
}

export function BookPreview({
  captions,
  peopleNames,
  triggerLabel = "Flip through a sample",
}: {
  captions?: Record<string, string>;
  peopleNames?: string[];
  triggerLabel?: string;
}) {
  const pages = peopleNames
    ? memories.filter((item) => peopleNames.includes(item.person))
    : memories;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" data-magnetic>
          {triggerLabel}
          <ArrowRight size={16} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay reader-overlay" />
        {/* A changed selection starts a valid collection while the dialog stays open. */}
        <BookReader
          key={pages.map((item) => item.id).join("|")}
          pages={pages}
          captions={captions}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
}

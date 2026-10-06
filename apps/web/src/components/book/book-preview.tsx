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
  Music2,
  SlidersHorizontal,
  Box,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { memories } from "@/lib/content";
import { QrCode } from "@/components/ui/qr-code";
import { ArViewModal } from "./ar-view-modal";
import { OrderModal } from "./order-modal";
import {
  playPaperRustle,
  playSubtleClick,
  playVinylNeedleDrop,
  playVoiceMemoKeep,
  isSoundEnabled,
  toggleSound,
  setSoundEnabled,
} from "@/lib/audio";
import {
  useMusic,
  toggleMusic,
  setActivePhotoContext,
  getTrackForPhoto,
  getTrackDisplayName,
  SERVICE_EMOJI,
  SERVICE_NAME,
} from "@/lib/music";
import { startMusicPick } from "@/lib/music-pick";
import {
  MusicSheetDialog,
  AnimatedEqualizer,
} from "@/components/music/music-sheet";
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
  onAttachMusic,
}: {
  memory: Memory;
  index: number;
  decorative?: boolean;
  onAttachMusic?: () => void;
}) {
  const photoTrack = getTrackForPhoto(memory.id);

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
        {onAttachMusic && !decorative && (
          <button
            type="button"
            className="reader-photo-music-tag"
            onClick={onAttachMusic}
            title={
              photoTrack
                ? `Soundtrack: ${getTrackDisplayName(photoTrack)}. Click to reassign.`
                : "Search music app and attach soundtrack to this photo"
            }
            aria-label={`Soundtrack for ${memory.title}`}
          >
            <Music2 size={11} />
            <span>
              {photoTrack ? (
                <>
                  {photoTrack.kind === "link" ? `${SERVICE_EMOJI[photoTrack.service]} ` : "🎵 "}
                  {getTrackDisplayName(photoTrack).length > 20
                    ? getTrackDisplayName(photoTrack).slice(0, 18) + "…"
                    : getTrackDisplayName(photoTrack)}
                </>
              ) : (
                "Attach Song ➔"
              )}
            </span>
          </button>
        )}
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
  onToggleSoundtrack,
  onOpenSoundtrackSettings,
}: {
  memory: Memory;
  index: number;
  total: number;
  captions?: Record<string, string>;
  playingMemoId?: string | null;
  onPlayMemo?: (id: string) => void;
  onToggleSoundtrack?: () => void;
  onOpenSoundtrackSettings?: () => void;
}) {
  const isPlaying = playingMemoId === memory.id;
  const music = useMusic();
  const photoTrack = getTrackForPhoto(memory.id);
  const trackName = photoTrack
    ? getTrackDisplayName(photoTrack)
    : music.bookSong
      ? `${getTrackDisplayName(music.bookSong)} (Book)`
      : "Score";

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

        <div className="reader-audio-cluster">
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

          {onToggleSoundtrack && (
            <div className="reader-picture-soundtrack-wrapper">
              <button
                type="button"
                className={`reader-picture-soundtrack-btn ${music.on ? "is-playing" : ""}`}
                onClick={onToggleSoundtrack}
                title={music.on ? "Mute music" : "Play music for this picture"}
                aria-label={`Soundtrack: ${trackName}`}
              >
                <Music2 size={13} className="picture-music-icon" />
                <span className="picture-music-name">{trackName}</span>
                {photoTrack?.kind === "link" && (
                  <span className="reader-track-service-tag" title={`Streaming from ${SERVICE_NAME[photoTrack.service]}`}>
                    {SERVICE_EMOJI[photoTrack.service]}
                  </span>
                )}
                <AnimatedEqualizer active={music.on} />
              </button>
              {onOpenSoundtrackSettings && (
                <button
                  type="button"
                  className="reader-music-settings-trigger"
                  onClick={onOpenSoundtrackSettings}
                  title="Assign custom song for this picture"
                  aria-label="Soundtrack options"
                >
                  <SlidersHorizontal size={12} />
                </button>
              )}
            </div>
          )}
        </div>
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

const PHOTO_PALETTES: Record<string, { bg: string; accent: string }> = {
  coast: { bg: "#faf6ee", accent: "#e5d7c3" },
  friends: { bg: "#faf2ee", accent: "#eddcd2" },
  flowers: { bg: "#fdf3f5", accent: "#eedce2" },
  mountains: { bg: "#f2f6f9", accent: "#dce6eb" },
};

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
  const [foilChoice, setFoilChoice] = useState<string>("gold");
  const [cmykProof, setCmykProof] = useState(false);
  const [showSoundtrackDialog, setShowSoundtrackDialog] = useState(false);
  const [showArModal, setShowArModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const music = useMusic();
  const reducedMotion = useReducedMotion();
  const totalPages = Math.max(pages.length * 2, 24);
  const spineThicknessMm = (totalPages * 0.12 + 3.5).toFixed(1);
  const spineThicknessIn = (Number(spineThicknessMm) / 25.4).toFixed(2);
  const memory = pages[page];
  const target = turn ? pages[turn.to] : memory;
  const next = turn?.direction === "next";

  const activePalette = memory?.id
    ? (PHOTO_PALETTES[memory.id] ?? { bg: "#faf6ef", accent: "#e7dac4" })
    : { bg: "#faf6ef", accent: "#e7dac4" };

  useEffect(() => {
    if (memory?.id) {
      setActivePhotoContext(memory.id);
    }
  }, [memory?.id]);

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
    const directionPan = bounded > page ? 0.45 : -0.45;
    playPaperRustle(directionPan);
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
            className="reader-ar-btn"
            onClick={() => {
              setShowArModal(true);
              playSubtleClick();
            }}
            aria-label="View photobook in Augmented Reality 1:1 scale"
            title="View in Augmented Reality (1:1 Scale)"
          >
            <Box size={14} />
            <span>AR</span>
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
            className="reader-order-btn"
            onClick={() => {
              setShowOrderModal(true);
              playSubtleClick();
            }}
            aria-label="Order Smyth-sewn archival photobook"
            title="Order Smyth-Sewn Keepsake"
          >
            <Package size={15} />
            <span>Order</span>
          </button>

          <button
            type="button"
            className={`reader-soundtrack-btn ${music.on ? "is-active" : ""}`}
            onClick={() => {
              setShowSoundtrackDialog((prev) => !prev);
              playSubtleClick();
            }}
            aria-label={
              music.on
                ? `Soundtrack playing: ${music.playingLabel || "Score"}. Settings`
                : "Soundtrack settings"
            }
            title={
              music.on
                ? `Soundtrack: ${music.playingLabel || "Score"}`
                : "Soundtrack settings"
            }
          >
            <AnimatedEqualizer active={music.on} />
            <span>{music.on ? "Music" : "Score"}</span>
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
                <strong>Spine Thickness</strong>
                <span>
                  {spineThicknessMm} mm ({spineThicknessIn}&Prime;)
                </span>
              </div>
              <div>
                <strong>Cover Foil Stamp</strong>
                <span className="specs-foil-tag">
                  {foilChoice === "gold"
                    ? "🌟 Aurum Gold Stamp"
                    : foilChoice === "silver"
                      ? "🪙 Argentum Silver"
                      : foilChoice === "rose"
                        ? "🌹 Rose Gold Foil"
                        : "🖋️ Blind Deboss Lettering"}
                </span>
              </div>
              <div>
                <strong>Resolution</strong>
                <span>300 DPI Fine-Art Archival CMYK</span>
              </div>
              <div>
                <strong>Inside Cover Plate</strong>
                <span>{includeQrCode ? "Soundtrack Micro-QR" : "Blind Monogram"}</span>
              </div>
            </div>

            <div className="specs-cmyk-toggle-bar">
              <div className="specs-cmyk-info">
                <span className="cmyk-title">CMYK Archival Gamut Soft-Proof</span>
                <span className="cmyk-desc">
                  Simulate ink absorption and tactile surface reflectance on 140 gsm eggshell paper
                </span>
              </div>
              <button
                type="button"
                className={`cmyk-toggle-btn ${cmykProof ? "is-active" : ""}`}
                onClick={() => {
                  setCmykProof((prev) => !prev);
                  playSubtleClick();
                }}
                aria-pressed={cmykProof}
                aria-label={
                  cmykProof
                    ? "Disable CMYK soft-proofing"
                    : "Enable CMYK soft-proofing simulation"
                }
              >
                <span>{cmykProof ? "Proofing Active" : "Simulate CMYK"}</span>
              </button>
            </div>

            <div className="specs-foil-selector">
              <span className="foil-selector-label">CUSTOMIZE FOIL STAMP</span>
              <div className="foil-options-cluster">
                {[
                  { id: "gold", label: "Aurum Gold", icon: "🌟" },
                  { id: "silver", label: "Silver", icon: "🪙" },
                  { id: "rose", label: "Rose Gold", icon: "🌹" },
                  { id: "deboss", label: "Blind Deboss", icon: "🖋️" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`foil-pill-btn ${foilChoice === f.id ? "is-selected" : ""}`}
                    onClick={() => {
                      setFoilChoice(f.id);
                      playSubtleClick();
                    }}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="specs-endpaper-qr-box">
              <div className="endpaper-qr-header">
                <div>
                  <span className="endpaper-kicker">ENDPAPER PLATE · ENGRAVED QR</span>
                  <p className="endpaper-desc">
                    Aesthetically engraved on inside cover endpaper. Scanning plays this
                    keepsake's ambient soundtrack.
                  </p>
                </div>
                <button
                  type="button"
                  className={`cmyk-toggle-btn ${includeQrCode ? "is-active" : ""}`}
                  onClick={() => {
                    setIncludeQrCode((p) => !p);
                    playSubtleClick();
                  }}
                  aria-pressed={includeQrCode}
                >
                  <span>{includeQrCode ? "QR Included" : "Monogram Only"}</span>
                </button>
              </div>
              {includeQrCode && (
                <div className="endpaper-preview-plate">
                  <div className="plate-text-col">
                    <span className="plate-brand">M E M O R A</span>
                    <p className="plate-quote">We were here. And that was everything.</p>
                    <span className="plate-edition">ORIGINAL SOUNDTRACK · VOL. 01</span>
                  </div>
                  <div className="plate-qr-col">
                    <QrCode
                      value="https://memora.app/soundtrack?vol=01"
                      size={64}
                      fgColor="#5a4133"
                      bgColor="#f4ede0"
                      ariaLabel="Soundtrack QR code"
                    />
                    <span className="plate-qr-hint">Scan with phone</span>
                  </div>
                </div>
              )}
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
              <Button
                size="sm"
                className="specs-order-btn"
                onClick={() => {
                  setShowOrderModal(true);
                  playSubtleClick();
                }}
                aria-label="Order printed archival keepsake"
              >
                <Package size={14} /> Order Smyth-Sewn Volume
              </Button>
            </div>
          </div>
        </div>
      )}

      {memory && target ? (
        <div
          className={`reader-book ${cmykProof ? "cmyk-proof-mode" : ""}`}
          aria-label="Sample book spread"
          aria-busy={Boolean(turn)}
          style={
            {
              "--reader-spread-bg": activePalette.bg,
              "--reader-accent": activePalette.accent,
            } as React.CSSProperties
          }
        >
          <div
            className="reader-spread"
            aria-hidden={Boolean(turn) || undefined}
          >
            <PhotoPage
              memory={turn && !next ? target : memory}
              index={turn && !next ? turn.to : page}
              onAttachMusic={() => {
                const currentMem = turn && !next ? target : memory;
                startMusicPick({
                  targetPhotoId: currentMem.id,
                  targetTitle: currentMem.title,
                  targetImage: currentMem.image,
                });
              }}
            />
            <StoryPage
              memory={turn && next ? target : memory}
              index={turn && next ? turn.to : page}
              total={pages.length}
              captions={captions}
              playingMemoId={playingMemoId}
              onPlayMemo={handlePlayMemo}
              onToggleSoundtrack={() => toggleMusic()}
              onOpenSoundtrackSettings={() => {
                const currentMem = turn && next ? target : memory;
                startMusicPick({
                  targetPhotoId: currentMem.id,
                  targetTitle: currentMem.title,
                  targetImage: currentMem.image,
                });
              }}
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

      <MusicSheetDialog
        open={showSoundtrackDialog}
        onOpenChange={setShowSoundtrackDialog}
      />

      <ArViewModal
        open={showArModal}
        onOpenChange={setShowArModal}
      />

      <OrderModal
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        specs={{
          coverColor: "#512e37",
          coverName: "Burgundy Velvet",
          foilChoice,
          foilLabel:
            foilChoice === "silver"
              ? "Argentum Silver"
              : foilChoice === "rose"
                ? "Rose Gold Foil"
                : foilChoice === "deboss"
                  ? "Blind Deboss Lettering"
                  : "Aurum Gold Foil",
          foilIcon:
            foilChoice === "silver"
              ? "🪙"
              : foilChoice === "rose"
                ? "🌹"
                : foilChoice === "deboss"
                  ? "🖋️"
                  : "🌟",
          pageCount: totalPages,
          spineThicknessMm,
          includeQrCode,
        }}
      />
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

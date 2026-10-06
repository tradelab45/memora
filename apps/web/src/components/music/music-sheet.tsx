"use client";

import { useRef, useState, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Check,
  Disc3,
  X,
  Sparkles,
  ExternalLink,
  Headphones,
} from "lucide-react";
import {
  useMusic,
  setMusicActive,
  setMusicMode,
  setBookTrack,
  setPhotoTrack,
  setMusicVolume,
  addCustomAudioFile,
  BUILTIN_TRACKS,
  type TrackRef,
  getTrackDisplayName,
} from "@/lib/music";
import { memories } from "@/lib/content";
import Image from "next/image";
import "./music-sheet.css";

export function SongPicker({
  value,
  onChange,
  label,
  emptyLabel = "Follows book soundtrack",
  className = "",
}: {
  value: TrackRef;
  onChange: (t: TrackRef) => void;
  label: string;
  emptyLabel?: string;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const selectId = useId();

  const handleCustomUpload = async (file: File | undefined) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage("");
    const result = await addCustomAudioFile(file);
    setIsProcessing(false);
    if (result === "too-large") {
      setErrorMessage("Audio file must be under 35 MB.");
    } else if (result === "invalid-format") {
      setErrorMessage("Please select an audio file (MP3, WAV, AAC, M4A).");
    } else {
      onChange(result);
    }
  };

  const currentValue = !value
    ? ""
    : `${value.kind}:${value.id}`;

  return (
    <div className={`song-picker-field ${className}`}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <div className="song-picker-control">
        <Disc3 size={15} className="song-picker-icon" aria-hidden="true" />
        <select
          id={selectId}
          value={currentValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__CUSTOM_UPLOAD__") {
              fileInputRef.current?.click();
              return;
            }
            if (val === "__STREAMING_SPOTIFY__") {
              if (typeof window !== "undefined") {
                window.open("https://open.spotify.com/search/nostalgic%20instrumental", "_blank");
              }
              return;
            }
            if (val === "__STREAMING_APPLE__") {
              if (typeof window !== "undefined") {
                window.open("https://music.apple.com/search?term=nostalgic%20instrumental", "_blank");
              }
              return;
            }
            if (val === "__STREAMING_YT__") {
              if (typeof window !== "undefined") {
                window.open("https://music.youtube.com/search?q=nostalgic+instrumental+memories", "_blank");
              }
              return;
            }
            if (!val) {
              onChange(null);
              return;
            }
            const [kind, id] = val.split(":");
            if (kind === "builtin") {
              onChange({ kind: "builtin", id });
            } else if (value && value.kind === "file" && value.id === id) {
              onChange(value);
            }
          }}
          className="song-picker-select"
        >
          <option value="">{emptyLabel}</option>
          <optgroup label="Atmospheric Built-in Tracks">
            {BUILTIN_TRACKS.map((t) => (
              <option key={t.id} value={`builtin:${t.id}`}>
                {t.name} — {t.note}
              </option>
            ))}
          </optgroup>
          {value?.kind === "file" && (
            <optgroup label="Your Kept Audio">
              <option value={`file:${value.id}`}>
                🎵 {value.name} (Your Device File)
              </option>
            </optgroup>
          )}
          <optgroup label="Import or Stream">
            <option value="__CUSTOM_UPLOAD__">
              + Choose audio file from your device...
            </option>
            <option value="__STREAMING_SPOTIFY__">
              🟢 Launch Spotify on device...
            </option>
            <option value="__STREAMING_APPLE__">
              🍎 Launch Apple Music on device...
            </option>
            <option value="__STREAMING_YT__">
              🔴 Launch YouTube Music on device...
            </option>
          </optgroup>
        </select>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.flac"
        className="sr-only"
        onChange={(e) => {
          void handleCustomUpload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {errorMessage && <p className="song-picker-error">{errorMessage}</p>}
      {isProcessing && <p className="song-picker-hint">Saving audio locally...</p>}
    </div>
  );
}

export function AnimatedEqualizer({ active }: { active: boolean }) {
  return (
    <span
      className={`audio-eq-bars ${active ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <span className="eq-bar eq-b1" />
      <span className="eq-bar eq-b2" />
      <span className="eq-bar eq-b3" />
      <span className="eq-bar eq-b4" />
    </span>
  );
}

export function MusicSheetDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const music = useMusic();

  const handleToggle = () => {
    setMusicActive(!music.on);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="music-dialog-overlay" />
        <Dialog.Content
          className="music-dialog-card"
          data-lenis-prevent
          aria-describedby="music-sheet-desc"
        >
          <header className="music-sheet-header">
            <div className="music-sheet-kicker">
              <Sparkles size={14} />
              <span>MEMORA ATMOSPHERIC SOUNDTRACK</span>
            </div>
            <Dialog.Title className="music-sheet-title">
              Soundtrack for your Keepsake
            </Dialog.Title>
            <Dialog.Description id="music-sheet-desc" className="music-sheet-desc">
              Choose a nostalgic score for the entire book or assign a distinct
              melody to each kept memory.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                type="button"
                className="music-dialog-close"
                aria-label="Close soundtrack settings"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </header>

          <div className="music-sheet-body">
            {/* Master Toggle Banner */}
            <div className={`music-master-banner ${music.on ? "is-playing" : ""}`}>
              <div className="master-banner-info">
                <div className="master-banner-title-row">
                  <AnimatedEqualizer active={music.on} />
                  <span className="master-banner-title">
                    {music.on
                      ? `Now Playing: ${music.playingLabel || getTrackDisplayName(music.bookSong)}`
                      : "Soundtrack is Muted"}
                  </span>
                </div>
                <p className="master-banner-status">
                  {music.on
                    ? music.mode === "book"
                      ? "Common book song playing continuously"
                      : "Photo-reactive mode active (follows active picture)"
                    : "Turn on to immerse your storytelling in ambient audio."}
                </p>
              </div>
              <button
                type="button"
                className={`music-master-btn ${music.on ? "is-on" : ""}`}
                onClick={handleToggle}
                aria-label={music.on ? "Mute soundtrack" : "Play soundtrack"}
              >
                {music.on ? <Pause size={16} /> : <Play size={16} />}
                <span>{music.on ? "Turn Off" : "Turn On"}</span>
              </button>
            </div>

            {/* Mode Radios */}
            <div className="music-mode-picker">
              <label className="mode-picker-label">SOUNDTRACK EXPERIENCE</label>
              <div className="mode-options-grid" role="radiogroup">
                <button
                  type="button"
                  role="radio"
                  aria-checked={music.mode === "book"}
                  className={`mode-card ${music.mode === "book" ? "is-selected" : ""}`}
                  onClick={() => setMusicMode("book")}
                >
                  <div className="mode-card-header">
                    <span className="mode-title">Common Song for Whole Book</span>
                    {music.mode === "book" && <Check size={16} className="mode-check" />}
                  </div>
                  <p className="mode-desc">
                    One unified nostalgic loop plays softly while you read through
                    every page.
                  </p>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={music.mode === "photo"}
                  className={`mode-card ${music.mode === "photo" ? "is-selected" : ""}`}
                  onClick={() => setMusicMode("photo")}
                >
                  <div className="mode-card-header">
                    <span className="mode-title">A Song for Every Picture</span>
                    {music.mode === "photo" && <Check size={16} className="mode-check" />}
                  </div>
                  <p className="mode-desc">
                    The music seamlessly crossfades as you turn pages, matching
                    the mood of each memory.
                  </p>
                </button>
              </div>
            </div>

            {/* Book Song Selector */}
            <div className="music-setting-group">
              <label className="music-group-label">
                {music.mode === "book" ? "BOOK SOUNDTRACK" : "FALLBACK BOOK SOUNDTRACK"}
              </label>
              <SongPicker
                label="Book Song"
                value={music.bookSong}
                onChange={setBookTrack}
                emptyLabel="No music (Muted)"
              />
            </div>

            {/* Photo Song Customizer (Visible when in photo mode or to pre-assign) */}
            <div className="music-setting-group">
              <div className="group-header-with-badge">
                <label className="music-group-label">
                  INDIVIDUAL PICTURE SOUNDTRACKS
                </label>
                <span className="group-badge">
                  {Object.keys(music.photoSongs).length} assigned
                </span>
              </div>
              <p className="group-subtext">
                Assign unique melodies or voice memos to each memory. Unassigned
                pictures inherit the book soundtrack.
              </p>

              <div className="photo-songs-list">
                {memories.map((mem) => {
                  const assigned = music.photoSongs[mem.id] ?? null;
                  return (
                    <div key={mem.id} className="photo-song-item">
                      <div className="photo-item-thumb">
                        <Image
                          src={mem.image}
                          alt={mem.title}
                          width={44}
                          height={44}
                          className="photo-thumb-img"
                        />
                      </div>
                      <div className="photo-item-meta">
                        <span className="photo-item-title">{mem.title}</span>
                        <span className="photo-item-person">With {mem.person}</span>
                      </div>
                      <div className="photo-item-picker-wrapper">
                        <SongPicker
                          label={`Soundtrack for ${mem.title}`}
                          value={assigned}
                          onChange={(track) => setPhotoTrack(mem.id, track)}
                          emptyLabel="Inherit book soundtrack"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="music-volume-row">
              <div className="volume-label-col">
                <span className="volume-title">Soundtrack Volume</span>
                <span className="volume-percent">
                  {Math.round(music.volume * 100)}%
                </span>
              </div>
              <div className="volume-slider-wrapper">
                <VolumeX
                  size={16}
                  className="volume-icon"
                  onClick={() => setMusicVolume(0)}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={music.volume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="music-volume-range"
                  aria-label="Soundtrack master volume"
                />
                <Volume2
                  size={16}
                  className="volume-icon"
                  onClick={() => setMusicVolume(0.8)}
                />
              </div>
            </div>

            {/* Streaming Apps / Phone Music Redirection */}
            <div className="music-streaming-section">
              <div className="streaming-section-header">
                <Headphones size={14} className="streaming-header-icon" />
                <span className="streaming-header-title">
                  OPEN YOUR PHONE'S MUSIC SERVICE
                </span>
              </div>
              <p className="streaming-section-desc">
                Want to play your personal playlists or favorite background tracks while browsing?
                Launch your music streaming app directly:
              </p>
              <div className="streaming-apps-grid">
                <a
                  href="https://open.spotify.com/search/nostalgic%20ambient%20instrumental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-app-btn is-spotify"
                  aria-label="Open in Spotify"
                >
                  <span className="streaming-app-badge">🟢 Spotify</span>
                  <span className="streaming-app-action">
                    Open app <ExternalLink size={12} />
                  </span>
                </a>

                <a
                  href="https://music.apple.com/search?term=nostalgic%20ambient%20instrumental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-app-btn is-apple"
                  aria-label="Open in Apple Music"
                >
                  <span className="streaming-app-badge">🍎 Apple Music</span>
                  <span className="streaming-app-action">
                    Open app <ExternalLink size={12} />
                  </span>
                </a>

                <a
                  href="https://music.youtube.com/search?q=nostalgic+ambient+instrumental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-app-btn is-youtube"
                  aria-label="Open in YouTube Music"
                >
                  <span className="streaming-app-badge">🔴 YouTube Music</span>
                  <span className="streaming-app-action">
                    Open app <ExternalLink size={12} />
                  </span>
                </a>
              </div>
            </div>

            <p className="music-privacy-notice">
              🔒 <strong>Privacy guarantee:</strong> Device audio files you select
              are processed solely inside your browser using IndexedDB and never
              transmitted to any remote server.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

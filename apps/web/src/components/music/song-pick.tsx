"use client";

import { useId, useState, useRef, useEffect } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Search,
  Shuffle,
  ArrowRight,
  Check,
  Music,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
} from "lucide-react";
import {
  useMusicPick,
  cancelMusicPick,
  setPickQuery,
  setPickService,
  setPickTargetPhoto,
  launchMusicAppSearch,
  proposeTrackForAttachment,
  submitSongLink,
  confirmSongAttachment,
  rejectProposedTrack,
  SUGGESTED_TRACKS,
  MOOD_SEARCH_IDEAS,
} from "@/lib/music-pick";
import {
  SERVICE_NAME,
  SERVICE_EMOJI,
  type Service,
  type LinkTrack,
} from "@/lib/music";
import { memories } from "@/lib/content";
import "./song-pick.css";

export function SongPick() {
  const pick = useMusicPick();
  const [pasteInput, setPasteInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputId = useId();
  const targetSelectId = useId();

  const {
    phase,
    service,
    targetPhotoId,
    targetTitle,
    targetImage,
    query,
    foundTrack,
    note,
  } = pick;

  // Auto-focus the "Yes" confirmation button when a track is found
  useEffect(() => {
    if (phase === "found") {
      yesButtonRef.current?.focus();
    }
  }, [phase]);

  const handleShuffleIdea = () => {
    const randomIdea =
      MOOD_SEARCH_IDEAS[Math.floor(Math.random() * MOOD_SEARCH_IDEAS.length)];
    setPickQuery(randomIdea);
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteInput.trim()) return;
    setIsSubmitting(true);
    await submitSongLink(pasteInput.trim());
    setIsSubmitting(false);
    setPasteInput("");
  };

  const handleSelectSuggested = (t: typeof SUGGESTED_TRACKS[0]) => {
    const trackObj: LinkTrack = {
      kind: "link",
      service: t.service,
      id: t.id,
      name: `${t.title} — ${t.artist}`,
      artist: t.artist,
      url: t.url,
    };
    proposeTrackForAttachment(trackObj);
  };

  return (
    <Dialog.Root
      open={phase !== "idle"}
      onOpenChange={(isOpen) => {
        if (!isOpen) cancelMusicPick();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="song-pick-overlay" />
        <Dialog.Content
          className="song-pick-card"
          data-lenis-prevent
          aria-describedby={undefined}
        >
          {/* Card Header */}
          <div className="song-pick-header">
            <div className="song-pick-title-col">
              <div className="song-pick-kicker">
                <Sparkles size={13} className="song-kicker-icon" />
                <span>
                  {phase === "found"
                    ? "CONFIRM PHOTO SOUNDTRACK"
                    : "MUSIC APP SEARCH & ATTACH"}
                </span>
              </div>
              <Dialog.Title className="song-pick-heading">
                {phase === "found"
                  ? "Use this song for your photo?"
                  : phase === "confirmed"
                    ? "Song Attached to Photo!"
                    : `Search on ${SERVICE_NAME[service]}`}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="song-pick-close"
                aria-label="Close song picker"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

        {/* Current Photo Target Badge */}
        <div className="song-target-indicator">
          <div className="song-target-thumb">
            {targetImage ? (
              <Image
                src={targetImage}
                alt={targetTitle}
                width={38}
                height={38}
                className="target-thumb-img"
              />
            ) : (
              <BookOpen size={20} className="target-book-icon" />
            )}
          </div>
          <div className="song-target-meta">
            <span className="target-label">Attaching soundtrack to:</span>
            <span className="target-name">
              {targetPhotoId ? `Photo: ${targetTitle}` : "Whole Magazine & Book"}
            </span>
          </div>
          {phase !== "found" && (
            <select
              id={targetSelectId}
              value={targetPhotoId}
              onChange={(e) => setPickTargetPhoto(e.target.value)}
              className="target-photo-select"
              aria-label="Select target photo"
            >
              <option value="">Whole Living Book</option>
              {memories.map((m) => (
                <option key={m.id} value={m.id}>
                  Photo: {m.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* =============================================================== */}
        {/* PHASE 1 & 2: SEARCH / WAITING */}
        {/* =============================================================== */}
        {(phase === "search" || phase === "waiting") && (
          <div className="song-search-body">
            {/* Service Switcher Tabs */}
            <div
              className="service-tabs-row"
              role="tablist"
              aria-label="Select music service"
            >
              {(["spotify", "apple", "youtube"] as Service[]).map((srv) => (
                <button
                  key={srv}
                  type="button"
                  role="tab"
                  aria-selected={service === srv}
                  className={`service-tab-btn ${service === srv ? "is-active" : ""}`}
                  onClick={() => setPickService(srv)}
                >
                  <span className="service-emoji">{SERVICE_EMOJI[srv]}</span>
                  <span>{SERVICE_NAME[srv]}</span>
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="song-search-input-group">
              <label htmlFor={searchInputId} className="search-group-label">
                Search your playlist, artist or random mood:
              </label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-input-icon" />
                <input
                  id={searchInputId}
                  type="text"
                  value={query}
                  onChange={(e) => setPickQuery(e.target.value)}
                  placeholder="Song title, artist, or playlist idea..."
                  className="song-search-field"
                />
                <button
                  type="button"
                  className="shuffle-idea-btn"
                  onClick={handleShuffleIdea}
                  title="Random mood idea"
                  aria-label="Shuffle random song idea"
                >
                  <Shuffle size={15} />
                </button>
              </div>
            </div>

            {/* Primary Action: Go to Music App Search Bar */}
            <button
              type="button"
              className="launch-app-search-btn"
              onClick={() => launchMusicAppSearch(service)}
            >
              <span>Go to {SERVICE_NAME[service]} Search Bar</span>
              <ExternalLink size={16} />
            </button>

            {note && (
              <p className="song-search-note" role="status">
                {note}
              </p>
            )}

            {/* Quick Pick from Suggestions / Your Playlist */}
            <div className="suggested-songs-section">
              <span className="suggested-heading">
                Or pick a curated track matching this photo:
              </span>
              <div className="suggested-tracks-list">
                {SUGGESTED_TRACKS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="suggested-track-item"
                    onClick={() => handleSelectSuggested(t)}
                  >
                    <span className="track-service-tag">
                      {SERVICE_EMOJI[t.service]}
                    </span>
                    <div className="track-details">
                      <span className="track-title">{t.title}</span>
                      <span className="track-artist">
                        {t.artist} · <em>{t.mood}</em>
                      </span>
                    </div>
                    <ArrowRight size={14} className="track-pick-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Paste Link Fallback */}
            <form onSubmit={handlePasteSubmit} className="paste-link-form">
              <label className="paste-label">
                <LinkIcon size={12} />
                <span>Pasted link from {SERVICE_NAME[service]}:</span>
              </label>
              <div className="paste-input-row">
                <input
                  type="url"
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder={`https://open.spotify.com/track/...`}
                  className="paste-input-field"
                />
                <button
                  type="submit"
                  disabled={!pasteInput.trim() || isSubmitting}
                  className="paste-submit-btn"
                >
                  {isSubmitting ? "Checking..." : "Inspect"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =============================================================== */}
        {/* PHASE 3: FOUND TRACK — PROMINENT ARROW MARK CONFIRMATION */}
        {/* =============================================================== */}
        {phase === "found" && foundTrack && (
          <div className="song-confirm-body">
            {/* The Arrow Mark Pipeline Visualizer */}
            <div className="song-pipeline-container">
              {/* Left: Chosen Song Card */}
              <div className="pipeline-node song-node">
                <div className="node-icon-bubble">
                  <Music size={18} />
                </div>
                <div className="node-content">
                  <span className="node-sub">CHOSEN SONG</span>
                  <strong className="node-title">{foundTrack.name}</strong>
                  <span className="node-service">
                    {SERVICE_EMOJI[foundTrack.service]}{" "}
                    {SERVICE_NAME[foundTrack.service]}
                  </span>
                </div>
              </div>

              {/* Center: The Glowing Arrow Mark Indicator (Clickable confirmation) */}
              <button
                type="button"
                className="pipeline-arrow-mark"
                onClick={confirmSongAttachment}
                title="Click arrow mark to attach this song to photo"
                aria-label="Confirm attaching song to photo by clicking arrow"
              >
                <div className="arrow-pulse-ring" />
                <span className="arrow-glyph" aria-hidden="true">
                  ➔
                </span>
                <span className="arrow-label">Click Arrow to Attach ➔</span>
              </button>

              {/* Right: Target Photo Card */}
              <div className="pipeline-node photo-node">
                <div className="node-thumb-wrapper">
                  {targetImage ? (
                    <Image
                      src={targetImage}
                      alt={targetTitle}
                      width={64}
                      height={64}
                      className="node-thumb-img"
                    />
                  ) : (
                    <BookOpen size={24} />
                  )}
                </div>
                <div className="node-content">
                  <span className="node-sub">TARGET PHOTO</span>
                  <strong className="node-title">{targetTitle}</strong>
                  <span className="node-service">Living Keepsake Plate</span>
                </div>
              </div>
            </div>

            {/* Confirmation Question & Description */}
            <div className="confirm-prompt-banner">
              <p className="confirm-prompt-text">
                Confirm: <strong>“{foundTrack.name}”</strong> will be uploaded and
                saved as the primary soundtrack for{" "}
                <strong>{targetPhotoId ? `“${targetTitle}”` : "the whole book"}</strong>.
              </p>
            </div>

            {/* Confirmation Action Buttons */}
            <div className="confirm-actions-row">
              <button
                ref={yesButtonRef}
                type="button"
                className="confirm-yes-btn"
                onClick={confirmSongAttachment}
              >
                <Check size={18} className="confirm-check-icon" />
                <span>Yes, Attach Song to Photo ➔</span>
              </button>

              <button
                type="button"
                className="confirm-reject-btn"
                onClick={rejectProposedTrack}
              >
                Choose another song
              </button>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PHASE 4: CONFIRMED SUCCESS */}
        {/* =============================================================== */}
        {phase === "confirmed" && (
          <div className="song-confirmed-banner">
            <div className="confirmed-icon-circle">
              <Check size={28} />
            </div>
            <h4>Soundtrack Uploaded & Attached!</h4>
            <p>
              {foundTrack?.name} is now playing and attached to{" "}
              <strong>{targetTitle}</strong> in your living magazine.
            </p>
            <button
              type="button"
              className="confirmed-done-btn"
              onClick={cancelMusicPick}
            >
              Return to Book
            </button>
          </div>
        )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

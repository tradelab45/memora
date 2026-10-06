"use client";

import { useSyncExternalStore } from "react";

export interface TrackItem {
  id: string;
  name: string;
  note: string;
  src: string;
}

export const BUILTIN_TRACKS: readonly TrackItem[] = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    note: "Warm, slow acoustic glow",
    src: "/music/golden-hour.mp3",
  },
  {
    id: "quiet-day",
    name: "Quiet Day",
    note: "Soft strings with distant rain",
    src: "/music/quiet-day.mp3",
  },
  {
    id: "after-dark",
    name: "After Dark",
    note: "Low, dreamy twilight tape loops",
    src: "/music/after-dark.mp3",
  },
] as const;

export type TrackRef =
  | { kind: "builtin"; id: string }
  | { kind: "file"; id: string; name: string }
  | null;

export type MusicMode = "book" | "photo";

export interface MusicState {
  on: boolean;
  mode: MusicMode;
  bookSong: TrackRef;
  photoSongs: Record<string, TrackRef>;
  volume: number;
  playingLabel: string;
  activeContextId: string;
}

const STORAGE_KEY = "memora-soundtrack-state";
const DB_NAME = "memora-audio-storage";
const MAX_FILE_BYTES = 35 * 1024 * 1024; // 35 MB

function loadStoredState(): Pick<
  MusicState,
  "mode" | "bookSong" | "photoSongs" | "volume"
> {
  if (typeof window === "undefined") {
    return {
      mode: "book",
      bookSong: { kind: "builtin", id: "golden-hour" },
      photoSongs: {},
      volume: 0.45,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        mode: parsed.mode === "photo" ? "photo" : "book",
        bookSong: parsed.bookSong ?? { kind: "builtin", id: "golden-hour" },
        photoSongs: parsed.photoSongs ?? {},
        volume: typeof parsed.volume === "number" ? parsed.volume : 0.45,
      };
    }
  } catch {
    // fallback to defaults
  }
  return {
    mode: "book",
    bookSong: { kind: "builtin", id: "golden-hour" },
    photoSongs: {},
    volume: 0.45,
  };
}

let currentState: MusicState = {
  on: false,
  playingLabel: "",
  activeContextId: "",
  ...loadStoredState(),
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeMusic(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getMusicState(): MusicState {
  return currentState;
}

export function useMusic(): MusicState {
  return useSyncExternalStore(subscribeMusic, getMusicState, () => currentState);
}

function persistState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: currentState.mode,
        bookSong: currentState.bookSong,
        photoSongs: currentState.photoSongs,
        volume: currentState.volume,
      }),
    );
  } catch {
    // quota or privacy block
  }
}

/* ---------------- IndexedDB File Storage for Custom Music ---------------- */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("audio_files", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeAudioFile(id: string, name: string, blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("audio_files", "readwrite");
    tx.objectStore("audio_files").put({ id, name, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function retrieveAudioFile(id: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction("audio_files", "readonly");
      const req = tx.objectStore("audio_files").get(id);
      req.onsuccess = () => resolve((req.result?.blob as Blob) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function addCustomAudioFile(
  file: File,
): Promise<TrackRef | "too-large" | "invalid-format"> {
  if (
    !file.type.startsWith("audio/") &&
    !/\.(mp3|m4a|aac|wav|ogg|opus|flac)$/i.test(file.name)
  ) {
    return "invalid-format";
  }
  if (file.size > MAX_FILE_BYTES) return "too-large";

  const cleanName = file.name.replace(/\.[^.]+$/, "");
  const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await storeAudioFile(id, cleanName, file);
  return { kind: "file", id, name: cleanName };
}

/* ---------------- Audio Playback Engine ---------------- */

let audioElement: HTMLAudioElement | null = null;
let currentTrackKey = "";
const blobUrlCache = new Map<string, string>();
let syncToken = 0;

export function getTrackDisplayName(track: TrackRef): string {
  if (!track) return "None (Muted)";
  if (track.kind === "builtin") {
    const item = BUILTIN_TRACKS.find((b) => b.id === track.id);
    return item ? item.name : track.id;
  }
  return track.name;
}

async function resolveAudioSource(
  track: Exclude<TrackRef, null>,
): Promise<string | null> {
  if (track.kind === "builtin") {
    const item = BUILTIN_TRACKS.find((b) => b.id === track.id);
    return item?.src ?? `/music/${track.id}.mp3`;
  }
  if (blobUrlCache.has(track.id)) {
    return blobUrlCache.get(track.id)!;
  }
  const blob = await retrieveAudioFile(track.id);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  blobUrlCache.set(track.id, url);
  return url;
}

function getTrackKey(track: TrackRef): string {
  return track ? `${track.kind}:${track.id}` : "";
}

function fadeAudio(
  el: HTMLAudioElement,
  targetVolume: number,
  durationMs: number,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;
  const startVolume = el.volume;
  const startTime = performance.now();

  const timer = window.setInterval(() => {
    const rawProgress = Math.min(1, (performance.now() - startTime) / durationMs);
    // Smooth S-curve / equal power interpolation
    const progress = 0.5 * (1 - Math.cos(rawProgress * Math.PI));
    const currentVol = Math.max(0, Math.min(1, startVolume + (targetVolume - startVolume) * progress));
    el.volume = currentVol;
    if (rawProgress >= 1) {
      window.clearInterval(timer);
      onComplete?.();
    }
  }, 25);
}

function determineActiveTrack(): TrackRef {
  if (!currentState.on) return null;
  if (currentState.mode === "photo" && currentState.activeContextId) {
    return (
      currentState.photoSongs[currentState.activeContextId] ??
      currentState.bookSong
    );
  }
  return currentState.bookSong;
}

async function syncPlayback() {
  if (typeof window === "undefined") return;
  const wantedTrack = determineActiveTrack();
  const trackKey = getTrackKey(wantedTrack);

  if (
    trackKey === currentTrackKey &&
    (audioElement ? !audioElement.paused || !wantedTrack : true)
  ) {
    return;
  }

  const thisToken = ++syncToken;
  currentTrackKey = trackKey;
  const oldAudio = audioElement;

  if (!wantedTrack) {
    if (oldAudio) {
      fadeAudio(oldAudio, 0, 450, () => {
        oldAudio.pause();
      });
    }
    currentState = { ...currentState, playingLabel: "" };
    notify();
    return;
  }

  const sourceUrl = await resolveAudioSource(wantedTrack);
  if (thisToken !== syncToken) return;

  if (!sourceUrl) {
    currentState = { ...currentState, playingLabel: "" };
    notify();
    return;
  }

  const newAudio = new Audio(sourceUrl);
  newAudio.loop = true;
  newAudio.volume = 0;

  try {
    await newAudio.play();
  } catch {
    // Autoplay blocked by browser policy
    currentState = { ...currentState, playingLabel: "" };
    notify();
    return;
  }

  if (thisToken !== syncToken) {
    newAudio.pause();
    return;
  }

  if (oldAudio && oldAudio !== newAudio) {
    fadeAudio(oldAudio, 0, 500, () => {
      oldAudio.pause();
    });
  }

  audioElement = newAudio;
  fadeAudio(newAudio, currentState.volume, 700);
  currentState = {
    ...currentState,
    playingLabel: getTrackDisplayName(wantedTrack),
  };
  notify();
}

/* ---------------- Public Music Controls ---------------- */

export function toggleMusic(): boolean {
  return setMusicActive(!currentState.on);
}

export function setMusicActive(active: boolean): boolean {
  currentState = { ...currentState, on: active };
  notify();
  void syncPlayback();
  return currentState.on;
}

export function setMusicMode(mode: MusicMode) {
  currentState = { ...currentState, mode };
  persistState();
  notify();
  void syncPlayback();
}

export function setBookTrack(track: TrackRef) {
  currentState = { ...currentState, bookSong: track };
  persistState();
  notify();
  void syncPlayback();
}

export function setPhotoTrack(photoId: string, track: TrackRef) {
  const updatedPhotos = { ...currentState.photoSongs };
  if (track) {
    updatedPhotos[photoId] = track;
  } else {
    delete updatedPhotos[photoId];
  }
  // When explicitly assigning a track to a photo, enable photo mode
  currentState = {
    ...currentState,
    photoSongs: updatedPhotos,
    mode: track ? "photo" : currentState.mode,
  };
  persistState();
  notify();
  void syncPlayback();
}

export function setMusicVolume(volume: number) {
  const bounded = Math.max(0, Math.min(1, volume));
  currentState = { ...currentState, volume: bounded };
  if (audioElement && currentState.on) {
    audioElement.volume = bounded;
  }
  persistState();
  notify();
}

export function setActivePhotoContext(photoId: string) {
  if (photoId === currentState.activeContextId) return;
  currentState = { ...currentState, activeContextId: photoId };
  if (currentState.mode === "photo") {
    void syncPlayback();
  }
}

export function getTrackForPhoto(photoId: string): TrackRef {
  return currentState.photoSongs[photoId] ?? null;
}

let currentMusicOwner: string | null = null;
export function setMusicOwner(ownerId: string | null): void {
  currentMusicOwner = ownerId;
}
export function getMusicOwner(): string | null {
  return currentMusicOwner;
}


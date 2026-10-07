"use client";

import { useSyncExternalStore } from "react";
import {
  setPhotoTrack,
  setBookTrack,
  setMusicActive,
  searchUrl,
  resolveSongLink,
  parseSongLink,
  type Service,
  type LinkTrack,
  SERVICE_NAME,
} from "./music";
import { memories } from "./content";

export type PickPhase = "idle" | "search" | "waiting" | "found" | "confirmed";

export interface SongPickState {
  phase: PickPhase;
  service: Service;
  targetPhotoId: string; // "" for whole magazine / book
  targetTitle: string;
  targetImage: string;
  query: string;
  foundTrack: LinkTrack | null;
  note: string;
}

const DEFAULT_STATE: SongPickState = {
  phase: "idle",
  service: "spotify",
  targetPhotoId: "",
  targetTitle: "Whole Living Book",
  targetImage: "/images/friends.jpg",
  query: "Nostalgic acoustic memories",
  foundTrack: null,
  note: "",
};

let currentState: SongPickState = { ...DEFAULT_STATE };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeMusicPick(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getMusicPickState(): SongPickState {
  return currentState;
}

export function useMusicPick(): SongPickState {
  return useSyncExternalStore(
    subscribeMusicPick,
    getMusicPickState,
    () => DEFAULT_STATE,
  );
}

function updateState(partial: Partial<SongPickState>) {
  currentState = { ...currentState, ...partial };
  notify();
}

/** Pre-populated curated tracks from Spotify, Apple Music & YouTube Music for instantaneous one-click search & pick */
export interface SuggestedTrack {
  id: string;
  title: string;
  artist: string;
  service: Service;
  mood: string;
  url: string;
}

export const SUGGESTED_TRACKS: SuggestedTrack[] = [
  {
    id: "sp-sparks",
    title: "Sparks",
    artist: "Coldplay",
    service: "spotify",
    mood: "Warm & Nostalgic",
    url: "https://open.spotify.com/track/7D0RhFdoQVUpAVXd0EQPvx",
  },
  {
    id: "sp-golden-hour",
    title: "golden hour",
    artist: "JVKE",
    service: "spotify",
    mood: "Sunlight & Golden Hour",
    url: "https://open.spotify.com/track/4yNk9il9NiJIRZeAJNoPtP",
  },
  {
    id: "am-nuvole",
    title: "Nuvole Bianche",
    artist: "Ludovico Einaudi",
    service: "apple",
    mood: "Reflective Piano",
    url: "https://music.apple.com/us/album/nuvole-bianche/1440763263?i=1440763276",
  },
  {
    id: "am-cardigan",
    title: "cardigan (acoustic)",
    artist: "Taylor Swift",
    service: "apple",
    mood: "Vintage Folklore",
    url: "https://music.apple.com/us/album/cardigan/1524782827?i=1524782834",
  },
  {
    id: "yt-texas-sun",
    title: "Texas Sun",
    artist: "Leon Bridges & Khruangbin",
    service: "youtube",
    mood: "Desert Roadtrip",
    url: "https://music.youtube.com/watch?v=0k1L2b_F3eA",
  },
  {
    id: "yt-anchor",
    title: "Anchor",
    artist: "Novo Amor",
    service: "youtube",
    mood: "Acoustic Seaside",
    url: "https://music.youtube.com/watch?v=OMBpUa7X2l8",
  },
];

export const MOOD_SEARCH_IDEAS = [
  "Acoustic roadtrip with dad",
  "Warm summer afternoon sunset",
  "Gentle piano for quiet memories",
  "Slow strings & tape loops",
  "Indie folk memories playlist",
  "Lo-fi beats for reflection",
];

/** Resolves photo title & preview image from memory ID */
function resolvePhotoInfo(photoId: string): { title: string; image: string } {
  if (!photoId) {
    return {
      title: "Whole Magazine & Book",
      image: "/images/friends.jpg",
    };
  }
  const mem = memories.find((m) => m.id === photoId);
  if (mem) {
    return {
      title: mem.title,
      image: mem.image,
    };
  }
  return {
    title: "Selected Memory Photo",
    image: "/images/coast.jpg",
  };
}

/** Initiates the Music Pick / Search workflow */
export function startMusicPick({
  service = "spotify",
  targetPhotoId = "",
  targetTitle,
  targetImage,
  initialQuery,
}: {
  service?: Service;
  targetPhotoId?: string;
  targetTitle?: string;
  targetImage?: string;
  initialQuery?: string;
} = {}) {
  const resolved = resolvePhotoInfo(targetPhotoId);
  updateState({
    phase: "search",
    service,
    targetPhotoId,
    targetTitle: targetTitle || resolved.title,
    targetImage: targetImage || resolved.image,
    query: initialQuery || resolved.title,
    foundTrack: null,
    note: "",
  });
}

/** Sets search query string */
export function setPickQuery(query: string) {
  updateState({ query });
}

/** Switches service (Spotify, Apple Music, YouTube Music) */
export function setPickService(service: Service) {
  updateState({ service });
}

/** Changes target photo */
export function setPickTargetPhoto(targetPhotoId: string) {
  const resolved = resolvePhotoInfo(targetPhotoId);
  updateState({
    targetPhotoId,
    targetTitle: resolved.title,
    targetImage: resolved.image,
  });
}

/** Opens the streaming app / search web bar in that service and sets phase to waiting */
export function launchMusicAppSearch(service?: Service) {
  const s = service || currentState.service;
  const url = searchUrl(s, currentState.query);
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
  updateState({
    service: s,
    phase: "waiting",
    note: `Search bar launched in ${SERVICE_NAME[s]}. Find your song, copy its link, or choose from suggestions below.`,
  });
}

/** User selected a proposed track (or pasted link). Moves to Arrow Mark confirmation stage! */
export function proposeTrackForAttachment(track: LinkTrack) {
  updateState({
    foundTrack: track,
    phase: "found",
    note: "",
  });
}

/** User pasted or typed link manually */
export async function submitSongLink(rawUrl: string): Promise<boolean> {
  if (!rawUrl.trim()) return false;
  const parsed = parseSongLink(rawUrl);
  if (!parsed) {
    updateState({
      note: "That does not look like a valid Spotify, Apple Music, or YouTube link.",
    });
    return false;
  }
  const resolved = await resolveSongLink(rawUrl);
  proposeTrackForAttachment(resolved || parsed);
  return true;
}

/** Confirms song attachment — uploads and sets track for the photo or magazine */
export function confirmSongAttachment() {
  const track = currentState.foundTrack;
  if (!track) return;

  if (currentState.targetPhotoId) {
    setPhotoTrack(currentState.targetPhotoId, track);
  } else {
    setBookTrack(track);
  }
  setMusicActive(true);

  updateState({
    phase: "confirmed",
    note: `Song “${track.name}” is now successfully uploaded and attached!`,
  });

  // Auto-dismiss confirmed state after 3.5s
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      if (currentState.phase === "confirmed") {
        updateState({ phase: "idle", foundTrack: null });
      }
    }, 3500);
  }
}

/** User rejects current proposed track and wants to pick another */
export function rejectProposedTrack() {
  updateState({
    foundTrack: null,
    phase: "search",
    note: "",
  });
}

/** Closes and cancels picker */
export function cancelMusicPick() {
  updateState({
    phase: "idle",
    foundTrack: null,
    note: "",
  });
}

/** Helper to test clipboard for links when returning to window */
if (typeof window !== "undefined") {
  window.addEventListener("focus", async () => {
    if (currentState.phase !== "waiting") return;
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        const parsed = parseSongLink(text);
        if (parsed) {
          proposeTrackForAttachment(parsed);
        }
      }
    } catch {
      // clipboard access not permitted
    }
  });
}

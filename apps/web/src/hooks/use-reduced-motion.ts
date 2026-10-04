"use client";
import { useSyncExternalStore } from "react";
let paused = false;
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  listeners.add(callback);
  return () => {
    media.removeEventListener("change", callback);
    listeners.delete(callback);
  };
}
export function setMotionPaused(value: boolean) {
  paused = value;
  listeners.forEach((callback) => callback());
}
export function useDeviceReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () =>
      paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

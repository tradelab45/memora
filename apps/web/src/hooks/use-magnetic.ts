"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pulls an element smoothly toward the cursor while hovered.
 * Fine pointers only; disabled under reduced motion.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.24) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || reduced) return;

    const el = ref.current;
    if (!el || !strength) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;
    let rafId = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (isHovered || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        el.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) * strength;
      targetY = (e.clientY - centerY) * strength;

      if (!isHovered) {
        isHovered = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      isHovered = false;
    };

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.style.transform = "translate3d(0, 0, 0)";
    };
  }, [ref, strength]);
}

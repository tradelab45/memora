"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CursorHalo() {
  const reduced = useReducedMotion();
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    if (reduced || !halo) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let targetX = 0;
    let targetY = 0;
    let haloX = 0;
    let haloY = 0;
    let targetScale = 1;
    let scale = 1;
    let opacity = "0.12";
    let frame = 0;
    let initialized = false;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      initialized = false;
      halo.style.opacity = "0";
    };

    const animate = () => {
      frame = 0;
      haloX += (targetX - haloX) * 0.2;
      haloY += (targetY - haloY) * 0.2;
      scale += (targetScale - scale) * 0.2;
      halo.style.transform = `translate3d(${haloX - 160}px, ${haloY - 160}px, 0) scale(${scale})`;
      halo.style.opacity = opacity;
      const unsettled =
        Math.abs(targetX - haloX) + Math.abs(targetY - haloY) > 0.2 ||
        Math.abs(targetScale - scale) > 0.002;
      if (unsettled) frame = requestAnimationFrame(animate);
    };

    const onMove = (event: PointerEvent) => {
      if (!pointer.matches || event.pointerType !== "mouse" || document.hidden)
        return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!initialized) {
        haloX = targetX;
        haloY = targetY;
        initialized = true;
      }
      const interactive =
        event.target instanceof Element &&
        !!event.target.closest("button, a, input, textarea, [data-tilt]");
      targetScale = interactive ? 1.2 : 1;
      opacity = interactive ? "0.2" : "0.12";
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const onExit = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const onVisibility = () => {
      if (document.hidden) hide();
    };
    const onPointerChange = () => {
      if (!pointer.matches) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onExit);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibility);
    pointer.addEventListener("change", onPointerChange);
    return () => {
      hide();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onExit);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      pointer.removeEventListener("change", onPointerChange);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div
      ref={haloRef}
      className="cursor-halo"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 320,
        height: 320,
        opacity: 0,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 998,
        background:
          "radial-gradient(circle, rgba(212, 133, 102, 0.45) 0%, rgba(243, 236, 223, 0.1) 45%, transparent 70%)",
        mixBlendMode: "multiply",
        transition: "opacity 0.25s ease",
      }}
    />
  );
}

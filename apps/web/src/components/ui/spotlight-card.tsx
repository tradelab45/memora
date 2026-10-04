"use client";
import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderBeam?: boolean;
  tilt?: boolean;
  as?: "div" | "article" | "section";
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(155, 73, 50, 0.12)",
  borderBeam = false,
  tilt = true,
  as = "div",
  style,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const Component = as;
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const reset = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    const card = cardRef.current;
    if (!card) return;
    card.dataset.hovered = "false";
    card.style.setProperty("--spotlight-opacity", "0");
    card.style.transform = "";
    card.style.transition = "transform 0.45s ease";
  };

  useEffect(() => {
    const card = cardRef.current;
    if (reduced && card) {
      card.dataset.hovered = "false";
      card.style.setProperty("--spotlight-opacity", "0");
      card.style.transform = "";
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [reduced]);

  const pointerEnabled = (event: React.PointerEvent<HTMLDivElement>) =>
    !reduced &&
    event.pointerType === "mouse" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!pointerEnabled(event)) return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = pointRef.current.x - rect.left;
      const y = pointRef.current.y - rect.top;
      card.style.setProperty("--spotlight-x", x + "px");
      card.style.setProperty("--spotlight-y", y + "px");
      card.style.setProperty("--spotlight-opacity", "1");
      card.dataset.hovered = "true";
      if (tilt) {
        const rx = (y / Math.max(rect.height, 1) - 0.5) * -6;
        const ry = (x / Math.max(rect.width, 1) - 0.5) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
        card.style.transition = "transform 0.15s ease-out";
      }
    });
  };

  return (
    <Component
      {...props}
      ref={cardRef}
      data-reduced={reduced}
      onPointerMove={move}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (pointerEnabled(event)) move(event);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        reset();
      }}
      className={`spotlight-card ${borderBeam && !reduced ? "has-border-beam" : ""} ${className}`}
      style={style}
    >
      <div
        className="spotlight-layer"
        aria-hidden="true"
        style={{
          opacity: reduced ? 0 : "var(--spotlight-opacity, 0)",
          background: `radial-gradient(550px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 65%)`,
        }}
      />
      {borderBeam && !reduced && (
        <div className="border-beam-layer" aria-hidden="true">
          <div className="border-beam-glow" />
        </div>
      )}
      <div className="glass-refraction" aria-hidden="true" />
      <div className="spotlight-card-content">{children}</div>
    </Component>
  );
}

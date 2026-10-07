"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Video, Sparkles, Camera } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "./veo-cinema.css";

export interface VeoCinemaProps {
  image: string;
  alt: string;
  memoryId: string;
  title: string;
  date?: string;
  initialLiving?: boolean;
  className?: string;
  decorative?: boolean;
  showControls?: boolean;
  showArgonMetadata?: boolean;
  aspectRatio?: "16/9" | "1/1" | "4/3" | "fill";
  onToggleLiving?: (active: boolean) => void;
}

// Curated Veo 3.1 Generative Cinematography Prompts for each memory
const VEO_PROMPTS: Record<
  string,
  {
    prompt: string;
    camera: string;
    motionStyle: string;
    particles: string;
    exif: string;
    grading: string;
  }
> = {
  coast: {
    prompt:
      "Veo 3.1 Generative Cinema: Slow golden-hour coastal pan, soft rhythmic tide undulating on wet sand, warm sun glare reflecting off gentle ripples, 35mm cinematic depth.",
    camera: "Leica M11 · Summilux 35mm f/1.4 ASPH",
    motionStyle: "Ambient Coastal Swell · 60 FPS",
    particles: "Salt mist & golden sun motes",
    exif: "1/500s · f/1.4 · ISO 64 · 14-bit DNG",
    grading: "Kodachrome 64 Warm Gold",
  },
  mountains: {
    prompt:
      "Veo 3.1 Generative Cinema: Serene mountain horizon with drifting alpine mist, soft sunlight filtering through jagged ridges, subtle camera drift with atmospheric haze.",
    camera: "Hasselblad X2D 100C · XCD 55mm f/2.5",
    motionStyle: "Alpine Horizon Drift · 60 FPS",
    particles: "Micro-mist motes & cold sun rays",
    exif: "1/1000s · f/4.0 · ISO 100 · 16-bit Raw",
    grading: "Ektachrome 100 High Altitude",
  },
  flowers: {
    prompt:
      "Veo 3.1 Generative Cinema: Delicate pink cherry blossoms swaying gently in summer wind, dappled specular highlights, subtle lens bokeh flutter and drifting flower pollen.",
    camera: "Sony A7R V · FE 50mm f/1.2 GM",
    motionStyle: "Wind-blown Petal Sway · 60 FPS",
    particles: "Sunlit pollen & soft bokeh flares",
    exif: "1/800s · f/1.2 · ISO 100 · Compressed Raw",
    grading: "Fujichrome Provia Soft Pastel",
  },
  friends: {
    prompt:
      "Veo 3.1 Generative Cinema: Warm afternoon gathering, ambient laughter reverberation, golden backlight through hair, organic handheld breathing camera movement.",
    camera: "Canon R5 II · RF 28-70mm f/2L USM",
    motionStyle: "Organic Handheld Breathing · 60 FPS",
    particles: "Warm indoor dust motes in sunbeam",
    exif: "1/250s · f/2.0 · ISO 200 · 14-bit Raw",
    grading: "CineStill 800T Warm Nostalgia",
  },
};

export function VeoCinema({
  image,
  alt,
  memoryId,
  title,
  date,
  initialLiving = false,
  className = "",
  decorative = false,
  showControls = true,
  showArgonMetadata = true,
  aspectRatio = "fill",
  onToggleLiving,
}: VeoCinemaProps) {
  const [isLiving, setIsLiving] = useState(initialLiving);
  const [speed, setSpeed] = useState<0.5 | 1.0 | 1.5>(1.0);
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  const metadata = VEO_PROMPTS[memoryId] || VEO_PROMPTS.coast;

  // Sync living state changes with parent
  const handleToggleLiving = () => {
    const next = !isLiving;
    setIsLiving(next);
    onToggleLiving?.(next);
  };

  // Film grain & living motes generative canvas effect
  useEffect(() => {
    if (!isLiving || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 300);

    // Mote particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4 * speed,
      vy: -(Math.random() * 0.6 + 0.2) * speed,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.45 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Organic Motes / Light Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03 * speed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;

        const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 246, 218, ${currentAlpha})`;
        ctx.shadowColor = "rgba(255, 220, 160, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 400;
      height = canvas.height = canvas.offsetHeight || 300;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLiving, speed, reducedMotion]);

  return (
    <div
      className={`veo-cinema-wrapper ${isLiving ? "is-living" : "is-still"} ${
        reducedMotion ? "is-reduced-motion" : ""
      } aspect-${aspectRatio} ${className}`}
      data-speed={speed}
      data-memory-id={memoryId}
    >
      {/* Base Image with Living Breathing Drift */}
      <div className={`veo-image-stage ${isLiving ? "is-drifting" : ""}`}>
        <Image
          src={image}
          alt={decorative ? "" : alt}
          fill
          priority={memoryId === "coast"}
          sizes="(max-width: 760px) 94vw, 640px"
          className="veo-main-img"
        />

        {/* Generative Volumetric Light Leak & Rim Warmth */}
        {isLiving && !reducedMotion && (
          <>
            <div className="veo-light-leak veo-leak-left" aria-hidden="true" />
            <div className="veo-light-leak veo-leak-right" aria-hidden="true" />
            <div className="veo-anamorphic-flare" aria-hidden="true" />
            <canvas ref={canvasRef} className="veo-particles-canvas" aria-hidden="true" />
          </>
        )}
      </div>

      {/* Argon4 Telemetry Ribbon (Top) */}
      {showArgonMetadata && (
        <div className="veo-argon-ribbon">
          <div className="argon-pill argon-camera">
            <Camera size={10} className="argon-icon" />
            <span>{metadata.camera}</span>
          </div>
          <div className="argon-pill argon-exif">
            <span>{metadata.exif}</span>
          </div>
          <div className="argon-pill argon-profile">
            <span>{metadata.grading}</span>
          </div>
        </div>
      )}

      {/* Date & Plate Tag (Left Bottom) */}
      {date && <span className="veo-plate-date">{date}</span>}

      {/* Live Cinema Director Bar (Bottom Controls) */}
      {showControls && !decorative && (
        <div className="veo-director-bar">
          {/* Main Veo 3.1 Toggle Button */}
          <button
            type="button"
            className={`veo-toggle-btn ${isLiving ? "is-active" : ""}`}
            onClick={handleToggleLiving}
            title={
              isLiving
                ? "Switch back to static archival photograph"
                : "Bring to life with Google Veo 3.1 generative cinema loop"
            }
            aria-pressed={isLiving}
            aria-label={`${
              isLiving ? "Pause" : "Activate"
            } Veo 3.1 Living Cinema for ${title}`}
          >
            <span className="veo-rec-indicator">
              <span className={`veo-rec-dot ${isLiving ? "is-pulsing" : ""}`} />
            </span>
            <Video size={12} className="veo-btn-icon" />
            <span className="veo-btn-label">
              {isLiving ? "Veo 3.1 Living Cinema" : "Living Cinema 3.1"}
            </span>
          </button>

          {/* Speed & Prompt Controls (Shown when Living is Active) */}
          {isLiving && (
            <div className="veo-director-cluster">
              <div
                className="veo-speed-selector"
                role="group"
                aria-label="Cinema motion speed"
              >
                {([0.5, 1.0, 1.5] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`speed-pill-btn ${speed === s ? "is-selected" : ""}`}
                    onClick={() => setSpeed(s)}
                    aria-label={`Set motion speed to ${s}x`}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="veo-prompt-info-btn"
                onClick={() => setShowPromptInspector((p) => !p)}
                title="View Google Veo 3.1 cinematography prompt"
                aria-label="Inspect Veo 3.1 generation prompt"
                aria-expanded={showPromptInspector}
              >
                <Sparkles size={11} />
                <span>Prompt</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Veo 3.1 Prompt Inspector Overlay Modal */}
      {showPromptInspector && (
        <div className="veo-prompt-sheet" role="region" aria-label="Veo 3.1 Generation Telemetry">
          <div className="veo-prompt-header">
            <div className="veo-prompt-kicker">
              <Sparkles size={11} />
              <span>GOOGLE VEO 3.1 ARCHIVAL CINEMA SPEC</span>
            </div>
            <button
              type="button"
              className="veo-prompt-close"
              onClick={() => setShowPromptInspector(false)}
              aria-label="Close prompt telemetry"
            >
              ✕
            </button>
          </div>
          <p className="veo-prompt-text">{metadata.prompt}</p>
          <div className="veo-telemetry-grid">
            <div>
              <strong>MOTION SYNTHESIS</strong>
              <span>{metadata.motionStyle}</span>
            </div>
            <div>
              <strong>ATMOSPHERICS</strong>
              <span>{metadata.particles}</span>
            </div>
            <div>
              <strong>COLOR PROFILE</strong>
              <span>DCI-P3 14-Bit · Rec.709 Master</span>
            </div>
            <div>
              <strong>FRAME RESOLUTION</strong>
              <span>4K UHD (3840 × 2160) · 60 FPS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

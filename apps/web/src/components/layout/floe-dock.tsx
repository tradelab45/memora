"use client";

import { useState } from "react";
import {
  Video,
  BookOpen,
  Music,
  Sparkles,
  Printer,
} from "lucide-react";
import { playSubtleClick } from "@/lib/audio";
import { startMusicPick } from "@/lib/music-pick";
import "./floe-dock.css";

export interface FloeDockProps {
  livingCinemaActive?: boolean;
  pomelliActive?: boolean;
  onToggleLivingCinema?: () => void;
  onTogglePomelli?: () => void;
  onOpenPrintSpecs?: () => void;
  onOpenSoundtrack?: () => void;
  className?: string;
}

export function FloeDock({
  livingCinemaActive = false,
  pomelliActive = true,
  onToggleLivingCinema,
  onTogglePomelli,
  onOpenPrintSpecs,
  onOpenSoundtrack,
  className = "",
}: FloeDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = [
    {
      id: "veo",
      icon: Video,
      label: livingCinemaActive ? "Veo 3.1 Cinema: Active" : "Veo 3.1 Living Cinema",
      active: livingCinemaActive,
      badge: "3.1",
      onClick: () => {
        playSubtleClick();
        if (onToggleLivingCinema) {
          onToggleLivingCinema();
        } else {
          const flipTrigger = document.querySelector<HTMLButtonElement>(
            'button[aria-haspopup="dialog"], .book-peek-trigger, [aria-label*="sample"]'
          );
          if (flipTrigger) flipTrigger.click();
        }
      },
    },
    {
      id: "pomelli",
      icon: BookOpen,
      label: pomelliActive ? "Pomelli Spread: On" : "Pomelli Italian Editorial",
      active: pomelliActive,
      badge: "Pomelli",
      onClick: () => {
        playSubtleClick();
        if (onTogglePomelli) {
          onTogglePomelli();
        } else {
          const flipTrigger = document.querySelector<HTMLButtonElement>(
            'button[aria-haspopup="dialog"], .book-peek-trigger, [aria-label*="sample"]'
          );
          if (flipTrigger) flipTrigger.click();
        }
      },
    },
    {
      id: "soundtrack",
      icon: Music,
      label: "Music & Arrow Attach",
      active: false,
      badge: "Score",
      onClick: () => {
        playSubtleClick();
        if (onOpenSoundtrack) {
          onOpenSoundtrack();
        } else {
          startMusicPick();
        }
      },
    },
    {
      id: "specs",
      icon: Printer,
      label: "Argon4 Print Specs",
      active: false,
      badge: "Argon4",
      onClick: () => {
        playSubtleClick();
        if (onOpenPrintSpecs) {
          onOpenPrintSpecs();
        } else {
          const flipTrigger = document.querySelector<HTMLButtonElement>(
            'button[aria-haspopup="dialog"], .book-peek-trigger, [aria-label*="sample"]'
          );
          if (flipTrigger) flipTrigger.click();
          window.setTimeout(() => {
            const printSpecs = document.querySelector<HTMLButtonElement>(
              ".reader-print-specs-btn, [aria-label*='fine-art print']"
            );
            if (printSpecs) printSpecs.click();
          }, 350);
        }
      },
    },
  ];

  return (
    <nav
      className={`floe-dock-container ${className}`}
      aria-label="Google Floe Design & Cinema Tools"
    >
      <div className="floe-dock-pill">
        <div className="floe-dock-brand" title="Google Floe / Flow Fluid Dock">
          <Sparkles size={11} className="floe-brand-icon" />
          <span className="floe-brand-name">Floe</span>
        </div>

        <div className="floe-dock-items-row" role="toolbar" aria-label="Experience Mode Controls">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === idx;

            return (
              <button
                key={item.id}
                type="button"
                className={`floe-dock-btn ${item.active ? "is-active" : ""} ${
                  isHovered ? "is-hovered" : ""
                }`}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-pressed={item.active}
                aria-label={item.label}
              >
                <Icon size={15} className="floe-btn-icon" />
                <span className="floe-btn-badge">{item.badge}</span>
                {isHovered && (
                  <span className="floe-tooltip" role="tooltip">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

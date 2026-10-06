"use client";

import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useReducedMotion,
  useDeviceReducedMotion,
  setMotionPaused,
} from "@/hooks/use-reduced-motion";
import { useMusic } from "@/lib/music";
import {
  MusicSheetDialog,
  AnimatedEqualizer,
} from "@/components/music/music-sheet";
import { AuthToggle } from "@/components/auth/auth-toggle";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="MEMORA home">
      <span className="brand-symbol" aria-hidden="true">
        m.
      </span>
      MEMORA
    </Link>
  );
}

const links = [
  ["The idea", "/#idea"],
  ["Your people", "/#people"],
  ["The book", "/#books"],
] as const;

export function SiteHeader({ cinematic = false }: { cinematic?: boolean }) {
  const [open, setOpen] = useState(false);
  const [musicDialogOpen, setMusicDialogOpen] = useState(false);
  const reduced = useReducedMotion();
  const deviceReduced = useDeviceReducedMotion();
  const music = useMusic();

  const navigation = cinematic
    ? [
        ["The experience", "/#experience"],
        ["Your people", "/#people"],
        ["The book", "/#books"],
      ]
    : links;

  return (
    <>
      <header className="site-header">
        <div className="reading-progress" aria-hidden="true">
          <span data-reading-progress />
        </div>

        <Wordmark />

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions-group">
          {/* Soundtrack Toggle Pill */}
          <button
            type="button"
            className={`soundtrack-header-btn ${music.on ? "is-active" : ""}`}
            onClick={() => setMusicDialogOpen(true)}
            aria-label={
              music.on
                ? `Soundtrack playing: ${music.playingLabel || "Ambient"}. Open music settings`
                : "Open soundtrack settings"
            }
            title={
              music.on
                ? `Soundtrack playing: ${music.playingLabel || "Ambient"}`
                : "Soundtrack settings"
            }
          >
            <AnimatedEqualizer active={music.on} />
            <span className="soundtrack-header-label">
              {music.on ? "Music On" : "Soundtrack"}
            </span>
          </button>

          {/* Motion Pause Toggle */}
          <button
            className="motion-toggle"
            type="button"
            aria-label={
              deviceReduced
                ? "Motion reduced by device"
                : reduced
                  ? "Enable motion"
                  : "Pause motion"
            }
            aria-pressed={reduced}
            disabled={deviceReduced}
            title={
              deviceReduced
                ? "Your device prefers reduced motion"
                : reduced
                  ? "Enable animations"
                  : "Pause animations"
            }
            onClick={() => setMotionPaused(!reduced)}
          >
            {reduced ? <Play size={13} /> : <Pause size={13} />}
          </button>

          {/* Account and sign-in control */}
          <AuthToggle />

          {/* Main CTA */}
          <Button asChild size="sm" variant="outline" className="header-cta">
            <Link href="/studio">
              Start your story <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="mobile-nav-panel" data-lenis-prevent>
              <Dialog.Title className="eyebrow">MEMORA</Dialog.Title>
              <Dialog.Description className="sr-only">
                Explore MEMORA or sign in to your private story.
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="dialog-close"
                  aria-label="Close navigation"
                >
                  <X />
                </Button>
              </Dialog.Close>
              <nav aria-label="Mobile navigation">
                {[
                  ["Home", "/"],
                  ["Memories", "/studio?view=memories"],
                  ["People", "/studio?view=people"],
                  ["Your book", "/studio?view=book"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                ))}
                <Link href="/studio" onClick={() => setOpen(false)}>
                  Start your story ↗
                </Link>
                <button
                  type="button"
                  className="mobile-soundtrack-link"
                  onClick={() => {
                    setOpen(false);
                    setMusicDialogOpen(true);
                  }}
                >
                  🎵 Soundtrack settings
                </button>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Soundtrack Settings Dialog */}
        <MusicSheetDialog
          open={musicDialogOpen}
          onOpenChange={setMusicDialogOpen}
        />
      </header>
      <MobileBottomNav />
    </>
  );
}

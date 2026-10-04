"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles, Compass, Eye, Heart, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { playAmbientChime, playSubtleClick } from "@/lib/audio";
import "./deep-dive-portal.css";

export function DeepDivePortal() {
  const containerRef = useRef<HTMLElement>(null);
  const portalImageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isDived, setIsDived] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (
      reduced ||
      isDived ||
      !window.matchMedia("(min-width: 900px) and (pointer: fine)").matches
    )
      return;
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    const image = portalImageRef.current;
    if (!container || !image) return;
    // Scroll moves only the photograph. Opening the journal is always intentional.
    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: 1 },
        {
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        },
      );
    }, container);
    return () => context.revert();
  }, [reduced, isDived]);

  const toggleJournal = () => {
    const next = !isDived;
    if (next) playAmbientChime();
    else playSubtleClick();
    setIsDived(next);
  };

  return (
    <section
      ref={containerRef}
      className="deep-dive-section page-width"
      id="deep-dive"
      data-open={isDived}
      data-reduced={reduced}
      aria-labelledby="deep-dive-title"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isDived) {
          event.preventDefault();
          setIsDived(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="little-star">✳</span> A MOMENT, A LITTLE CLOSER
          </p>
          <h2 id="deep-dive-title" data-reveal>
            Step inside.
            <br />
            <em>The memory opens up.</em>
          </h2>
        </div>
        <p>
          A photograph holds a place. Your words bring back the feeling. Open
          this sample memory to see how the two come together.
        </p>
      </div>

      <div className="deep-dive-portal-wrapper">
        <div className="deep-dive-photo-portal" aria-hidden={isDived}>
          <div ref={portalImageRef} className="portal-photo-frame">
            <Image
              src="/images/coast.jpg"
              alt="An unhurried summer afternoon along the coast"
              fill
              sizes="(max-width: 900px) 95vw, 1100px"
            />
          </div>
          <div className="portal-overlay" />
          <div className="portal-frame-hud">
            <span className="portal-tag">
              <Compass size={13} aria-hidden="true" /> SAMPLE MEMORY · JUNE 14,
              2026
            </span>
            <span className="portal-subtag">THE LONG WAY HOME · WITH DAD</span>
          </div>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="portal-dive-trigger"
          onClick={toggleJournal}
          aria-label={
            isDived ? "Close the sample memory" : "Step inside the memory"
          }
          aria-expanded={isDived}
          aria-controls="sample-memory-journal"
        >
          {isDived ? (
            <X size={15} aria-hidden="true" />
          ) : (
            <Eye size={15} aria-hidden="true" />
          )}
          <span>{isDived ? "Close memory" : "Step inside"}</span>
        </button>

        <div
          id="sample-memory-journal"
          className={"deep-dive-inner-world " + (isDived ? "is-active" : "")}
          role="region"
          aria-label="Sample memory journal"
          hidden={!isDived}
          inert={!isDived}
        >
          <div className="inner-world-backdrop" aria-hidden="true" />
          <p className="portal-sample-note">
            A SAMPLE FROM THE DAYS BETWEEN · VOL. 01
          </p>
          <div className="inner-cards-grid">
            <SpotlightCard
              className="liquid-glass-card"
              borderBeam
              spotlightColor="rgba(212, 133, 102, 0.2)"
            >
              <span className="eyebrow">THE LIVING CHAPTER</span>
              <h3>The long way home.</h3>
              <p>
                “We missed the turn and found our favourite place. Dad said we
                should take the long way more often.”
              </p>
              <div className="card-badge-row">
                <span className="tag-pill">
                  <Heart size={11} aria-hidden="true" /> DAD
                </span>
                <span className="tag-pill">JUNE 14, 2026</span>
              </div>
            </SpotlightCard>
            <SpotlightCard
              className="liquid-glass-card"
              borderBeam
              spotlightColor="rgba(155, 73, 50, 0.12)"
            >
              <span className="eyebrow">A STORY WORTH KEEPING</span>
              <h3>A photo. Your words.</h3>
              <p>
                Choose your people, add one line, and bring a chapter together.
                This preview uses sample photos; recognition is designed to stay
                on your device by default.
              </p>
              <div className="card-badge-row">
                <span className="tag-pill">
                  <Sparkles size={11} aria-hidden="true" /> SAMPLE EXPERIENCE
                </span>
                <span className="tag-pill">YOUR WORDS</span>
              </div>
            </SpotlightCard>
          </div>
          <div className="inner-world-cta">
            <Button asChild data-magnetic>
              <Link href="/studio">
                Try the story studio <ArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

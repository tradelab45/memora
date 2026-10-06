"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookStage } from "@/components/book/book-stage";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AppPreview } from "./app-preview";
import "./cinematic-experience.css";

export function CinematicExperience() {
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [bookActive, setBookActive] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = root.current;
    if (!section || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (min-height: 600px)",
      () => {
        const app = section.querySelector<HTMLElement>(".cinema-app");
        const intro = section.querySelector<HTMLElement>(".cinema-intro");
        const memory = section.querySelector<HTMLElement>(".cinema-memory");
        if (!app || !intro || !memory) return;
        section.dataset.enhanced = "true";
        const update = () => {
          const value = timeline.progress();
          progressRef.current = value;
          setBookActive(value < 0.48);
          const chapter = value < 0.36 ? 0 : value < 0.77 ? 1 : 2;
          section.dataset.chapter = String(chapter);
          section.style.setProperty("--chapter-progress", String(value));
          // The app is interactive only after its reveal has completed.
          const appReady = value >= 0.86;
          app.inert = !appReady;
          app.setAttribute("aria-hidden", String(!appReady));
          intro.inert = value > 0.15;
        };
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 72px",
            end: "bottom bottom",
            scrub: 0.65,
          },
        });
        // Keep the final app chapter onscreen through the last part of the scroll.
        timeline.to({}, { duration: 1 }, 0);
        timeline.to(
          ".cinema-intro",
          { yPercent: -120, autoAlpha: 0, duration: 0.19 },
          0.035,
        );
        timeline.to(
          ".cinema-side-note",
          { autoAlpha: 0, y: -35, duration: 0.14 },
          0.03,
        );
        timeline.to(
          ".cinema-scrap-left",
          {
            xPercent: -150,
            yPercent: -70,
            rotation: -28,
            autoAlpha: 0,
            duration: 0.27,
          },
          0.025,
        );
        timeline.to(
          ".cinema-scrap-right",
          {
            xPercent: 155,
            yPercent: -90,
            rotation: 30,
            autoAlpha: 0,
            duration: 0.27,
          },
          0.025,
        );
        timeline.to(
          ".cinema-book",
          { scale: 2.8, yPercent: -12, duration: 0.39 },
          0.06,
        );
        timeline.to(".cinema-book", { autoAlpha: 0, duration: 0.09 }, 0.39);
        timeline.fromTo(
          memory,
          { autoAlpha: 0, clipPath: "inset(28% 35% 25% 35% round 3px)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.25,
          },
          0.32,
        );
        timeline.fromTo(
          ".cinema-memory-photo",
          { scale: 1.35 },
          { scale: 1, duration: 0.39 },
          0.34,
        );
        timeline.fromTo(
          ".cinema-memory-copy",
          { y: 70, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.13 },
          0.48,
        );
        timeline.to(
          ".cinema-memory-copy",
          { autoAlpha: 0, y: -40, duration: 0.09 },
          0.66,
        );
        timeline.to(
          memory,
          { scale: 0.84, borderRadius: 22, autoAlpha: 0, duration: 0.19 },
          0.7,
        );
        timeline.fromTo(
          ".cinema-app-heading",
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.1 },
          0.74,
        );
        timeline.fromTo(
          app,
          { y: 160, scale: 0.82, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.17 },
          0.7,
        );
        timeline.to(
          ".cinema-backdrop",
          { backgroundColor: "#e8dfd0", duration: 0.18 },
          0.69,
        );
        timeline.eventCallback("onUpdate", update);
        // Refresh restores tween positions with callbacks suppressed. Resync the
        // interactive layer and GPU state after that restoration completes.
        ScrollTrigger.addEventListener("refresh", update);
        update();
        ScrollTrigger.refresh();
        return () => {
          ScrollTrigger.removeEventListener("refresh", update);
          timeline.scrollTrigger?.kill();
          timeline.kill();
          section.dataset.enhanced = "false";
          section.dataset.chapter = "2";
          section.style.removeProperty("--chapter-progress");
          app.inert = false;
          app.removeAttribute("aria-hidden");
          intro.inert = false;
          progressRef.current = 0;
        };
      },
      root,
    );
    return () => media.revert();
  }, [reduced]);

  const jumpToApp = () => {
    const section = root.current;
    if (!section) return;
    if (section.dataset.enhanced === "true") {
      const top = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        top: top + section.offsetHeight - window.innerHeight,
        behavior: "instant",
      });
    } else
      section
        .querySelector(".cinema-app")
        ?.scrollIntoView({ behavior: "instant", block: "center" });
  };

  return (
    <section
      ref={root}
      id="experience"
      className="cinema-track"
      data-enhanced="false"
      data-chapter="2"
      data-preview-open={previewOpen}
      aria-label="From a keepsake to your memory space"
    >
      <div className="cinema-stage">
        <div className="cinema-backdrop" aria-hidden="true" />
        <div className="cinema-intro">
          <p className="cinema-kicker">
            <span /> A PERSONAL ARCHIVE OF FEELING
          </p>
          <h1>
            Life happens.
            <br />
            <em>Keep the feeling.</em>
          </h1>
          <Link href="#sign-in" className="mobile-quick-jump-pill">
            Start your story <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="cinema-book">
          <BookStage cinematic progressRef={progressRef} active={bookActive} />
        </div>
        <div className="cinema-scrap cinema-scrap-left" aria-hidden="true">
          <Image src="/images/friends.jpg" alt="" fill sizes="22vw" />
          <span>the people, always.</span>
        </div>
        <div className="cinema-scrap cinema-scrap-right" aria-hidden="true">
          <Image src="/images/flowers.jpg" alt="" fill sizes="18vw" />
          <span>ordinary. wonderful.</span>
        </div>
        <div className="cinema-side-note">
          <span>001 — THE EVERYDAY</span>
          <p>
            A home for your people.
            <br />
            And the moments between.
          </p>
          <Link href="/studio">
            Start your story <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="cinema-memory" aria-hidden="true">
          <div className="cinema-memory-photo">
            <Image src="/images/coast.jpg" alt="" fill sizes="100vw" priority />
          </div>
          <div className="cinema-memory-shade" />
          <div className="cinema-memory-copy">
            <span>JUNE 14, 2026 &nbsp; / &nbsp; WITH DAD</span>
            <p>
              We missed the turn.
              <br />
              <em>Found our place.</em>
            </p>
            <small>A PHOTO REMEMBERS THE VIEW. YOU REMEMBER THE FEELING.</small>
          </div>
          <Plus className="cinema-cross cross-one" size={18} />
          <Plus className="cinema-cross cross-two" size={18} />
        </div>
        <div className="cinema-mobile-actions">
          <p>Your photos. Your words. Your soundtrack.</p>
          <button
            type="button"
            aria-expanded={previewOpen}
            aria-controls="experience-app"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            {previewOpen ? "Close the sample" : "Explore a sample"}
            <ArrowDown size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="cinema-app-heading">
          <span>FROM SOMETHING YOU SAVED</span>
          <h2>
            To somewhere <em>you belong.</em>
          </h2>
        </div>
        <div className="cinema-app" id="experience-app">
          <AppPreview />
        </div>
        <div className="cinema-rail">
          <div className="cinema-chapters" aria-hidden="true">
            <span className="chapter-zero">01 &nbsp; THE BOOK</span>
            <span className="chapter-one">02 &nbsp; THE FEELING</span>
            <span className="chapter-two">03 &nbsp; YOUR SPACE</span>
          </div>
          <span className="cinema-scroll-cue">
            <ArrowDown size={15} /> SCROLL TO STEP INSIDE
          </span>
          <button type="button" onClick={jumpToApp}>
            Skip to the app <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

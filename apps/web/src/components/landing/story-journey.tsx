"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, PenLine, BookOpen } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const chapters = [
  {
    title: "Find your people.",
    description:
      "The faces you look for in every room. Start with the people who make your ordinary days extraordinary.",
    label: "A familiar face",
    image: "/images/friends.jpg",
    alt: "Friends spending a quiet afternoon together",
    icon: Heart,
  },
  {
    title: "Keep the feeling.",
    description:
      "A photo remembers what it looked like. Your words remember how it felt. Add the line you’ll want to read again.",
    label: "A little more than a photo",
    image: "/images/coast.jpg",
    alt: "Waves meeting a sunlit shore",
    icon: PenLine,
  },
  {
    title: "Make it a chapter.",
    description:
      "A few small memories become a story. A story becomes a book. One that grows as life goes on.",
    label: "Something worth keeping",
    image: "/images/flowers.jpg",
    alt: "Pink blossoms glowing in afternoon sunlight",
    icon: BookOpen,
  },
] as const;

export function StoryJourney() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const media = gsap.matchMedia();
    media.add("(min-width: 901px)", () => {
      section.classList.add("journey-enhanced");
      const stages = Array.from(
        section.querySelectorAll<HTMLElement>(".journey-step"),
      );
      const visuals = Array.from(
        section.querySelectorAll<HTMLElement>(".journey-visual"),
      );
      const activate = (index: number) => {
        stages.forEach((item, i) =>
          item.classList.toggle("is-active", i === index),
        );
        visuals.forEach((item, i) =>
          item.classList.toggle("is-active", i === index),
        );
      };
      activate(0);
      stages.forEach((stage, index) =>
        ScrollTrigger.create({
          trigger: stage,
          start: "top 65%",
          end: "bottom 65%",
          onEnter: () => activate(index),
          onEnterBack: () => activate(index),
        }),
      );
      return () => {
        section.classList.remove("journey-enhanced");
        stages.forEach((item) => item.classList.remove("is-active"));
        visuals.forEach((item) => item.classList.remove("is-active"));
      };
    });
    return () => media.revert();
  }, [reduced]);

  return (
    <section
      className="journey-section"
      id="journey"
      ref={root}
      aria-labelledby="journey-title"
    >
      <div className="page-width">
        <div className="journey-heading">
          <p className="eyebrow">FROM A MOMENT TO A MEANING</p>
          <h2 id="journey-title" data-reveal>
            Life doesn’t come in chapters.
            <br />
            <em>Until you give it a few.</em>
          </h2>
          <span className="journey-scroll-note" aria-hidden="true">
            SCROLL TO TURN THE STORY <span>↓</span>
          </span>
        </div>
        <div className="journey-layout">
          <div className="journey-steps">
            {chapters.map((chapter, index) => (
              <article className="journey-step" key={chapter.title}>
                <span className="journey-step-number">0{index + 1}</span>
                <div>
                  <p className="eyebrow">{chapter.label}</p>
                  <h3>{chapter.title}</h3>
                  <p className="journey-description">{chapter.description}</p>
                  {index === 2 && (
                    <Link className="text-link" href="/studio">
                      Try a little story <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="journey-art" aria-hidden="true">
            {chapters.map((chapter, index) => (
              <div
                className={"journey-visual journey-visual-" + index}
                key={chapter.title}
              >
                <div className="journey-paper">
                  <div className="journey-paper-top">
                    <span>MEMORA</span>
                    <chapter.icon size={15} />
                  </div>
                  <div className="journey-image">
                    <Image
                      src={chapter.image}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 75vw, 400px"
                    />
                  </div>
                  {index === 0 && (
                    <div className="journey-people">
                      <span>M</span>
                      <span>D</span>
                      <span>A</span>
                      <p>Your inner three.</p>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="journey-caption">
                      <p>“We missed the turn and found our favourite place.”</p>
                      <span>WITH DAD · JUNE 14</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="journey-book-title">
                      <p>
                        The everyday,
                        <br />
                        <i>remembered.</i>
                      </p>
                      <span>OUR SUMMER — VOL. 01</span>
                    </div>
                  )}
                  <span className="journey-folio">
                    YOUR LIFE, ONE LITTLE MOMENT AT A TIME{" "}
                    <span>0{index + 1}</span>
                  </span>
                </div>
                <span className="journey-handwritten">
                  {index === 0
                    ? "the ones who make it yours."
                    : index === 1
                      ? "a feeling, in your own words."
                      : "a story you can return to."}
                </span>
              </div>
            ))}
            <div className="journey-art-orbit" />
          </div>
        </div>
      </div>
    </section>
  );
}

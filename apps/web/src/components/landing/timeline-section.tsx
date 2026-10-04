"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Heart, Sparkles, MapPin } from "lucide-react";
import { playSubtleClick } from "@/lib/audio";

interface TimelineEvent {
  year: string;
  tagline: string;
  title: string;
  caption: string;
  person: string;
  date: string;
  location: string;
  image: string;
  alt: string;
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: "2020",
    tagline: "THE QUIET BEGINNINGS",
    title: "The long way home.",
    caption: "We missed the highway turn and found our quiet stretch of coast.",
    person: "DAD",
    date: "JULY 19, 2020",
    location: "South Coast Route",
    image: "/images/coast.jpg",
    alt: "Quiet coastline with soft evening light",
  },
  {
    year: "2022",
    tagline: "HIGHER GROUND",
    title: "A little further.",
    caption:
      "One more hill, he promised. The view from the ridge was worth every step.",
    person: "ARJUN",
    date: "AUGUST 12, 2022",
    location: "Mist Ridge Valley",
    image: "/images/mountains.jpg",
    alt: "Mountain peaks under a pale blue summer sky",
  },
  {
    year: "2024",
    tagline: "THE ORDINARY AFTERNOON",
    title: "Ordinary, wonderful.",
    caption:
      "She stopped to show me the summer blossoms. I am glad I stopped too.",
    person: "MOM",
    date: "MAY 04, 2024",
    location: "Home Orchard Garden",
    image: "/images/flowers.jpg",
    alt: "Sunlit pink blossoms on garden branches",
  },
  {
    year: "2026",
    tagline: "THE LIVING MAGAZINE",
    title: "The days between.",
    caption:
      "Curating a life story not by the big ceremonies, but by the moments in between.",
    person: "YOUR INNER THREE",
    date: "JUNE 2026",
    location: "Everywhere you love",
    image: "/images/friends.jpg",
    alt: "Friends sharing an unhurried golden afternoon",
  },
];

export function TimelineSection() {
  const [activeIdx, setActiveIdx] = useState(3);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    if (index !== activeIdx) playSubtleClick();
    setActiveIdx(index);
    if (focus) tabs.current[index]?.focus();
  };

  return (
    <section
      className="timeline-section page-width"
      id="timeline"
      aria-labelledby="timeline-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span>00 /</span> THE STORYLINE
          </p>
          <h2 id="timeline-title" data-reveal>
            Moments gather.
            <br />
            <em>A life takes shape.</em>
          </h2>
        </div>
        <p>
          A summer. A birthday. An ordinary Tuesday.
          <br />
          Every year has a few moments worth returning to.
        </p>
      </div>
      <p className="timeline-invitation">
        <span className="live-dot" aria-hidden="true" />A SAMPLE STORY — CHOOSE
        A YEAR
      </p>
      <div
        className="timeline-scrubber"
        role="tablist"
        aria-label="Years in memory"
      >
        <div className="timeline-track-line" aria-hidden="true" />
        {TIMELINE_DATA.map((item, idx) => (
          <button
            key={item.year}
            ref={(node) => {
              tabs.current[idx] = node;
            }}
            id={"timeline-tab-" + item.year}
            role="tab"
            aria-label={item.year}
            aria-selected={idx === activeIdx}
            aria-controls={"timeline-panel-" + item.year}
            tabIndex={idx === activeIdx ? 0 : -1}
            className={
              "timeline-year-node " + (idx === activeIdx ? "is-active" : "")
            }
            onClick={() => select(idx)}
            onKeyDown={(event) => {
              let next: number | undefined;
              if (event.key === "ArrowRight")
                next = (idx + 1) % TIMELINE_DATA.length;
              if (event.key === "ArrowLeft")
                next = (idx + TIMELINE_DATA.length - 1) % TIMELINE_DATA.length;
              if (event.key === "Home") next = 0;
              if (event.key === "End") next = TIMELINE_DATA.length - 1;
              if (next !== undefined) {
                event.preventDefault();
                select(next, true);
              }
            }}
          >
            <span className="node-pip" aria-hidden="true" />
            <span className="node-year">{item.year}</span>
            <span className="node-label">{item.tagline}</span>
          </button>
        ))}
      </div>
      {TIMELINE_DATA.map((item, idx) => (
        <div
          className="timeline-card"
          key={item.year}
          id={"timeline-panel-" + item.year}
          role="tabpanel"
          aria-labelledby={"timeline-tab-" + item.year}
          hidden={activeIdx !== idx}
          tabIndex={0}
        >
          {activeIdx === idx && (
            <>
              <div className="timeline-photo-side">
                <div className="timeline-image-wrap">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 900px) 90vw, 600px"
                  />
                  <div className="timeline-photo-badge">
                    <Calendar size={12} /> {item.date}
                  </div>
                  <div className="timeline-location-badge">
                    <MapPin size={12} /> {item.location}
                  </div>
                  <span className="timeline-photo-year" aria-hidden="true">
                    {item.year}
                  </span>
                </div>
              </div>
              <div className="timeline-content-side">
                <div className="timeline-tag-row">
                  <span className="eyebrow">{item.tagline}</span>
                </div>
                <h3 className="timeline-heading">{item.title}</h3>
                <blockquote className="timeline-quote">
                  <p>“{item.caption}”</p>
                </blockquote>
                <span className="timeline-person-pill">
                  <Heart size={11} /> WITH {item.person}
                </span>
                <div className="timeline-footer">
                  <span className="timeline-annotation">
                    <Sparkles size={13} /> Chapter of {item.year}
                  </span>
                  <Link href="/studio" className="text-link">
                    Try your own story <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

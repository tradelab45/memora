"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import { BookPreview } from "@/components/book/book-preview";
import { memories, people } from "@/lib/content";
export function StoryStudio() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(people.map((p) => p.name));
  const [active, setActive] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const memory = memories[active];
  const caption = drafts[memory.id] ?? captions[memory.id] ?? memory.caption;
  const saveCaption = () => {
    setCaptions((value) => ({ ...value, [memory.id]: caption.trim() }));
    setStatus("Your line is saved in this sample story.");
  };
  const reset = () => {
    setDrafts({});
    setCaptions({});
    setSelected(people.map((p) => p.name));
    setActive(0);
    setStep(0);
    setStatus("");
  };
  return (
    <>
      <SiteHeader />
      <main className="studio page-width" id="main-content">
        <div className="studio-heading">
          <div>
            <p className="eyebrow">YOUR FIRST CHAPTER</p>
            <h1>
              A small story.
              <br />
              <em>A good beginning.</em>
            </h1>
            <p>
              Try MEMORA with three sample memories. Everything stays in this
              browser tab.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw size={14} /> Reset sample
          </Button>
        </div>
        <nav className="studio-steps" aria-label="Story creation steps">
          {["Your people", "Your memories", "Your book"].map((name, index) => (
            <button
              key={name}
              onClick={() => {
                setStep(index);
                setStatus("");
                if (index === 1 && !selected.includes(memories[active].person))
                  setActive(
                    memories.findIndex((item) =>
                      selected.includes(item.person),
                    ),
                  );
              }}
              aria-current={step === index ? "step" : undefined}
              disabled={index > 0 && selected.length === 0}
            >
              <span>0{index + 1}</span>
              {name}
            </button>
          ))}
        </nav>
        {step === 0 && (
          <section className="studio-panel" aria-labelledby="people-step-title">
            <h2 id="people-step-title">Who makes your world?</h2>
            <p>
              Choose one to three people for this sample. Their names appear
              with the memories you keep.
            </p>
            <div className="studio-people">
              {people.map((person) => {
                const isSelected = selected.includes(person.name);
                return (
                  <button
                    className="studio-person"
                    key={person.name}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelected((value) =>
                        isSelected
                          ? value.filter((name) => name !== person.name)
                          : [...value, person.name],
                      )
                    }
                  >
                    <span className={"person-avatar " + person.color}>
                      {person.initial}
                    </span>
                    <div>
                      <strong>{person.name}</strong>
                      <small>{person.detail}</small>
                    </div>
                    {isSelected && <Check size={17} />}
                  </button>
                );
              })}
            </div>
            <p className="studio-note">
              <LockKeyhole size={13} /> Sample profiles only. No recognition or
              photo access.
            </p>
            <Button
              disabled={selected.length === 0}
              onClick={() => {
                setActive(
                  memories.findIndex((item) => selected.includes(item.person)),
                );
                setStep(1);
              }}
            >
              Find the little moments <ArrowRight size={17} />
            </Button>
          </section>
        )}
        {step === 1 && (
          <section
            className="studio-panel"
            aria-labelledby="memories-step-title"
          >
            <h2 id="memories-step-title">What does the photo leave out?</h2>
            <p>Choose a memory and add your own one-line story.</p>
            <div className="studio-memory-grid">
              <div>
                <div className="studio-memory-image">
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    sizes="(max-width: 760px) 90vw, 550px"
                    priority
                  />
                </div>
                <div className="studio-memory-selector">
                  {memories.map(
                    (item, index) =>
                      selected.includes(item.person) && (
                        <button
                          key={item.id}
                          aria-label={"Edit " + item.title}
                          aria-pressed={active === index}
                          onClick={() => {
                            setActive(index);
                            setStatus("");
                          }}
                        >
                          <Image src={item.image} alt="" fill sizes="65px" />
                        </button>
                      ),
                  )}
                </div>
              </div>
              <div className="memory-edit">
                <p className="eyebrow">
                  {memory.date} · WITH {memory.person.toUpperCase()}
                </p>
                <h3>{memory.title}</h3>
                <label htmlFor="memory-caption">
                  One line you’ll want to remember.
                  <textarea
                    id="memory-caption"
                    value={caption}
                    maxLength={280}
                    onChange={(event) => {
                      setDrafts((value) => ({
                        ...value,
                        [memory.id]: event.target.value,
                      }));
                      setStatus("");
                    }}
                  />
                </label>
                <span className="caption-meta">{caption.length} / 280</span>
                <Button onClick={saveCaption} disabled={!caption.trim()}>
                  Keep this memory <Check size={16} />
                </Button>
                <p className="saved-message" role="status">
                  {status}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    saveCaption();
                    setStep(2);
                  }}
                  disabled={!caption.trim()}
                >
                  See your book <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </section>
        )}
        {step === 2 && (
          <section
            className="studio-panel studio-book-grid"
            aria-labelledby="book-step-title"
          >
            <div className="book-showcase">
              <div className="showcase-paper" />
              <BookCover />
            </div>
            <div>
              <p className="eyebrow">OUR SUMMER · VOLUME 01</p>
              <h2 id="book-step-title">
                The days <em>between.</em>
              </h2>
              <p>
                A little summer book for {selected.join(", ")}. Your saved words
                sit beside the sample photographs, with a page for each person
                you chose. Export and printing will arrive in a later chapter.
              </p>
              <BookPreview captions={captions} peopleNames={selected} />
              <p className="studio-note">
                <LockKeyhole size={13} /> This is a temporary sample. Refreshing
                resets your story.
              </p>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Keep writing
              </Button>
            </div>
          </section>
        )}
        <p className="studio-note">
          Read about{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy by design
          </Link>
          .
        </p>
      </main>
    </>
  );
}

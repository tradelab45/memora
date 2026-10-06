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
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import { BookPreview } from "@/components/book/book-preview";
import { memories, people } from "@/lib/content";
import {
  useMusic,
  setPhotoTrack,
  setBookTrack,
  getTrackForPhoto,
} from "@/lib/music";
import { SongPicker } from "@/components/music/music-sheet";
import { useUser, signOutUser } from "@/lib/auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { AiChapterNarrator } from "./ai-chapter-narrator";
import { CollaboratorCircle } from "./collaborator-circle";

export function StoryStudio(props?: {
  userId?: string;
  initialView?: string;
}) {
  const initialView = props?.initialView ?? "memories";
  const user = useUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const music = useMusic();
  const [step, setStep] = useState(() => (initialView === "book" ? 2 : initialView === "people" ? 0 : 1));
  const [selected, setSelected] = useState<string[]>(people.map((p) => p.name));
  const [active, setActive] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const memory = memories[active];
  const currentPhotoTrack = getTrackForPhoto(memory.id);
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

        <div className={`studio-auth-banner ${user ? "is-user" : "is-guest"}`}>
          <div className="studio-auth-col">
            <div className="studio-auth-icon-wrap">
              {user ? (
                <span className="auth-avatar-dot" />
              ) : (
                <svg
                  className="google-svg-icon"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
            </div>
            <div className="studio-auth-text">
              {user ? (
                <>
                  <strong>Google Vault Active: {user.name}</strong>
                  <p>{user.email} · Memories, songs & drafts safely linked</p>
                </>
              ) : (
                <>
                  <strong>Sign in with Google to protect & sync your story</strong>
                  <p>
                    Guest preview mode active. Connect your Google account to save across devices.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="studio-auth-btn-wrap">
            {user ? (
              <button
                type="button"
                className="studio-auth-btn-signout"
                onClick={signOutUser}
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                className="studio-auth-btn-google"
                onClick={() => setAuthModalOpen(true)}
              >
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
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
                <div style={{ marginTop: "6px", marginBottom: "14px" }}>
                  <button
                    type="button"
                    className="studio-ai-prompt-btn"
                    onClick={() => {
                      const prompts = [
                        "The way the light softened just before we turned back.",
                        "Some afternoons are meant to be kept forever.",
                        "Not every journey needs a destination — just the right company.",
                        "The salt in the air, and laughter that carried across the water.",
                        "Minutes that turned into an entire summer.",
                      ];
                      const chosen = prompts[Math.floor(Math.random() * prompts.length)];
                      setDrafts((prev) => ({ ...prev, [memory.id]: chosen }));
                      setStatus("Suggested line added.");
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Suggest poetic caption</span>
                  </button>
                </div>
                <div style={{ marginTop: "14px", marginBottom: "16px" }}>
                  <span style={{ display: "block", fontSize: "10px", letterSpacing: "1.5px", fontWeight: 600, color: "var(--rust)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Picture Soundtrack
                  </span>
                  <SongPicker
                    label={`Soundtrack for ${memory.title}`}
                    value={currentPhotoTrack}
                    onChange={(track) => setPhotoTrack(memory.id, track)}
                    emptyLabel="Inherits common book soundtrack"
                    photoId={memory.id}
                  />
                </div>
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
            <AiChapterNarrator
              currentMemoryTitle={memory.title}
              currentPerson={memory.person}
              currentCaption={caption}
              onApplyProse={(prose) => {
                setDrafts((prev) => ({ ...prev, [memory.id]: prose }));
                setCaptions((prev) => ({ ...prev, [memory.id]: prose }));
                setStatus("AI poetic chapter prose applied to this memory.");
              }}
            />
          </section>
        )}
        {step === 2 && (
          <>
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
                <div style={{ marginTop: "16px", marginBottom: "20px" }}>
                  <span style={{ display: "block", fontSize: "10px", letterSpacing: "1.5px", fontWeight: 600, color: "var(--rust)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Common Book Soundtrack
                  </span>
                  <SongPicker
                    label="Common Book Soundtrack"
                    value={music.bookSong}
                    onChange={setBookTrack}
                    emptyLabel="No music (Muted)"
                  />
                </div>
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
            <CollaboratorCircle />
          </>
        )}
        <p className="studio-note">
          Read about{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy by design
          </Link>
          .
        </p>
      </main>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

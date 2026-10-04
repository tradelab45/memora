"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Images,
  LockKeyhole,
  UsersRound,
} from "lucide-react";
import { BookPreview } from "@/components/book/book-preview";
import { memories, people } from "@/lib/content";
import "./app-preview.css";

const views = [
  { id: "memories", label: "Memories", icon: Images },
  { id: "people", label: "People", icon: UsersRound },
  { id: "books", label: "Books", icon: BookOpen },
] as const;
type View = (typeof views)[number]["id"];

export function AppPreview({ compact = false }: { compact?: boolean }) {
  const [view, setView] = useState<View>("memories");
  const [activeMemory, setActiveMemory] = useState(0);
  const [activePerson, setActivePerson] = useState<string>("Mom");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const memory = memories[activeMemory];
  const personMemory =
    memories.find((item) => item.person === activePerson) || memories[0];
  const title =
    view === "memories"
      ? "A little life, beautifully kept."
      : view === "people"
        ? "The people in your pages."
        : "Give your memories a home.";

  return (
    <section
      className={`app-preview${compact ? " app-preview--compact" : ""}`}
      data-testid="app-preview"
      aria-label="Interactive MEMORA sample app"
    >
      <header className="app-preview-topbar">
        <div className="app-preview-brand">
          <span className="app-preview-monogram" aria-hidden="true">
            m.
          </span>
          <strong>MEMORA</strong>
          <span className="app-preview-space">Your private space</span>
        </div>
        <span className="app-preview-sample">SAMPLE</span>
      </header>
      <div className="app-preview-body">
        <aside className="app-preview-sidebar">
          <p className="app-preview-library-label">YOUR LIBRARY</p>
          <div
            className="app-preview-tabs"
            role="tablist"
            aria-label="Library views"
          >
            {views.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${id}-tab-${item.id}`}
                aria-selected={view === item.id}
                aria-controls={`${id}-panel-${item.id}`}
                tabIndex={view === item.id ? 0 : -1}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                onClick={() => setView(item.id)}
                onKeyDown={(event) => {
                  if (
                    ![
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                      "Home",
                      "End",
                    ].includes(event.key)
                  )
                    return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? views.length - 1
                        : (index +
                            (event.key === "ArrowRight" ||
                            event.key === "ArrowDown"
                              ? 1
                              : -1) +
                            views.length) %
                          views.length;
                  setView(views[next].id);
                  tabRefs.current[next]?.focus();
                }}
              >
                <item.icon size={17} strokeWidth={1.6} />
                <span>{item.label}</span>
                <span className="app-preview-tab-mark" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="app-preview-sidebar-note">
            <LockKeyhole size={15} strokeWidth={1.4} />
            <p>
              A small space.
              <br />
              Entirely yours.
            </p>
          </div>
        </aside>

        <div className="app-preview-workspace">
          <div className="app-preview-panel-heading">
            <div>
              <p className="app-preview-kicker">
                {view === "books"
                  ? "OUR SUMMER · VOLUME 01"
                  : "THE EVERYDAY ARCHIVE"}
              </p>
              <h3>{title}</h3>
            </div>
            <span className="app-preview-season">SUMMER / 2026</span>
          </div>
          <div
            className={`app-preview-panel app-preview-panel-${view}`}
            role="tabpanel"
            id={`${id}-panel-${view}`}
            aria-labelledby={`${id}-tab-${view}`}
            tabIndex={0}
            data-lenis-prevent
          >
            {view === "memories" && (
              <div className="app-preview-memory-layout">
                <article className="app-preview-feature">
                  <div className="app-preview-feature-image">
                    <Image
                      src={memory.image}
                      alt={memory.alt}
                      fill
                      sizes="(max-width: 720px) 85vw, 650px"
                    />
                    <span>{memory.date}</span>
                  </div>
                  <div className="app-preview-feature-copy">
                    <div>
                      <h4>{memory.title}</h4>
                      <p>{memory.caption}</p>
                    </div>
                    <span className="app-preview-person-label">
                      WITH {memory.person.toUpperCase()}
                    </span>
                  </div>
                </article>
                <div
                  className="app-preview-memory-selector"
                  aria-label="Choose a sample memory"
                >
                  {memories.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={index === activeMemory}
                      aria-label={`View memory: ${item.title}`}
                      onClick={() => setActiveMemory(index)}
                    >
                      <span className="app-preview-thumbnail">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(max-width: 720px) 25vw, 180px"
                        />
                      </span>
                      <span className="app-preview-thumbnail-copy">
                        <strong>{item.title}</strong>
                        <span>{item.person}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {view === "people" && (
              <div className="app-preview-people-layout">
                <div
                  className="app-preview-person-selector"
                  aria-label="Choose a sample person"
                >
                  {people.map((person) => {
                    const count = memories.filter(
                      (item) => item.person === person.name,
                    ).length;
                    return (
                      <button
                        key={person.name}
                        type="button"
                        aria-pressed={activePerson === person.name}
                        aria-label={`See ${person.name}'s memories`}
                        onClick={() => setActivePerson(person.name)}
                      >
                        <span
                          className={`app-preview-avatar app-preview-avatar-${person.color}`}
                        >
                          {person.initial}
                        </span>
                        <span>
                          <strong>{person.name}</strong>
                          <small>
                            {count} sample {count === 1 ? "memory" : "memories"}
                          </small>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <article className="app-preview-person-story">
                  <div className="app-preview-person-image">
                    <Image
                      src={personMemory.image}
                      alt={personMemory.alt}
                      fill
                      sizes="(max-width: 720px) 80vw, 480px"
                    />
                  </div>
                  <div className="app-preview-person-story-copy">
                    <p className="app-preview-kicker">
                      A PAGE WITH {activePerson.toUpperCase()}
                    </p>
                    <h4>{personMemory.title}</h4>
                    <blockquote>{personMemory.caption}</blockquote>
                    <span>{personMemory.date}</span>
                  </div>
                </article>
              </div>
            )}
            {view === "books" && (
              <div className="app-preview-book-layout">
                <div className="app-preview-book-stage" aria-hidden="true">
                  <div className="app-preview-book-cover">
                    <span>MEMORA · A SUMMER EDITION</span>
                    <h4>
                      The days
                      <br />
                      <em>between.</em>
                    </h4>
                    <div className="app-preview-book-image">
                      <Image
                        src="/images/coast.jpg"
                        alt=""
                        fill
                        sizes="240px"
                      />
                    </div>
                    <span>OUR SUMMER · VOLUME 01</span>
                    <i>2026</i>
                  </div>
                </div>
                <div className="app-preview-book-copy">
                  <p className="app-preview-kicker">
                    YOUR STORY, IN YOUR HANDS
                  </p>
                  <h4>
                    The little things.
                    <br />
                    <em>All together.</em>
                  </h4>
                  <p>
                    Three photographs. Three small stories. A sample summer book
                    for the people who make it yours.
                  </p>
                  <BookPreview triggerLabel="Open sample book" />
                  <span className="app-preview-book-note">
                    A preview to explore. Yours to create in the studio.
                  </span>
                </div>
              </div>
            )}
          </div>
          {views
            .filter((item) => item.id !== view)
            .map((item) => (
              <div
                key={item.id}
                role="tabpanel"
                id={`${id}-panel-${item.id}`}
                aria-labelledby={`${id}-tab-${item.id}`}
                hidden
              />
            ))}
          <footer className="app-preview-footer">
            <span>
              <LockKeyhole size={12} /> Sample library · no uploads
            </span>
            <Link href="/studio">
              Open the studio <ArrowUpRight size={15} />
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}

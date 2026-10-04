import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown, LockKeyhole, Plus } from "lucide-react";
import { SiteHeader, Wordmark } from "@/components/layout/site-header";
import { BookCover } from "@/components/book/book-cover";
import { BookPreview } from "@/components/book/book-preview";
import { CinematicExperience } from "./cinematic-experience";
import { TimelineSection } from "./timeline-section";
import { QuestionsSection } from "./questions-section";
import { memories, people } from "@/lib/content";
import "./cinematic-site.css";

export function LandingPage() {
  return (
    <div className="memora-cinematic">
      <SiteHeader cinematic />
      <main id="main-content">
        <CinematicExperience />
        <section
          className="archive-intro archive-width"
          id="idea"
          aria-labelledby="idea-title"
        >
          <div className="archive-section-label">
            <span>THE IDEA</span>
            <span>01 — 04</span>
          </div>
          <div className="archive-intro-grid">
            <p className="archive-margin-note">
              Less camera roll.
              <br />
              More life story.
            </p>
            <div>
              <h2 id="idea-title" data-chapter>
                Your life isn't a feed.
                <br />
                It's a <em>body of work.</em>
              </h2>
              <p>
                That wrong turn with Dad. The flowers Mom stopped for. The
                friend who said “one more hill.” Give the ordinary days
                somewhere extraordinary to live.
              </p>
            </div>
          </div>
          <div
            className="archive-index"
            aria-label="Photo to person to memory to story to book"
          >
            {[
              "A photograph",
              "Your people",
              "A memory",
              "Your story",
              "A living book",
            ].map((label, i) => (
              <span key={label}>
                <small>0{i + 1}</small>
                {label}
                {i < 4 && <ArrowUpRight size={18} />}
              </span>
            ))}
          </div>
        </section>

        <section
          className="archive-people"
          id="people"
          aria-labelledby="people-title"
        >
          <div className="archive-width archive-section-label">
            <span>THE PEOPLE</span>
            <span>02 — 04</span>
          </div>
          <div className="archive-width archive-people-grid">
            <div className="archive-people-photo">
              <Image
                src="/images/friends.jpg"
                alt="Friends sitting together at the end of a summer afternoon"
                fill
                sizes="(max-width: 760px) 92vw, 55vw"
              />
              <span className="archive-photo-coordinate">
                THE USUAL SUSPECTS / SUMMER, 2026
              </span>
              <Plus className="archive-registration" size={22} />
            </div>
            <div className="archive-people-copy">
              <p className="eyebrow">A WHOLE WORLD. YOUR INNER THREE.</p>
              <h2 id="people-title" data-reveal>
                Some people
                <br />
                make <em>every page.</em>
              </h2>
              <p>
                The ones you look for in every photograph. Start with three
                people. Find the stories you share.
              </p>
              <div className="archive-person-list">
                {people.map((person) => (
                  <Link href="/studio" key={person.name}>
                    <span className={"archive-person-initial " + person.color}>
                      {person.initial}
                    </span>
                    <strong>{person.name}</strong>
                    <span>{person.detail}</span>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="archive-memories archive-width"
          id="memories"
          aria-labelledby="memory-title"
        >
          <div className="archive-section-label">
            <span>THE MOMENTS BETWEEN</span>
            <span>03 — 04</span>
          </div>
          <div className="archive-memory-heading">
            <h2 id="memory-title" data-reveal>
              Small moments.
              <br />
              <em>Whole worlds.</em>
            </h2>
            <p>
              You don't need a thousand words.
              <br />
              Just the line that takes you back.
            </p>
          </div>
          <div
            className="archive-contact-sheet"
            role="region"
            aria-label="Sample memory photographs"
            tabIndex={0}
          >
            {memories.map((memory, index) => (
              <article
                className={"archive-contact archive-contact-" + index}
                key={memory.id}
              >
                <div className="archive-contact-image" data-parallax>
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    sizes="(max-width: 700px) 83vw, 36vw"
                  />
                  <span>
                    0{index + 1} / WITH {memory.person.toUpperCase()}
                  </span>
                </div>
                <div className="archive-contact-caption">
                  <span>{memory.date}</span>
                  <h3>{memory.title}</h3>
                  <p>“{memory.caption}”</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TimelineSection />

        <section
          className="archive-books"
          id="books"
          aria-labelledby="book-title"
        >
          <div className="archive-width archive-section-label">
            <span>THE LIVING BOOK</span>
            <span>04 — 04</span>
          </div>
          <div className="archive-width archive-books-grid">
            <div className="archive-book-art">
              <span className="archive-book-year" aria-hidden="true">
                20
                <br />
                26
              </span>
              <div className="archive-printed-book" data-tilt>
                <BookCover />
              </div>
              <span className="archive-book-edition">
                THE DAYS BETWEEN / FIRST EDITION
              </span>
            </div>
            <div className="archive-book-copy">
              <p className="eyebrow">ONE LIFE. MANY CHAPTERS.</p>
              <h2 id="book-title" data-reveal>
                Made of moments.
                <br />
                <em>Made to stay.</em>
              </h2>
              <p>
                A summer with friends. A year with Mom. Your photographs and
                your words become a book that grows with you.
              </p>
              <BookPreview />
              <div className="archive-book-spec">
                <span>PERSONAL STORIES</span>
                <span>MONTHLY EDITIONS</span>
                <span>YEARBOOKS</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="archive-privacy archive-width"
          id="privacy"
          aria-labelledby="privacy-title"
        >
          <div className="archive-privacy-sign">
            <LockKeyhole size={24} strokeWidth={1.3} />
            <span>PERSONAL MEANS PERSONAL.</span>
          </div>
          <h2 id="privacy-title">
            Your memories.
            <br />
            <em>Your say.</em>
          </h2>
          <div>
            <p>
              Face matching is designed to stay on your device. Cloud backup is
              your choice. Your words always get the final say.
            </p>
            <Link href="/privacy">
              Read our privacy approach <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <QuestionsSection />
        <section className="archive-closing" aria-labelledby="closing-title">
          <div className="archive-width">
            <p className="eyebrow">YOU'RE ALREADY LIVING THE STORY.</p>
            <h2 id="closing-title" data-reveal>
              Give it
              <br />
              <em>a home.</em>
            </h2>
            <Link href="/studio" className="archive-closing-link">
              Start your first chapter <ArrowUpRight size={28} />
            </Link>
            <p className="archive-closing-note">
              Explore the sample. No account needed.
            </p>
          </div>
          <div className="archive-big-wordmark" aria-hidden="true">
            MEMORA
          </div>
        </section>
      </main>
      <footer className="archive-footer archive-width">
        <Wordmark />
        <span>A home for your people, and your stories.</span>
        <Link href="/privacy">Privacy</Link>
        <a href="#main-content">
          Back to top <ArrowDown size={13} />
        </a>
        <span>© {new Date().getFullYear()} MEMORA</span>
      </footer>
    </div>
  );
}

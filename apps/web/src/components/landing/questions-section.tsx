import { Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const questions = [
  [
    "Do I need an account to use MEMORA?",
    "You can explore the public sample here. Sign in with Google before adding your own photos, people and stories in the studio.",
  ],
  [
    "Are my photos uploaded?",
    "The landing page uses sample photographs. Your imported photos and stories are saved in this browser, under your signed-in account. Cloud backup requires a separate connection and is not enabled automatically.",
  ],
  [
    "Can I print my book?",
    "Yes. In your book, choose Print / Save as PDF to open the browser print dialog. Audio stays in the digital book. Ordering a professionally printed keepsake is not available yet.",
  ],
  [
    "Is face recognition available yet?",
    "Not in this preview. The mobile architecture is designed for on-device matching, with face embeddings staying on your phone by default. Recognition will require your permission.",
  ],
] as const;

export function QuestionsSection() {
  return (
    <section
      className="questions-section page-width"
      id="faq"
      aria-labelledby="questions-title"
    >
      <div className="questions-intro">
        <p className="eyebrow">BEFORE YOUR FIRST CHAPTER</p>
        <h2 id="questions-title" data-reveal>
          A few little
          <br />
          <em>things to know.</em>
        </h2>
        <Link href="/privacy" className="text-link">
          Our privacy approach <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="questions-list">
        {questions.map(([question, answer], index) => (
          <details className="question" key={question}>
            <summary>
              <span className="question-number">0{index + 1}</span>
              <span>{question}</span>
              <Plus size={17} aria-hidden="true" />
            </summary>
            <div className="question-answer">
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

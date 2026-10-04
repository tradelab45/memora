import { Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const questions = [
  [
    "Can I try MEMORA without an account?",
    "Yes. The sample studio lets you choose people, add your own words and flip through a small book. Everything stays in the current browser tab and resets when you reload or leave the studio.",
  ],
  [
    "Are my photos uploaded?",
    "The current website uses sample photographs only. It does not access your photo library or upload your captions. The planned app will make cloud backup a separate, explicit choice.",
  ],
  [
    "Can I print my book?",
    "For now, you can explore a digital sample. Print-ready exports and physical keepsakes are part of a later milestone. There is no checkout on this website yet.",
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

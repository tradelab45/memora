import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="legal-page page-width">
      <p className="eyebrow">A PAGE BETWEEN CHAPTERS</p>
      <h1>
        This story
        <br />
        isn’t here yet.
      </h1>
      <Link className="text-link" href="/">
        Back to MEMORA ↗
      </Link>
    </main>
  );
}

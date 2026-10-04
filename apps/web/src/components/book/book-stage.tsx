"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { BookOpen, Book as BookIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BookCover } from "./book-cover";
import { playPaperRustle, playSubtleClick } from "@/lib/audio";
import type { LightingMode } from "./book-scene";

const Scene = dynamic(() => import("./book-scene"), { ssr: false });

function getInitialLightingMode(): LightingMode {
  if (typeof window === "undefined") return "golden";
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return "morning";
  if (hour >= 14 && hour < 19) return "golden";
  return "twilight";
}

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function BookStage({
  cinematic = false,
  progressRef,
  active = true,
}: {
  cinematic?: boolean;
  progressRef?: RefObject<number>;
  active?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [previousSceneMode, setPreviousSceneMode] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [lightingMode, setLightingMode] =
    useState<LightingMode>(getInitialLightingMode);

  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (context) context.getExtension("WEBGL_lose_context")?.loseContext();
    const task = window.setTimeout(() => setSupported(Boolean(context)), 0);
    return () => clearTimeout(task);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    const task = window.setTimeout(updateVisibility, 0);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    if (stage.current) observer.observe(stage.current);
    return () => {
      window.clearTimeout(task);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  const toggleBookOpen = () => {
    const next = !isOpen;
    if (next) playPaperRustle();
    else playSubtleClick();
    setIsOpen(next);
  };

  const showScene = supported && !reduced && !failed;
  // Each remounted GPU scene must earn its ready state before replacing the book.
  if (showScene !== previousSceneMode) {
    setPreviousSceneMode(showScene);
    setReady(false);
  }

  return (
    <div
      ref={stage}
      className={"book-stage" + (cinematic ? " book-stage-cinematic" : "")}
      role="group"
      aria-label="The Days Between: a sample MEMORA memory book"
    >
      {!cinematic && (
        <>
          <div className="stage-orbits" aria-hidden="true">
            <div className="stage-orbit orbit-one" />
            <div className="stage-orbit orbit-two" />
          </div>

          <div
            className="floating-photo photo-one"
            data-parallax
            data-tilt
            aria-hidden="true"
          >
            <Image src="/images/mountains.jpg" alt="" fill sizes="140px" />
            <span>a little further.</span>
          </div>

          <div
            className="floating-photo photo-two"
            data-parallax
            data-tilt
            aria-hidden="true"
          >
            <Image src="/images/flowers.jpg" alt="" fill sizes="120px" />
          </div>
        </>
      )}

      <div
        className={"book-fallback " + (showScene && ready ? "is-hidden" : "")}
        aria-hidden="true"
      >
        <BookCover className={cinematic ? "cinematic-cover" : ""} />
      </div>

      {showScene && (
        <div
          className={"scene-layer " + (ready ? "is-ready" : "")}
          aria-hidden="true"
        >
          <SceneBoundary onFailure={onFailure}>
            <Scene
              onReady={onReady}
              onFailure={onFailure}
              isOpen={isOpen}
              active={inView && pageVisible && active}
              cinematic={cinematic}
              lightingMode={lightingMode}
              progressRef={progressRef}
            />
          </SceneBoundary>
        </div>
      )}

      {!cinematic && (
        <div
          className="stage-lighting-picker"
          role="radiogroup"
          aria-label="Solar lighting atmosphere"
        >
          {(
            [
              { id: "morning", label: "☼ Morning" },
              { id: "golden", label: "✦ Golden Hour" },
              { id: "twilight", label: "☽ Twilight" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={lightingMode === item.id}
              className={`lighting-node ${lightingMode === item.id ? "is-active" : ""}`}
              onClick={() => {
                setLightingMode(item.id);
                playSubtleClick();
              }}
              aria-label={`${item.label} atmosphere`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {!cinematic &&
        (showScene && ready ? (
          <button
            type="button"
            className="stage-peek-button"
            onClick={toggleBookOpen}
            aria-label={isOpen ? "Close book cover" : "Peek inside 3D book"}
            aria-pressed={isOpen}
          >
            {isOpen ? <BookIcon size={14} /> : <BookOpen size={14} />}
            <span>{isOpen ? "Close cover" : "Peek inside"}</span>
          </button>
        ) : (
          <Link href="#books" className="stage-peek-button stage-peek-link">
            <BookOpen size={14} aria-hidden="true" />
            <span>Explore the sample book</span>
          </Link>
        ))}

      {!cinematic && (
        <>
          <span className="stage-handwritten" aria-hidden="true">
            a life, in little moments.
          </span>
          <span className="stage-label">A BOOK THAT GROWS WITH YOU</span>
        </>
      )}
    </div>
  );
}

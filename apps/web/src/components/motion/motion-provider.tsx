"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    const progress = document.querySelector<HTMLElement>(
      "[data-reading-progress]",
    );
    const updateProgress = () => {
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty(
        "transform",
        "scaleX(" + (distance > 0 ? window.scrollY / distance : 0) + ")",
      );
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    if (reduced)
      return () => window.removeEventListener("scroll", updateProgress);

    gsap.registerPlugin(ScrollTrigger);
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const lenis = finePointer
      ? new Lenis({
          duration: 0.9,
          anchors: { offset: -95 },
          prevent: (node) => Boolean(node.closest('[role="dialog"]')),
        })
      : null;
    const syncScroll = () => {
      // A hidden tab pauses RAF below; it should not acquire a scroll lock.
      if (document.body.hasAttribute("data-scroll-locked")) lenis?.stop();
      else lenis?.start();
    };
    const observer = new MutationObserver(syncScroll);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });
    syncScroll();
    const tick = (time: number) => {
      if (!document.hidden) lenis?.raf(time * 1000);
    };
    lenis?.on("scroll", ScrollTrigger.update);
    if (lenis) gsap.ticker.add(tick);
    const cleanups: (() => void)[] = [];

    const context = gsap.context(() => {
      // Content remains readable throughout; movement provides hierarchy.
      gsap.from(".hero-line", {
        y: 28,
        stagger: 0.12,
        duration: 1.15,
        ease: "power3.out",
      });
      gsap.from(
        ".hero-description, .hero-actions, .privacy-note, .hero-edition",
        {
          y: 16,
          stagger: 0.08,
          duration: 0.95,
          delay: 0.22,
          ease: "power3.out",
        },
      );
      gsap.utils
        .toArray<HTMLElement>(
          "[data-reveal]:not(#hero-title), [data-chapter]:not(.cinema-track)",
        )
        .forEach((item) => {
          gsap.from(item, {
            y: 28,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 92%", once: true },
          });
        });
      gsap.utils.toArray<HTMLElement>(".memory-card").forEach((item, index) => {
        gsap.from(item, {
          y: 36,
          duration: 0.9,
          delay: finePointer ? index * 0.09 : 0,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 94%", once: true },
        });
      });
      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (pointer: fine)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((item) => {
          const image = item.querySelector("img");
          const target = image || item;
          gsap.fromTo(
            target,
            { yPercent: image ? -4 : -3, scale: image ? 1.09 : 1 },
            {
              yPercent: image ? 4 : 3,
              ease: "none",
              scrollTrigger: {
                trigger: item.closest("section") || item,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            },
          );
        });
      });
      cleanups.push(() => media.revert());

      if (finePointer) {
        document
          .querySelectorAll<HTMLElement>("[data-tilt], [data-magnetic]")
          .forEach((element) => {
            const magnetic = element.hasAttribute("data-magnetic");
            const propertyX = magnetic ? "x" : "rotationY";
            const propertyY = magnetic ? "y" : "rotationX";
            const toX = gsap.quickTo(element, propertyX, {
              duration: 0.4,
              ease: "power3.out",
            });
            const toY = gsap.quickTo(element, propertyY, {
              duration: 0.4,
              ease: "power3.out",
            });
            if (!magnetic) gsap.set(element, { transformPerspective: 1100 });
            const move = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              const box = element.getBoundingClientRect();
              const x = (event.clientX - box.left) / box.width - 0.5;
              const y = (event.clientY - box.top) / box.height - 0.5;
              toX(magnetic ? x * 10 : x * 5);
              toY(magnetic ? y * 7 : -y * 5);
              element.style.setProperty("--glare-x", (x + 0.5) * 100 + "%");
              element.style.setProperty("--glare-y", (y + 0.5) * 100 + "%");
            };
            const reset = () => {
              toX(0);
              toY(0);
            };
            element.addEventListener("pointermove", move);
            element.addEventListener("pointerleave", reset);
            element.addEventListener("blur", reset);
            cleanups.push(() => {
              element.removeEventListener("pointermove", move);
              element.removeEventListener("pointerleave", reset);
              element.removeEventListener("blur", reset);
            });
          });
      }
    });
    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((image) => image.addEventListener("load", refresh));
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      images.forEach((image) => image.removeEventListener("load", refresh));
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      if (lenis) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [reduced, pathname]);
  return children;
}

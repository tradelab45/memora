"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
} from "react";
import "./liquid-glass.css";

/*
  Liquid glass surface (web approximation, not an Apple material).

  Adapted from the 21st.dev "LiquidGlass" component by manfromexistence:
  a rounded-rect SDF is rendered into a canvas as a displacement map, then fed to an SVG
  feDisplacementMap used as a backdrop-filter, so whatever sits behind the element is refracted.

  - wraps children and sizes itself with a ResizeObserver
  - only a bevel band near the edge bends light, so wide pills and panels refract like thick glass
  - the map is built at half resolution and rebuilt only on resize
  - SVG backdrop filters render in Chromium; other engines get a frosted blur fallback
  - tint, rim and specular highlights come from liquid-glass.css
*/

const smoothStep = (a: number, b: number, t: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

const roundedRectSDF = (x: number, y: number, hw: number, hh: number, r: number) => {
  const qx = Math.abs(x) - hw + r;
  const qy = Math.abs(y) - hh + r;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
};

let refractionSupport: boolean | null = null;
function supportsRefraction() {
  if (typeof window === "undefined") return false;
  if (refractionSupport !== null) return refractionSupport;
  const brands =
    (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } })
      .userAgentData?.brands ?? [];
  const chromium = brands.some((b) => b.brand === "Chromium");
  refractionSupport = chromium && CSS.supports("backdrop-filter", "url(#a) blur(1px)");
  return refractionSupport;
}

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner radius in px. Use a large number for a pill. */
  radius?: number;
  /** Width of the refracting rim in px. */
  bevel?: number;
  /** Refraction strength multiplier. */
  strength?: number;
  /** Frost behind the glass in px. */
  blur?: number;
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      radius = 28,
      bevel = 22,
      strength = 1,
      blur = 4,
      className = "",
      style,
      children,
      onPointerMove,
      onPointerLeave,
      ...rest
    },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);
    const feImage = useRef<SVGFEImageElement>(null);
    const feMap = useRef<SVGFEDisplacementMapElement>(null);
    const uniqueId = useId().replace(/:/g, "");
    const filterId = `lg-${uniqueId}`;
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [refract, setRefract] = useState(false);

    useEffect(() => {
      setRefract(supportsRefraction());
    }, []);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
        });
      });
      ro.observe(el);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }, []);

    const buildMap = useCallback(() => {
      const { w, h } = size;
      if (!refract || w < 4 || h < 4 || !feImage.current || !feMap.current) return;
      const scale = 0.5;
      const cw = Math.max(2, Math.floor(w * scale));
      const ch = Math.max(2, Math.floor(h * scale));
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const hw = w / 2;
      const hh = h / 2;
      const r = Math.min(radius, hw, hh);
      const band = Math.min(bevel, hw, hh);
      const raw = new Float32Array(cw * ch * 2);
      let max = 0;
      for (let j = 0; j < ch; j++) {
        for (let i = 0; i < cw; i++) {
          const x = (i + 0.5) / scale - hw;
          const y = (j + 0.5) / scale - hh;
          const d = roundedRectSDF(x, y, hw, hh, r);
          let dx = 0;
          let dy = 0;
          if (d < 0) {
            const t = smoothStep(-band, 0, d);
            // outward normal from the SDF gradient
            let nx =
              roundedRectSDF(x + 1, y, hw, hh, r) - roundedRectSDF(x - 1, y, hw, hh, r);
            let ny =
              roundedRectSDF(x, y + 1, hw, hh, r) - roundedRectSDF(x, y - 1, hw, hh, r);
            const len = Math.hypot(nx, ny) || 1;
            nx /= len;
            ny /= len;
            // sample inward near the rim, like light bending through a thick edge
            const k = Math.pow(t, 2.2) * band * 0.9 * strength;
            dx = -nx * k;
            dy = -ny * k;
          }
          const idx = (j * cw + i) * 2;
          raw[idx] = dx;
          raw[idx + 1] = dy;
          max = Math.max(max, Math.abs(dx), Math.abs(dy));
        }
      }
      max = Math.max(max, 0.001);
      const img = ctx.createImageData(cw, ch);
      for (let p = 0; p < cw * ch; p++) {
        img.data[p * 4] = (raw[p * 2] / (2 * max) + 0.5) * 255;
        img.data[p * 4 + 1] = (raw[p * 2 + 1] / (2 * max) + 0.5) * 255;
        img.data[p * 4 + 2] = 128;
        img.data[p * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      feImage.current.setAttribute("href", canvas.toDataURL());
      feMap.current.setAttribute("scale", String(2 * max));
    }, [size, radius, bevel, strength, refract]);

    useEffect(() => {
      buildMap();
    }, [buildMap]);

    const frost = `blur(${Math.round(blur * 4 + 8)}px) saturate(1.7) brightness(1.04)`;
    const merged: CSSProperties = {
      borderRadius: radius,
      ...(refract
        ? {
            backdropFilter: `url(#${filterId}) blur(${blur}px) saturate(1.7) brightness(1.06)`,
          }
        : { backdropFilter: frost, WebkitBackdropFilter: frost }),
      ...style,
    };

    const track = (e: PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (e.pointerType === "touch") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      el.style.setProperty("--spec", "1");
    };

    const release = (e: PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      e.currentTarget.style.setProperty("--spec", "0");
    };

    return (
      <div
        ref={ref}
        className={`liquid-glass ${className}`}
        style={merged}
        onPointerMove={track}
        onPointerLeave={release}
        {...rest}
      >
        {refract && (
          <svg
            aria-hidden
            width="0"
            height="0"
            style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
          >
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
              x="0"
              y="0"
              width={size.w}
              height={size.h}
            >
              <feImage
                ref={feImage}
                x="0"
                y="0"
                width={size.w}
                height={size.h}
                preserveAspectRatio="none"
                result="map"
              />
              <feDisplacementMap
                ref={feMap}
                in="SourceGraphic"
                in2="map"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>
        )}
        {children}
      </div>
    );
  },
);

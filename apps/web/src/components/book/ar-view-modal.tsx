"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Sparkles,
  X,
  Smartphone,
  Maximize2,
  Box,
  Compass,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/ui/qr-code";
import { playSubtleClick } from "@/lib/audio";
import "./ar-view-modal.css";

const SCALE_OBJECTS = [
  {
    id: "espresso",
    name: "Espresso Cup",
    dim: '3.2" diam.',
    icon: "☕",
    bookRatio: "2.7x larger",
    svgWidth: 32,
    svgHeight: 38,
  },
  {
    id: "ipad",
    name: 'iPad Pro 11"',
    dim: '9.74" × 7.02"',
    icon: "📱",
    bookRatio: "Square match",
    svgWidth: 70,
    svgHeight: 97,
  },
  {
    id: "novel",
    name: "Hardcover Novel",
    dim: '6.0" × 9.0"',
    icon: "📖",
    bookRatio: "Wider format",
    svgWidth: 60,
    svgHeight: 90,
  },
  {
    id: "table",
    name: "Coffee Table",
    dim: '36" × 24"',
    icon: "🛋️",
    bookRatio: "Centerpiece",
    svgWidth: 160,
    svgHeight: 105,
  },
] as const;

export function ArViewModal({
  open,
  onOpenChange,
  coverColor = "#512e37",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coverColor?: string;
}) {
  const [selectedScale, setSelectedScale] = useState<string>("ipad");
  const currentScale =
    SCALE_OBJECTS.find((s) => s.id === selectedScale) || SCALE_OBJECTS[1];

  const arShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/#book-stage`
      : "https://memora.app/#book-stage";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay ar-modal-overlay" />
        <Dialog.Content
          className="dialog-content ar-modal-content"
          aria-describedby="ar-dialog-desc"
        >
          <header className="ar-modal-header">
            <div>
              <span className="ar-modal-kicker">
                <Sparkles size={12} /> AUGMENTED REALITY · 1:1 PHYSICAL SCALE
              </span>
              <Dialog.Title className="ar-modal-title">
                View on Your Coffee Table
              </Dialog.Title>
              <Dialog.Description id="ar-dialog-desc" className="ar-modal-desc">
                Inspect physical proportions, hardcover cloth texture, and gold
                foil finish in real room lighting before printing.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ar-modal-close"
                aria-label="Close AR view modal"
                onClick={() => playSubtleClick()}
              >
                <X size={18} />
              </Button>
            </Dialog.Close>
          </header>

          <div className="ar-modal-body">
            {/* Left: 1:1 Scale Dimension & Comparison Simulator */}
            <div className="ar-scale-section">
              <div className="ar-scale-card">
                <div className="ar-card-badge">
                  <Maximize2 size={13} />
                  <span>TRUE-TO-LIFE DIMENSIONS</span>
                </div>
                <div className="ar-dimensions-grid">
                  <div className="ar-dim-item">
                    <strong>Width & Height</strong>
                    <span>8.5″ × 8.5″</span>
                    <em>216 × 216 mm</em>
                  </div>
                  <div className="ar-dim-item">
                    <strong>Spine Depth</strong>
                    <span>0.37″</span>
                    <em>9.3 mm · Lay-Flat</em>
                  </div>
                  <div className="ar-dim-item">
                    <strong>Weight</strong>
                    <span>~680 g</span>
                    <em>Mohawk Superfine</em>
                  </div>
                </div>

                {/* Visual Scale Diagram */}
                <div className="ar-visual-scale-box">
                  <span className="scale-box-label">
                    Scale Comparison: <strong>{currentScale.name}</strong>
                  </span>
                  <div className="scale-diagram-stage">
                    {/* Photobook representation */}
                    <div
                      className="scale-book-repr"
                      style={{ backgroundColor: coverColor }}
                    >
                      <span className="book-repr-label">MEMORA</span>
                      <span className="book-repr-sub">8.5″ Sq</span>
                    </div>

                    {/* Comparison Object representation */}
                    <div className="scale-compare-repr">
                      <span className="compare-icon">{currentScale.icon}</span>
                      <span className="compare-label">{currentScale.name}</span>
                      <span className="compare-dim">{currentScale.dim}</span>
                    </div>
                  </div>
                </div>

                {/* Scale Object Selector */}
                <div className="scale-selector-cluster">
                  <span className="selector-kicker">COMPARE SCALE NEXT TO:</span>
                  <div className="scale-pills">
                    {SCALE_OBJECTS.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        className={`scale-pill-btn ${selectedScale === obj.id ? "is-active" : ""}`}
                        onClick={() => {
                          setSelectedScale(obj.id);
                          playSubtleClick();
                        }}
                      >
                        <span>{obj.icon}</span>
                        <span>{obj.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AR Launch Actions & QR Scanner */}
            <div className="ar-launch-section">
              <div className="ar-launch-card">
                <h4>
                  <Compass size={15} /> Launch Instant AR
                </h4>
                <p className="ar-launch-intro">
                  Place this hardcover keepsake onto your desk, bookshelf, or table
                  using your phone's LIDAR or camera sensors.
                </p>

                <div className="ar-action-buttons">
                  {/* iOS QuickLook trigger */}
                  <a
                    rel="ar"
                    href="/models/memora-book.usdz"
                    className="ar-quicklook-btn ios-btn"
                    onClick={() => playSubtleClick()}
                  >
                    <Box size={16} />
                    <div>
                      <strong>iOS AR QuickLook</strong>
                      <span>Tap to place on iPhone / iPad</span>
                    </div>
                    <ExternalLink size={14} className="ar-btn-arrow" />
                  </a>

                  {/* Android Scene Viewer trigger */}
                  <a
                    href="intent://arvr.google.com/scene-viewer/1.0?file=https://memora.app/models/memora-book.glb&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;"
                    className="ar-quicklook-btn android-btn"
                    onClick={() => playSubtleClick()}
                  >
                    <Smartphone size={16} />
                    <div>
                      <strong>Android Scene Viewer</strong>
                      <span>Google Play Services for AR</span>
                    </div>
                    <ExternalLink size={14} className="ar-btn-arrow" />
                  </a>
                </div>

                <div className="ar-qr-callout">
                  <div className="ar-qr-frame">
                    <QrCode
                      value={arShareUrl}
                      size={96}
                      fgColor="#302d27"
                      bgColor="#ffffff"
                      ariaLabel="Scan QR code with smartphone camera to open in Augmented Reality"
                    />
                  </div>
                  <div className="ar-qr-text">
                    <strong>On Desktop? Scan with Mobile Camera</strong>
                    <p>
                      Open your camera app to view the 3D book in your living room
                      instantly.
                    </p>
                    <span className="ar-feature-tag">
                      <CheckCircle2 size={11} /> No app install required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

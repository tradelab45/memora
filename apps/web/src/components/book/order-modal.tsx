"use client";

import { useState, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Sparkles,
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Printer,
  ArrowRight,
  Lock,
  Package,
  Clock,
  BookOpen,
  QrCode as QrIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { playSubtleClick } from "@/lib/audio";
import "./order-modal.css";

export interface OrderSpecs {
  coverColor: string;
  coverName: string;
  foilChoice: string;
  foilLabel: string;
  foilIcon: string;
  pageCount: number;
  spineThicknessMm: string;
  includeQrCode: boolean;
}

export function OrderModal({
  open,
  onOpenChange,
  specs,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specs: OrderSpecs;
}) {
  const [step, setStep] = useState<"configure" | "processing" | "confirmed">("configure");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "google">("apple");
  const [shippingSpeed, setShippingSpeed] = useState<"standard" | "express">("standard");
  const [processStage, setProcessStage] = useState(0);

  // Form fields
  const [recipientName, setRecipientName] = useState("Aarav Sharma");
  const [email, setEmail] = useState("aarav@example.com");
  const [address, setAddress] = useState("742 Evergreen Terrace");
  const [city, setCity] = useState("San Francisco");
  const [stateZip, setStateZip] = useState("CA 94107");
  const [country, setCountry] = useState("United States");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");

  const [orderNumber] = useState(() => `MEM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const formId = useId();

  // Pricing calculations
  const basePrice = 64.0;
  const foilPrice = specs.foilChoice === "deboss" ? 0.0 : 8.0;
  const qrPlatePrice = specs.includeQrCode ? 4.0 : 0.0;
  const shippingPrice = shippingSpeed === "express" ? 14.0 : 0.0;
  const subtotal = basePrice + foilPrice + qrPlatePrice;
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const total = Math.round((subtotal + shippingPrice + tax) * 100) / 100;

  const handleStartCheckout = (method: "card" | "apple" | "google") => {
    setPaymentMethod(method);
    setStep("processing");
    playSubtleClick();

    // Staged realistic bindery pre-flight & payment authorization
    setProcessStage(0);
    setTimeout(() => setProcessStage(1), 700);
    setTimeout(() => setProcessStage(2), 1500);
    setTimeout(() => {
      setProcessStage(3);
      setStep("confirmed");
    }, 2300);
  };

  const resetOrder = () => {
    setStep("configure");
    setProcessStage(0);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay order-modal-overlay" />
        <Dialog.Content
          className="dialog-content order-modal-content"
          aria-describedby={`${formId}-desc`}
        >
          <header className="order-modal-header">
            <div>
              <span className="order-modal-kicker">
                <Sparkles size={12} /> FINE-ART BINDERY · SMYTH-SEWN PRINT
              </span>
              <Dialog.Title className="order-modal-title">
                {step === "confirmed" ? "Order Confirmed & Sent to Bindery" : "Order Archival Keepsake"}
              </Dialog.Title>
              <Dialog.Description id={`${formId}-desc`} className="order-modal-desc">
                {step === "confirmed"
                  ? `Your heirloom volume has been assigned to master bindery order #${orderNumber}.`
                  : "Handcrafted on 140 gsm Mohawk Superfine Eggshell paper with Smyth-sewn lay-flat binding."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="order-modal-close"
                aria-label="Close order modal"
                onClick={() => {
                  playSubtleClick();
                  if (step === "confirmed") resetOrder();
                }}
              >
                <X size={18} />
              </Button>
            </Dialog.Close>
          </header>

          {step === "configure" && (
            <div className="order-modal-body">
              <div className="order-grid">
                {/* Left Column: Keepsake Specs Summary & Shipping */}
                <div className="order-left-column">
                  <div className="order-card order-specs-summary">
                    <div className="order-card-title">
                      <BookOpen size={14} />
                      <span>HEIRLOOM SPECIFICATIONS</span>
                    </div>

                    <div className="order-specs-list">
                      <div className="order-spec-row">
                        <span className="spec-label">Format</span>
                        <span className="spec-value">8.5 × 8.5" Square Lay-Flat</span>
                      </div>
                      <div className="order-spec-row">
                        <span className="spec-label">Cover Cloth</span>
                        <span className="spec-value cover-pill">
                          <span
                            className="swatch-mini"
                            style={{ backgroundColor: specs.coverColor }}
                            aria-hidden="true"
                          />
                          {specs.coverName}
                        </span>
                      </div>
                      <div className="order-spec-row">
                        <span className="spec-label">Cover Stamp</span>
                        <span className="spec-value">
                          {specs.foilIcon} {specs.foilLabel}
                        </span>
                      </div>
                      <div className="order-spec-row">
                        <span className="spec-label">Paper Stock</span>
                        <span className="spec-value">140 gsm Mohawk Superfine Eggshell</span>
                      </div>
                      <div className="order-spec-row">
                        <span className="spec-label">Binding</span>
                        <span className="spec-value">Smyth-Sewn Hardcover · {specs.spineThicknessMm} mm Spine</span>
                      </div>
                      <div className="order-spec-row">
                        <span className="spec-label">Endpaper Plate</span>
                        <span className="spec-value">
                          {specs.includeQrCode ? (
                            <span className="qr-badge-inline">
                              <QrIcon size={12} /> Engraved Soundtrack Micro-QR
                            </span>
                          ) : (
                            "Blind Debossed Monogram"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-card order-shipping-section">
                    <div className="order-card-title">
                      <Truck size={14} />
                      <span>DELIVERY DESTINATION</span>
                    </div>

                    <div className="shipping-form">
                      <div className="input-group">
                        <label htmlFor={`${formId}-name`}>Recipient Name</label>
                        <input
                          id={`${formId}-name`}
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Recipient Full Name"
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor={`${formId}-email`}>Receipt Email</label>
                        <input
                          id={`${formId}-email`}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor={`${formId}-address`}>Street Address</label>
                        <input
                          id={`${formId}-address`}
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street Address or P.O. Box"
                        />
                      </div>
                      <div className="input-row-split">
                        <div className="input-group">
                          <label htmlFor={`${formId}-city`}>City</label>
                          <input
                            id={`${formId}-city`}
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor={`${formId}-state`}>State / Postal</label>
                          <input
                            id={`${formId}-state`}
                            type="text"
                            value={stateZip}
                            onChange={(e) => setStateZip(e.target.value)}
                            placeholder="CA 94107"
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`${formId}-country`}>Country / Region</label>
                        <input
                          id={`${formId}-country`}
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div className="shipping-speed-picker" role="radiogroup" aria-label="Shipping speed">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={shippingSpeed === "standard"}
                        className={`speed-option ${shippingSpeed === "standard" ? "is-selected" : ""}`}
                        onClick={() => {
                          setShippingSpeed("standard");
                          playSubtleClick();
                        }}
                      >
                        <div>
                          <strong>Standard Archival Courier</strong>
                          <span>7–10 business days · Hand-bound & inspected</span>
                        </div>
                        <span className="speed-price">Complimentary</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={shippingSpeed === "express"}
                        className={`speed-option ${shippingSpeed === "express" ? "is-selected" : ""}`}
                        onClick={() => {
                          setShippingSpeed("express");
                          playSubtleClick();
                        }}
                      >
                        <div>
                          <strong>White-Glove Express Bindery</strong>
                          <span>3–5 business days · Priority press queue</span>
                        </div>
                        <span className="speed-price">+$14.00</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Express Checkout */}
                <div className="order-right-column">
                  <div className="order-card order-cost-breakdown">
                    <div className="order-card-title">
                      <ShieldCheck size={14} />
                      <span>PRICING & BINDERY INVOICE</span>
                    </div>

                    <div className="cost-breakdown-list">
                      <div className="cost-row">
                        <span>Smyth-Sewn Hardcover Book ({specs.pageCount} pp)</span>
                        <span>${basePrice.toFixed(2)}</span>
                      </div>
                      <div className="cost-row">
                        <span>Foil Lettering ({specs.foilLabel})</span>
                        <span>{foilPrice > 0 ? `+$${foilPrice.toFixed(2)}` : "Included"}</span>
                      </div>
                      <div className="cost-row">
                        <span>Soundtrack Micro-QR Plate</span>
                        <span>{qrPlatePrice > 0 ? `+$${qrPlatePrice.toFixed(2)}` : "None"}</span>
                      </div>
                      <div className="cost-row">
                        <span>Insured Archival Courier</span>
                        <span>{shippingPrice > 0 ? `$${shippingPrice.toFixed(2)}` : "FREE"}</span>
                      </div>
                      <div className="cost-row">
                        <span>Estimated State Tax (8.25%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="cost-divider" />
                      <div className="cost-total-row">
                        <strong>Total Due</strong>
                        <strong>${total.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="express-checkout-cluster">
                      <button
                        type="button"
                        className="express-btn express-apple-pay"
                        onClick={() => handleStartCheckout("apple")}
                        aria-label="Pay with Apple Pay"
                      >
                        <span className="apple-pay-logo">Pay</span>
                        <span className="express-btn-sub">Instant 1-Click Checkout</span>
                      </button>

                      <button
                        type="button"
                        className="express-btn express-google-pay"
                        onClick={() => handleStartCheckout("google")}
                        aria-label="Pay with Google Pay"
                      >
                        <span className="google-pay-logo">
                          <span style={{ color: "#4285F4" }}>G</span>
                          <span style={{ color: "#EA4335" }}>o</span>
                          <span style={{ color: "#FBBC05" }}>o</span>
                          <span style={{ color: "#4285F4" }}>g</span>
                          <span style={{ color: "#34A853" }}>l</span>
                          <span style={{ color: "#EA4335" }}>e</span> Pay
                        </span>
                        <span className="express-btn-sub">Instant 1-Click Checkout</span>
                      </button>

                      <div className="or-divider">
                        <span>or pay with credit / debit card</span>
                      </div>

                      <div className="card-input-wrapper">
                        <div className="input-group">
                          <label htmlFor={`${formId}-card`}>Card Details</label>
                          <div className="card-fields-box">
                            <CreditCard size={16} className="card-icon" />
                            <input
                              id={`${formId}-card`}
                              type="text"
                              className="card-num-input"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 •••• •••• 4242"
                            />
                            <input
                              type="text"
                              className="card-exp-input"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              aria-label="Card expiry MM/YY"
                            />
                            <input
                              type="text"
                              className="card-cvc-input"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="CVC"
                              aria-label="Card CVC"
                            />
                          </div>
                        </div>

                        <Button
                          className="card-pay-btn"
                          onClick={() => handleStartCheckout("card")}
                        >
                          <Lock size={14} /> Pay ${total.toFixed(2)} with Card
                        </Button>
                      </div>
                    </div>

                    <div className="order-guarantee-note">
                      <ShieldCheck size={14} />
                      <span>
                        100% Archival Guarantee · If paper color or binding does not match your screen proof, we reprint free of charge.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="order-processing-view">
              <div className="processing-spinner-box">
                <div className="processing-spinner" />
                <span className="processing-kicker">MEMORA BINDERY INGESTION</span>
                <h3>Preparing Your Keepsake Volume...</h3>
              </div>

              <div className="processing-steps-card">
                <div className={`process-step-item ${processStage >= 0 ? "is-active" : ""} ${processStage > 0 ? "is-done" : ""}`}>
                  <div className="step-pip">{processStage > 0 ? <CheckCircle2 size={14} /> : "1"}</div>
                  <div className="step-text">
                    <strong>Pre-Flight Color Space Verification</strong>
                    <span>Validating 300 DPI CMYK gamut & Mohawk paper profile</span>
                  </div>
                </div>

                <div className={`process-step-item ${processStage >= 1 ? "is-active" : ""} ${processStage > 1 ? "is-done" : ""}`}>
                  <div className="step-pip">{processStage > 1 ? <CheckCircle2 size={14} /> : "2"}</div>
                  <div className="step-text">
                    <strong>Smyth-Sewn Signatures Assembly</strong>
                    <span>Compiling 12 folded 4-page signatures with {specs.spineThicknessMm}mm spine</span>
                  </div>
                </div>

                <div className={`process-step-item ${processStage >= 2 ? "is-active" : ""} ${processStage > 2 ? "is-done" : ""}`}>
                  <div className="step-pip">{processStage > 2 ? <CheckCircle2 size={14} /> : "3"}</div>
                  <div className="step-text">
                    <strong>Authorizing Payment ({paymentMethod.toUpperCase()})</strong>
                    <span>Tokenizing secure payment of ${total.toFixed(2)} via Stripe Elements</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "confirmed" && (
            <div className="order-confirmed-view">
              <div className="confirmed-hero-card">
                <div className="confirmed-badge">
                  <CheckCircle2 size={32} />
                </div>
                <h2>Heirloom Volume Queued for Production</h2>
                <p>
                  Thank you, <strong>{recipientName}</strong>. Your photobook order has been verified and forwarded to our Portland fine-art bindery.
                </p>
                <div className="order-number-pill">
                  <span>ORDER REFERENCE</span>
                  <strong>{orderNumber}</strong>
                </div>
              </div>

              <div className="confirmed-details-grid">
                <div className="confirmed-card">
                  <div className="confirmed-card-title">
                    <Package size={14} />
                    <span>PRODUCTION & BINDERY MANIFEST</span>
                  </div>
                  <ul className="manifest-list">
                    <li>
                      <strong>Format:</strong> 8.5 × 8.5" Square Lay-Flat Hardcover
                    </li>
                    <li>
                      <strong>Cover Cloth:</strong> {specs.coverName} ({specs.coverColor})
                    </li>
                    <li>
                      <strong>Foil Stamping:</strong> {specs.foilIcon} {specs.foilLabel}
                    </li>
                    <li>
                      <strong>Paper:</strong> 140 gsm Mohawk Superfine Eggshell
                    </li>
                    <li>
                      <strong>Inside Cover Plate:</strong> {specs.includeQrCode ? "Soundtrack Micro-QR Engraved" : "Blind Monogram"}
                    </li>
                    <li>
                      <strong>Total Paid:</strong> ${total.toFixed(2)} via {paymentMethod === "apple" ? "Apple Pay" : paymentMethod === "google" ? "Google Pay" : "Card"}
                    </li>
                  </ul>
                </div>

                <div className="confirmed-card">
                  <div className="confirmed-card-title">
                    <Clock size={14} />
                    <span>PRODUCTION TIMELINE</span>
                  </div>
                  <div className="timeline-tracker">
                    <div className="tracker-stage is-complete">
                      <div className="tracker-dot" />
                      <div className="tracker-info">
                        <strong>Order Confirmed</strong>
                        <span>Resolution check passed (300 DPI)</span>
                      </div>
                    </div>
                    <div className="tracker-stage is-current">
                      <div className="tracker-dot" />
                      <div className="tracker-info">
                        <strong>Digital Pre-Press Proofing</strong>
                        <span>Color calibration for Mohawk eggshell</span>
                      </div>
                    </div>
                    <div className="tracker-stage">
                      <div className="tracker-dot" />
                      <div className="tracker-info">
                        <strong>Hand Smyth-Sewing & Foil Embossing</strong>
                        <span>Estimated in 3–5 business days</span>
                      </div>
                    </div>
                    <div className="tracker-stage">
                      <div className="tracker-dot" />
                      <div className="tracker-info">
                        <strong>White-Glove Courier Dispatch</strong>
                        <span>Tracking will be sent to {email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="confirmed-actions">
                <Button
                  variant="outline"
                  onClick={() => {
                    playSubtleClick();
                    window.print();
                  }}
                >
                  <Printer size={14} /> Print Archival Certificate & Receipt
                </Button>
                <Button
                  onClick={() => {
                    playSubtleClick();
                    resetOrder();
                  }}
                >
                  Return to Keepsake <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

# MEMORA design context

Burgundy (#6b2e34), warm paper (#f6f0e5), charcoal (#302d27), muted ink (#625e54).
Georgia editorial headings; familiar sans-serif labels and body copy. Self-hosted photography.

Grounding: docs/source-conversation.md and the current implementation request.
21st catalog search returned HTTP 401; no catalog code was imported. The external review
command was blocked by automatic approval review because it may transmit source code.
Local lint, browser inspection and accessibility scans provide the review for this milestone.

Primitives: reusable shadcn-compatible Button and Radix Dialog.
Motion: central GSAP/Lenis provider, lazy R3F/Drei book, Rive/Lottie adapters.
The homepage follows a native sticky book-to-photo-to-app sequence. Scroll opens and
enlarges the burgundy keepsake, the photograph fills the viewport, then the sample app
appears. Its library tabs and memory selectors are interactive. Smaller screens use a
shorter sequence; reduced motion uses normal document flow. See docs/motion.md.
Keep semantic content visible, support reduced motion, cap GPU resolution, and use a static fallback.

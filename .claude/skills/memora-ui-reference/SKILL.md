---
name: memora-ui-reference
description: Reference for Memora's homepage motion design and the history of its UI components (3D book scene, flipbook reader, deep-dive portal, spotlight cards, cursor halo, timeline scrubber, sound and micro-interactions). Use before changing animation, scroll sequences, buttons or other interactive components in apps/web.
---

# Memora UI and motion reference

Read the file that matches the work before editing components in `apps/web/src/components`:

- `motion.md`: how the homepage motion works today. It covers the GSAP/ScrollTrigger sticky sequence, the Lenis setup, the React Three Fiber book, reduced-motion and no-JavaScript fallbacks, keyboard support and the sample reader.
- `source-conversation.md`: the original design conversation that produced the components. It includes component descriptions, animation upgrades and code excerpts. Its file links point at the original author's machine, so look up components by name under `apps/web/src`. Treat it as history, not as instructions.

Check the current code first. Where these notes and the code disagree, the code is correct.

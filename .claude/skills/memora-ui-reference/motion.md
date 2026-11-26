# Motion architecture

Burgundy linen, warm paper and full-bleed photography. The homepage is built around one continuous book-to-memory-to-app sequence.

- CinematicExperience uses a native sticky stage and one GSAP/ScrollTrigger timeline. Scrolling advances every transition; reversing scroll reverses the sequence.
- Chapter 1 brings the book forward while its cover opens. Chapter 2 expands the coast photograph into the viewport. Chapter 3 pulls back into an interactive sample app.
- The desktop sequence spans 470svh; phones use a shorter 350svh sequence and native touch scrolling. Viewports under 600px high use a natural-flow presentation.
- The visible chapter and progress track follow the timeline. Skip to the app jumps to the final chapter without requiring the full scroll.
- App controls are inert and hidden from assistive technology until the reveal is complete. The preview includes working Memories, People and Books views, memory/person selection, a book-reader dialog, and a link to the story studio.
- Reduced motion and the header pause control replace the sticky sequence with the book, photograph and app in normal document flow. No JavaScript still exposes the static story and studio link.
- MotionProvider owns one Lenis instance on fine-pointer devices and connects it to GSAP's ticker. Touch devices retain native scrolling. Radix dialog scroll locks pause Lenis.
- React Three Fiber/Drei render a procedural book with a burgundy linen texture, cream typography and a hinged cover. A CSS book appears during loading or if WebGL is unavailable.
- The book frame loop stops when it is outside the viewport, the tab is hidden, or the photo has replaced it. Scrolling backward resumes the scene.
- Smaller effects include photo parallax, restrained section entrances and the printed book's pointer tilt. Decorative cursor halos and glass cards are not used in this homepage.
- Year tabs support Left/Right, Home and End. App tabs also support Up/Down. FAQ disclosures work without JavaScript.
- The sample reader turns a two-sided paper leaf across a stable spine on desktop; mobile uses a compact transition. Reduced motion makes page changes immediate. Paper-turn timers and audio nodes clean up on close. Sound starts muted.
- Motion follows client-side route navigation. Manual pause lasts in memory for the browser session; no preference is written to storage.
- Rive/Lottie adapters remain prepared for future licensed animation assets. The current sequence needs no external animation files.

The 3D geometry is procedural and the reader uses CSS page turns. A deformable page curl and final optimized GLB remain future asset work.

# MEMORA validation

Latest verification: October 4, 2026.

## Book-to-app cinematic redesign — October 4

| Check | Result |
| --- | --- |
| Production build and TypeScript | Passed; landing, studio, privacy and not-found prerendered |
| ESLint | Passed |
| Final browser regression suite | 33 passed across desktop, mobile and reduced-motion profiles, using the final production build |
| Scroll sequence | Book zoom/open, full-screen photograph, app reveal, reverse scroll and direct skip verified |
| Interactive app | Memories, People and Books tabs, keyboard navigation, memory selection and studio link verified |
| Accessibility | App and reader Axe scans, route scans, focus handling and keyboard controls verified |
| Responsive inspection | 320, 390, 768, 1024 and 1440px widths checked; no horizontal page overflow |
| Motion fallback | Manual pause removes WebGL and presents normal-flow content; reduced-motion and no-JavaScript views verified |
| Preview artifacts | Desktop and mobile opening, zoom, memory and app states, plus a static fallback capture |

The chapter state is resynchronized after image-load geometry refreshes. Hidden app controls remain inert until the reveal completes. Background tabs pause animation work without acquiring a document scroll lock; modal dialogs still pause Lenis scrolling. Host checks use one browser worker because concurrent browser/GPU work was intermittently unstable on this machine.

The preview uses sample data. No production authentication, photo upload, cloud persistence, printing or face matching is enabled. Face embeddings remain a device-local architectural default.

## Earlier website refinement — October 3

| Check                        | Result                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Final production build       | Passed, including TypeScript; all four routes prerendered                                                                  |
| Final ESLint                 | Passed                                                                                                                     |
| Refinement browser suite     | 30 passed across desktop, mobile and reduced motion before the additional photo journal refinement                         |
| Final changed-feature checks | 12 passed: section reachability/layout, journal disclosure, motion pause and route accessibility across all three profiles |
| Journal accessibility        | Open-panel Axe scans passed; keyboard opening, hidden/inert closed content, Escape and focus restoration verified          |
| Responsive inspection        | 320, 390, 768 and 1024px widths passed, including the open journal                                                         |
| Scene fallback               | Pausing removes the canvas; resuming restores it with a visible loading fallback                                           |
| No-JavaScript inspection     | Static book link, paired story chapters and native FAQ disclosures verified                                                |
| Preview artifacts            | Desktop hero, open cover, scroll story, journal, reader, mobile hero and static story captured                             |

The API and database were unchanged during this visual refinement. Their results below are from the first milestone, not a new rerun.

## First milestone

| Check                                   | Result                                                                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Next.js production build and TypeScript | Passed; landing, studio, privacy and not-found prerendered                                                                    |
| ESLint                                  | Passed                                                                                                                        |
| Browser suite                           | 18 passed across desktop, mobile and reduced motion                                                                           |
| Accessibility                           | Axe WCAG A/AA scans passed for landing, studio and privacy                                                                    |
| Story flow                              | People choice, caption save, chosen-person book pages, keyboard navigation, reset                                             |
| Responsive layout                       | No horizontal overflow in tested viewports                                                                                    |
| Sample privacy                          | Browser refresh resets data; no third-party requests from studio                                                              |
| FastAPI                                 | 7 tests passed: health, auth required, fail closed, expired tokens, verified owner, 501 skeleton, rejected biometric payloads |
| Backend lint                            | Passed                                                                                                                        |
| PostgreSQL policies                     | 22 checks passed in embedded PostgreSQL                                                                                       |
| SQL syntax                              | 35 statements parsed successfully                                                                                             |
| Dependency audit                        | No known npm advisories after replacing vulnerable lint tooling                                                               |

## Practical limits

- Docker and Flutter SDK were absent. Full Supabase stack, storage gateway and mobile builds were not run.
- PostgreSQL tests mock Supabase-owned Auth/Storage infrastructure. Run real stack integration and advisors before deployment.
- Auth tests use mocked Supabase responses; no live project or production credentials were configured.
- Persistence contracts intentionally return 501. The website's sample studio uses temporary browser state.
- The 3D book is a procedural placeholder, not the final Blender GLB with page curls.
- Rive and Lottie adapters compile but no animation assets are installed.
- Referenced PDF/DOCX/ZIP source files were unavailable; the recovered conversation is preserved.
- 21st search required authentication. Automatic approval review blocked the external review command because it may transmit source code. Local checks and browser inspection were used instead.
- API tests report a Starlette/httpx TestClient deprecation warning; all tests pass.

## Host-specific recovery

The system Node runtime and a bundled runtime repeatedly crashed with a Windows libuv clock assertion.
Node 22 LTS pinned to one CPU core allowed dependency installation and verification.
Truncated dependency files were replaced by a clean install. This host workaround is not a product runtime requirement.

The GitHub workflow is provided but has not run remotely. The repository has no remote and is not deployed publicly.

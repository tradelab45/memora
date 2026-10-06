# MEMORA

### Your life. Remembered properly.

A privacy-first storytelling layer over the camera roll.

**Photo → Person → Memory → Story → Book**

This repository delivers a luxury photobook and storytelling keepsake web experience:
- **3D Articulated Living Photobook**: Procedural Three.js WebGL hero book with real-time cloth cover swatch customizer (*Burgundy Velvet*, *Forest Emerald*, *Midnight Navy*, *Natural Buckram*), lighting atmospheres (*Morning*, *Golden Hour*, *Twilight*), gyroscope parallax, and cinematic scroll choreography.
- **Augmented Reality (AR) 1:1 Scale Coffee Table Placement**: Native iOS QuickLook (`memora-book.usdz`) and Android SceneViewer (`memora-book.glb`) with true physical dimensions ($8.5'' \times 8.5''$, $9.3\text{mm}$ spine), household scale comparison simulator, and desktop-to-phone QR bridge.
- **Fine-Art Smyth-Sewn Print Checkout & Express Pay**: Complete archival ordering flow with Apple Pay, Google Pay, and card checkout, real-time spine calculation, 140 gsm Mohawk Superfine Eggshell paper stock, CMYK soft-proofing, and bindery manifest tracking.
- **Generative Chapter AI Narrator**: Gemini 2.5 Flash editorial assistant transforming companions and dates into publication-grade prose across 4 narrative tones.
- **Inside Cover Engraved Soundtrack Micro-QR Plate**: Self-contained SVG vector QR code plate engraved onto the inside endpaper linking directly to the keepsake's ambient score on Spotify, Apple Music, and YouTube Music.
- **Family Circle Collaborator System**: Cryptographic invite tokens with role-based editing (*Curator*, *Storyteller*, *Contributor*, *Reader*).
- **21st.dev Glassmorphic Google Auth Vault**: 3D spring-physics tilt card with rotating photon beams, Google OAuth verification, and local session persistence.

## Quick start: web

Requirements: Node.js 22 LTS (22.13+), npm 10+.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. No cloud credentials are required for the landing page, 3D stage, sample studio, or book preview.

Routes:
- `/` — Cinematic landing experience & 3D articulated book stage
- `/studio` — Curate people, generate AI captions, collaborate, and inspect print layouts
- `/signin` — 21st.dev 3D tilt card Google authentication vault
- `/privacy` — Cryptographic privacy architecture and client-side isolation guarantees

For the production build:

```sh
npm run build
npm run start --workspace @memora/web
```

## Repository

```text
apps/
  web/                   Next.js 16 + React 19 + TypeScript + Three.js
    src/app/             App router, fonts, metadata and design tokens
    src/components/      3D Book stage, AR modal, Story studio, Auth vault, Audio & UI
    public/models/       Physical 1:1 scale GLB & USDZ AR photobook models
    public/music/        Atmospheric ambient soundtracks (Golden Hour, Quiet Day, After Dark)
    tests/               Playwright browser tests across desktop, mobile and reduced motion
  mobile/                Flutter/Riverpod/Drift source scaffold
packages/
  contracts/             Generated OpenAPI + TypeScript types
services/
  api/                   FastAPI auth/orchestration skeleton and tests
  worker/                Background job boundary
supabase/
  config.toml            CLI-generated local configuration
  migrations/            Owner-scoped schema + private storage policies
scripts/                 AR model generators, preview capture, and PostgreSQL test suite
docs/                    Architecture, visual previews, motion, and validation
vercel.json              Vercel deployment configuration with security headers
.github/                 CI workflows for Web, API, and Mobile checks
```

## Verification

```sh
npm run lint           # ESLint: 0 errors, 0 warnings
npm run typecheck      # TypeScript: 0 errors
npm run build          # Turbopack static & dynamic optimization
npm run test:database  # 22/22 PostgreSQL RLS & storage privacy checks pass
npm run test:web       # 38/38 Playwright E2E browser tests pass
```

GitHub Repository: [https://github.com/tradelab45/memora](https://github.com/tradelab45/memora)


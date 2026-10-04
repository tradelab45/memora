# MEMORA

### Your life. Remembered properly.

A privacy-first storytelling layer over the camera roll.

**Photo → Person → Memory → Story → Book**

This repository delivers the first working web milestone: a premium editorial landing page, procedural 3D book hero, scroll choreography, People/Memory/Book concept sections, responsive navigation, and a temporary sample story studio.

The redesigned homepage opens with a burgundy keepsake book that zooms and opens as you scroll. Its photograph expands into the viewport, then the scene transitions into an interactive MEMORA app preview with Memories, People and Books tabs. The page also includes a photo contact sheet, year timeline, sample reader and accessible FAQ disclosures. Use Skip to the app for a direct jump, or pause motion for a static presentation. Sound is optional and starts muted.

## Quick start: web

Requirements: Node.js 22 LTS (22.13+), npm 10+.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. No cloud credentials are needed for the landing page, sample studio or book preview.

Routes: / (landing), /studio (choose sample people → write a caption → preview a book), /privacy (current behavior and planned guarantees).
Sample captions stay in memory in the active tab and reset on navigation/reload. No camera-roll access, face matching or API upload is enabled.

Optional environment configuration: copy apps/web/.env.example to apps/web/.env.local.
Only publishable keys may use NEXT_PUBLIC_. Never use a service-role key.

For the production build:

```sh
npm run build
npm run start --workspace @memora/web
```

## Repository

```text
apps/
  web/                   Next.js + React + TypeScript
    src/app/             Routes, metadata and design tokens
    src/components/      Landing, studio, motion, books and UI
    src/hooks/           Motion preferences
    src/lib/             Sample content and shared helpers
    public/images/       Self-hosted placeholder photography
    tests/               Browser and accessibility checks
  mobile/                Separate Flutter/Riverpod/Drift source scaffold
packages/
  contracts/             Generated OpenAPI + TypeScript types
services/
  api/                   FastAPI auth/orchestration skeleton and tests
  worker/                Background job boundary
supabase/
  config.toml            CLI-generated local configuration
  migrations/            Owner-scoped schema + private storage policies
scripts/                  Contract export and embedded PostgreSQL tests
docs/                     Architecture, motion, sources, roadmap, validation
.github/                  CI, pull-request and issue templates
```

## Stack and visual system

Next.js App Router, React, TypeScript, Tailwind v4; shadcn-compatible Button and Radix Dialog primitives.
GSAP/ScrollTrigger + Lenis own scroll choreography. React Three Fiber/Drei/Three.js render the procedural book. Rive and Lottie adapters are prepared for future licensed assets.

Burgundy linen, warm paper and charcoal ink; editorial typography, self-hosted photography and one focal effect per section.
Reduced-motion users and devices without WebGL receive a static CSS book. Menus and previews support keyboard navigation.

## API foundation

Requirements: Python 3.12 recommended.

```sh
cd services/api
python -m venv .venv
# Windows PowerShell:
.venv/Scripts/Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements-dev.lock
pip install --no-deps -e .
uvicorn app.main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs. Health: /health.

For /v1/me, configure services/api/.env from .env.example using a Supabase URL and publishable key. The API verifies the supplied bearer token through Supabase Auth and derives the owner from that verified identity.

People, memories, books and jobs have typed contracts but authenticate and return **501** until persistence adapters are implemented. Health does not claim database readiness. There is no demo authentication bypass.

Checks, from services/api:

```sh
pytest -q
ruff check .
```

## Contracts

FastAPI schemas are the source of truth. From the repo root, using the API virtual environment:

```sh
python scripts/export_openapi.py
npm run contracts:generate
```

Commit packages/contracts/openapi.json and src/api.d.ts together. API errors use application/problem+json and a generated request ID. No unknown fields or biometric payloads are accepted.

## Supabase foundation

The migration creates thirteen personal-content tables with RLS and owner-aware association constraints. Storage is private; owner-prefixed uploads require explicit opt-in. Jobs, subscription entitlements and consent records are read-only to client roles.

A local Supabase stack requires Docker and the Supabase CLI. From the repository root:

```sh
npx supabase start
npx supabase db reset --local
```

Use a fresh development stack: reset recreates its database from migrations.
Do not link or push to a production project as part of first-time setup.

The host did not have Docker, so the full local Supabase stack was not started.
The migration and 22 authorization/privacy scenarios were executed in embedded PostgreSQL via PGlite, with only Supabase-owned Auth/Storage infrastructure mocked:

```sh
npm run test:database
```

Run Supabase advisors and real storage/Auth integration tests before deployment. See SECURITY.md for account deletion, session revocation and media cleanup requirements.

## Flutter foundation

Flutter is a separate app. See [apps/mobile/README.md](apps/mobile/README.md) for SDK setup, platform generation, Drift code generation and checks.
Source includes five tabs, pure domain/repository interfaces, local metadata schema and recognition/sync privacy boundaries.
Platform runners, recognition adapters and encrypted storage wiring are intentionally deferred. Flutter was not installed on the implementation host.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npm run test:database
npx playwright install chromium
npm run test:web
```

Browser tests cover desktop, mobile and reduced motion. Accessibility scans cover the landing page, studio and privacy page.
GitHub Actions validates web, API, policy tests and OpenAPI drift. Flutter CI begins once platform runners and a lockfile are generated.

## Source continuity and scope

The complete accessible planning conversation is preserved in [docs/source-conversation.md](docs/source-conversation.md).
The referenced MEMORA master PDF/DOCX and earlier technical ZIP were not accessible through the conversation reader. Their summaries and source links are recorded, but the files themselves have not been imported.
This implementation follows the recovered plan and your priority order; reconcile the exact technical pack when those files become available.

Next: manual mobile photos/captions, real cloud adapters with consent, deterministic book layout/PDF worker, local selected-person matching, then private collaboration and printing.
See [architecture](docs/architecture.md), [motion system](docs/motion.md), [roadmap](docs/roadmap.md), [privacy requirements](SECURITY.md), and [validation](docs/validation.md).

This is a production-oriented foundation, not a publicly deployed or fully operational cloud/mobile product. No external repository has been published.

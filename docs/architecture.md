# MEMORA architecture

## Product loop

Photo → Person → Memory → Story → Book. The phone is the source of truth for local photo indexing and selected-person recognition. V1 begins with manual selection and captions; recognition comes later.

## Boundaries

- apps/web: Next.js App Router, React, TypeScript, Tailwind and shadcn-compatible Radix primitives. Public cinematic landing, private-in-tab sample studio.
- apps/mobile: Flutter source scaffold, Riverpod state boundary, Drift local metadata, five tabs, device-only recognition interface.
- packages/contracts: generated OpenAPI and TypeScript shared contracts.
- services/api: FastAPI auth and orchestration boundary.
- services/worker: deferred job execution for layouts, export, captions and printing.
- supabase: versioned schema, Auth, ownership policies, private media.
- docs: recovered source, privacy decisions, motion and roadmap.

## Data flow

Phone photo library → local index → selected-person matching → quality/duplicate filtering → candidates → memory inbox → approved one-line story → timeline → book layout → flipbook → optional PDF/share/print.

Only explicitly selected content may enter cloud backup. Use a dedicated consent workflow and allowlist serializer; face templates, reference photos, exact device library locators and unknown metadata never cross that boundary.

## API and persistence

The API verifies bearer tokens with Supabase Auth. Implemented: /health and configured /v1/me.
People, memories, books and jobs expose typed contracts but return 501 after authentication.
Implement a repository adapter using the user's JWT so RLS remains effective. Reserve a scoped server credential for trusted workers and signed billing webhooks. Never accept owner_id from client payloads.

Pagination uses opaque owner-bound cursors with a stable occurred_at/ID order; design implemented later.
Book creation should eventually be transactional and enqueue a durable idempotent layout job; do not create pages piecemeal across REST requests.
The current UI does not call these persistence APIs.

## Tables

profiles, people, photos, photo_people, events, memories, memory_people, books, book_pages, caption_suggestions, consent_receipts, jobs, subscriptions.
Every public table enables RLS. Each association has composite owner/ID foreign keys.
Clients cannot update subscriptions, jobs, AI suggestions or consent audit records. Those require authorized server workflows.
The free Inner 3 quota is currently enforced by the demo choice and planned mobile flow; cloud quota enforcement needs a transactional API/RPC before production writes are enabled.

## Deployment targets

Web: Vercel or Node hosting, root directory apps/web with monorepo dependency access.
API/worker: Railway or Render or equivalent containers. Supabase: isolated development/staging/production projects.
Flutter: iOS/Android. Commerce: native IAP for digital subscriptions, Stripe for physical books/web purchases.

No cloud project, repository remote, production deploy, payment account or print provider is configured in this milestone.

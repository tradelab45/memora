# Contributing

Use short-lived branches and focused pull requests. Run web lint, type checks, build and relevant browser tests. Run API and database policy checks for data changes.

Keep features modular. UI primitives belong in components/ui; scroll choreography in components/motion; 3D in components/book. Contract changes start in FastAPI models, then regenerate OpenAPI and TypeScript.

Never commit user photographs, reference face images, credentials or face embeddings. Sample content must be licensed and synthetic or approved. Do not log captions, signed media URLs, tokens or payment payloads. Keep cloud features behind explicit consent.

The first milestone is a working marketing site and local sample studio. API persistence, real mobile photo processing, AI, commerce and sharing are follow-up work.

# Security

Do not report private data, tokens or biometric templates in public issues. Until a private reporting contact is configured, use the repository host's private vulnerability reporting if enabled.

Architecture requirements:
- Biometrics remain on-device by default; there is no cloud embeddings schema.
- Owner-scoped RLS on every personal table; composite owner/ID foreign keys prevent cross-account associations.
- Cloud uploads require user opt-in and use a private bucket with owner-prefixed paths.
- Never expose service-role keys in web or mobile clients.
- API session verification fails closed; unimplemented endpoints return 501.
- AI, sharing, printing, export and deletion orchestration need consent, authorization, audit and retention checks before launch.
- Deleting an account must revoke sessions, cancel jobs and remove media before Auth deletion. A database cascade alone does not delete Storage objects.
- RLS and private storage are not end-to-end encryption. Choose and document any encrypted-backup key management separately.

Launch gates: dependency audit, Supabase advisors and local integration tests, authorization coverage, consent UX, account export/deletion, retention policy, content security policy, abuse controls, accessibility and device testing.

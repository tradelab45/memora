# Background worker boundary

Future workers consume owner-scoped jobs: event clustering, book layout, PDF rendering and printing.
The milestone ships an explicit handler skeleton, not a running queue or renderer.

Keep face matching on-device. A caption task may use only consented photos/context; never infer personal feelings or events.
Workers need idempotency, retry limits, cancellation, signed media access and no personal data in logs.
Use a separately scoped server credential. The API and clients never receive worker credentials.

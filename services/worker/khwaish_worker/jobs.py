from dataclasses import dataclass
from typing import Literal
from uuid import UUID


@dataclass(frozen=True)
class Job:
    id: UUID
    owner_id: UUID
    kind: Literal["book_layout", "pdf_export", "caption_suggestion", "print_order"]
    resource_id: UUID
    idempotency_key: str


def process(job: Job) -> None:
    """Implement adapters after durable queue and consent checks are available."""
    raise NotImplementedError(f"Worker adapter for {job.kind} is not enabled.")

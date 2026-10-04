from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Contract(BaseModel):
    # Reject undeclared payloads, including face embeddings and reference photos.
    model_config = ConfigDict(extra="forbid")


class Problem(BaseModel):
    type: str
    title: str
    status: int
    detail: str
    request_id: str


class Health(Contract):
    status: str = "ok"
    version: str = "0.1.0"


class PersonCreate(Contract):
    display_name: str = Field(min_length=1, max_length=80)


class Person(PersonCreate):
    id: UUID
    created_at: datetime


class MemoryCreate(Contract):
    photo_id: UUID
    person_ids: list[UUID] = Field(default_factory=list, max_length=3)
    occurred_at: datetime
    caption: str = Field(min_length=1, max_length=280)
    title: str | None = Field(default=None, max_length=120)
    favorite: bool = False


class Memory(MemoryCreate):
    id: UUID
    created_at: datetime


class MemoryPatch(Contract):
    caption: str | None = Field(default=None, min_length=1, max_length=280)
    title: str | None = Field(default=None, max_length=120)
    favorite: bool | None = None


class BookKind(StrEnum):
    monthly = "monthly"
    person = "person"
    trip = "trip"
    annual = "annual"
    custom = "custom"


class BookCreate(Contract):
    title: str = Field(min_length=1, max_length=120)
    kind: BookKind
    memory_ids: list[UUID] = Field(min_length=1, max_length=200)


class Book(Contract):
    id: UUID
    title: str
    kind: BookKind
    status: str
    created_at: datetime


class PageResult(Contract):
    items: list[Memory]
    next_cursor: str | None = None


class PeopleResult(Contract):
    items: list[Person]


class BooksResult(Contract):
    items: list[Book]


class Job(Contract):
    id: UUID
    kind: str
    status: str
    progress: int = Field(ge=0, le=100)

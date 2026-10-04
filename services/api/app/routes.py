from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, HTTPException, Query
from app.core.auth import CurrentUser
from app.models import (
    Book, BookCreate, BooksResult, Job, Memory, MemoryCreate, MemoryPatch,
    PageResult, PeopleResult, Person, PersonCreate, Problem,
)

router = APIRouter(prefix="/v1")
errors = {code: {"model": Problem} for code in (401, 403, 404, 422, 501, 503)}


def pending() -> None:
    raise HTTPException(501, "This contract is scaffolded; persistence is not enabled in milestone 1.")


@router.get("/me", tags=["account"], responses=errors)
async def me(user: CurrentUser) -> dict[str, str]:
    return {"user_id": str(user.user_id)}


@router.get("/people", response_model=PeopleResult, tags=["people"], responses=errors)
async def people_list(user: CurrentUser):
    pending()


@router.post("/people", response_model=Person, status_code=201, tags=["people"], responses=errors)
async def people_create(payload: PersonCreate, user: CurrentUser):
    pending()


@router.delete("/people/{person_id}", status_code=204, tags=["people"], responses=errors)
async def people_delete(person_id: UUID, user: CurrentUser):
    pending()


@router.get("/memories", response_model=PageResult, tags=["memories"], responses=errors)
async def memories_list(
    user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    cursor: Annotated[str | None, Query(max_length=200)] = None,
):
    pending()


@router.post("/memories", response_model=Memory, status_code=201, tags=["memories"], responses=errors)
async def memories_create(payload: MemoryCreate, user: CurrentUser):
    pending()


@router.patch("/memories/{memory_id}", response_model=Memory, tags=["memories"], responses=errors)
async def memories_update(memory_id: UUID, payload: MemoryPatch, user: CurrentUser):
    pending()


@router.delete("/memories/{memory_id}", status_code=204, tags=["memories"], responses=errors)
async def memories_delete(memory_id: UUID, user: CurrentUser):
    pending()


@router.get("/books", response_model=BooksResult, tags=["books"], responses=errors)
async def books_list(user: CurrentUser):
    pending()


@router.post("/books", response_model=Book, status_code=201, tags=["books"], responses=errors)
async def books_create(payload: BookCreate, user: CurrentUser):
    pending()


@router.get("/books/{book_id}", response_model=Book, tags=["books"], responses=errors)
async def books_get(book_id: UUID, user: CurrentUser):
    pending()


@router.get("/jobs/{job_id}", response_model=Job, tags=["jobs"], responses=errors)
async def jobs_get(job_id: UUID, user: CurrentUser):
    pending()

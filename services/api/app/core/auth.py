from typing import Annotated
from uuid import UUID

import httpx
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import Settings, get_settings

bearer = HTTPBearer(auto_error=False)


class Principal(BaseModel):
    user_id: UUID


async def require_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> Principal:
    if credentials is None:
        raise HTTPException(401, "A bearer token is required.", headers={"WWW-Authenticate": "Bearer"})
    if not settings.supabase_url or not settings.supabase_publishable_key:
        raise HTTPException(503, "Authentication is not configured.")
    try:
        # Supabase validates the session; client-supplied owner IDs are never trusted.
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                settings.supabase_url.rstrip("/") + "/auth/v1/user",
                headers={
                    "Authorization": "Bearer " + credentials.credentials,
                    "apikey": settings.supabase_publishable_key,
                },
            )
        if response.status_code in (401, 403):
            raise HTTPException(401, "Invalid or expired session.", headers={"WWW-Authenticate": "Bearer"})
        if response.status_code != 200:
            raise HTTPException(503, "Authentication is temporarily unavailable.")
        return Principal(user_id=UUID(response.json()["id"]))
    except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
        raise HTTPException(503, "Authentication is temporarily unavailable.") from exc


CurrentUser = Annotated[Principal, Depends(require_user)]

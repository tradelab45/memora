from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.models import Health
from app.routes import router

app = FastAPI(
    title="MEMORA API",
    version="0.1.0",
    description="Privacy-first orchestration contracts. Milestone 1: health and session verification "
                "are implemented; persistence endpoints authenticate and return 501.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["X-Request-ID"],
)


@app.middleware("http")
async def request_context(request: Request, call_next):
    # Generate IDs ourselves; never echo arbitrary headers or log personal payloads.
    request.state.request_id = str(uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    return response


def problem(request: Request, status: int, detail: str, headers=None):
    return JSONResponse(
        status_code=status,
        media_type="application/problem+json",
        headers=headers,
        content={
            "type": f"urn:memora:error:{status}",
            "title": "Request could not be completed",
            "status": status,
            "detail": detail,
            "request_id": getattr(request.state, "request_id", str(UUID(int=0))),
        },
    )


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    return problem(request, exc.status_code, str(exc.detail), exc.headers)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    # Do not echo captions, tokens or unknown biometric fields into errors.
    return problem(request, 422, "The request does not match the API contract.")


@app.get("/health", response_model=Health, tags=["operations"])
async def health() -> Health:
    return Health()


app.include_router(router)

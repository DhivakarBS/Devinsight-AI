from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, Base
from backend.routers import auth as auth_router
from backend.routers import github as github_router

app = FastAPI(title="DevInsight AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "DevInsight AI Backend Running 🚀"
    }


app.include_router(
    auth_router.router,
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    github_router.router,
    prefix="/api/github",
    tags=["github"]
)
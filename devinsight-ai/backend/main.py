from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import auth as auth_router, github as github_router

app = FastAPI(title="DevInsight AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # create tables (simple approach for initial scaffold)
    Base.metadata.create_all(bind=engine)


app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(github_router.router, prefix="/api/github", tags=["github"])
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers.auth import router as auth_router
from routers.users import router as user_router

app = FastAPI(title="DevInsight AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(user_router)

@app.get("/")
def root():
    return {
        "message": "DevInsight AI Backend Running 🚀"
    }
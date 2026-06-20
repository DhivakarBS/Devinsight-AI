from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user

from database import get_db
from models.user import User
from models.github_analysis import GithubAnalysis

from schemas.user import UserCreate, UserResponse
from schemas.github import GithubRequest

from services.github_service import get_github_profile
from services.insight_service import generate_insights
router = APIRouter()


@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        username=user.username,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/analyze-github")
def analyze_github(
    data: GithubRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    profile = get_github_profile(data.username)

    if not profile:
        return {"error": "GitHub user not found"}

    insights = generate_insights(profile)

    analysis = GithubAnalysis(
        username=profile["username"],
        top_language=profile["top_language"],
        followers=profile["followers"],
        public_repos=profile["public_repos"],
        total_stars=profile["total_stars"],
        developer_score=profile["developer_score"],
        summary=insights["summary"]
    )

    db.add(analysis)
    db.commit()

    return {
        **profile,
        **insights
    }


@router.get("/analysis-history")
def get_analysis_history(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return db.query(GithubAnalysis).all()
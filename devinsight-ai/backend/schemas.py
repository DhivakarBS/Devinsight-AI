from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GithubAnalyzeRequest(BaseModel):
    github_username: str


class AnalyzeRequest(BaseModel):
    username: str


class SkillOut(BaseModel):
    skill_name: str
    score: float

    class Config:
        orm_mode = True


class ProfileOut(BaseModel):
    id: int
    github_username: str
    followers: int
    stars: int
    repositories: Any
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None
    html_url: Optional[str] = None
    blog: Optional[str] = None
    developer_score: float = 0.0
    public_repos: int = 0
    total_stars: int = 0
    top_language: Optional[str] = None
    language_distribution: Optional[dict] = {}
    strengths: List[str] = []
    summary: Optional[str] = None
    skills: List[SkillOut] = []

    class Config:
        orm_mode = True

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, index=True, nullable=False)
    email = Column(String(256), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class GithubProfile(Base):
    __tablename__ = "github_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    github_username = Column(String(256), index=True, nullable=False)
    repositories = Column(JSON, default=list)
    followers = Column(Integer, default=0)
    stars = Column(Integer, default=0)
    analyzed_at = Column(DateTime, default=datetime.utcnow)
    # enhanced profile fields
    avatar_url = Column(String(1024), nullable=True)
    bio = Column(String(1024), nullable=True)
    location = Column(String(256), nullable=True)
    company = Column(String(256), nullable=True)
    html_url = Column(String(1024), nullable=True)
    blog = Column(String(1024), nullable=True)
    developer_score = Column(Float, default=0.0)

    skills = relationship("Skill", back_populates="profile")
    assessments = relationship("Assessment", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("github_profiles.id", ondelete="CASCADE"))
    skill_name = Column(String(128), index=True)
    score = Column(Float, default=0.0)

    profile = relationship("GithubProfile", back_populates="skills")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("github_profiles.id", ondelete="CASCADE"))
    target_role = Column(String(128))
    readiness_score = Column(Float, default=0.0)
    missing_skills = Column(JSON, default=list)

    profile = relationship("GithubProfile", back_populates="assessments")

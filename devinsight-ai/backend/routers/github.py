from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services import github_service, ai_service
from backend import models
from backend import schemas
from backend.auth import get_current_user

router = APIRouter()


@router.post("/analyze", response_model=schemas.ProfileOut)
def analyze(payload: schemas.AnalyzeRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        data = github_service.analyze_profile(payload.username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # persist basic profile (store main fields)
    profile = models.GithubProfile(
        user_id=user.id,
        github_username=payload.username,
        repositories=data.get("repositories", []),
        followers=data.get("followers", 0),
        stars=data.get("total_stars", 0),
        avatar_url=data.get("avatar_url"),
        bio=data.get("bio"),
        location=data.get("location"),
        company=data.get("company"),
        html_url=data.get("html_url"),
        blog=data.get("blog"),
        developer_score=data.get("developer_score", 0.0),
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    # run basic skill inference and store skills (if none persisted yet)
    skills = github_service.infer_skills_from_repos(data.get("repositories", []))
    for sname, score in skills.items():
        sk = models.Skill(profile_id=profile.id, skill_name=sname, score=score)
        db.add(sk)
    db.commit()

    db.refresh(profile)

    # build response combining persisted profile and analysis details
    skill_objs = db.query(models.Skill).filter(models.Skill.profile_id == profile.id).all()
    skills_out = [{"skill_name": s.skill_name, "score": s.score} for s in skill_objs]

    response = {
        "id": profile.id,
        "github_username": profile.github_username,
        "followers": profile.followers,
        "stars": profile.stars,
        "repositories": data.get("repositories", []),
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "location": profile.location,
        "company": profile.company,
        "html_url": profile.html_url,
        "blog": profile.blog,
        "developer_score": profile.developer_score,
        "public_repos": data.get("public_repos", len(data.get("repositories", []))),
        "total_stars": data.get("total_stars", 0),
        "top_language": data.get("top_language"),
        "language_distribution": data.get("language_distribution", {}),
        "strengths": data.get("strengths", []),
        "summary": data.get("summary", None),
        "skills": skills_out,
    }

    return response



@router.get("/history", response_model=list[schemas.ProfileOut])
def history(
    username: str | None = None,
    language: str | None = None,
    sort_by: str | None = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    q = db.query(models.GithubProfile).filter(models.GithubProfile.user_id == user.id)
    if username:
        q = q.filter(models.GithubProfile.github_username.ilike(f"%{username}%"))
    if language:
        q = q.filter(models.GithubProfile.repositories.op("@>")([{"language": language}]))
    if sort_by == "developer_score":
        q = q.order_by(models.GithubProfile.developer_score.desc())
    results = q.all()
    # attach skills
    for p in results:
        p.skills = db.query(models.Skill).filter(models.Skill.profile_id == p.id).all()
    return results


@router.post("/career-recommendations")
def career_recommendations(payload: schemas.AnalyzeRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Rule-based career recommendations based on latest stored profile or live analysis
    profile = db.query(models.GithubProfile).filter(models.GithubProfile.github_username == payload.username, models.GithubProfile.user_id == user.id).order_by(models.GithubProfile.analyzed_at.desc()).first()
    if profile:
        skills = {s.skill_name: s.score for s in db.query(models.Skill).filter(models.Skill.profile_id == profile.id)}
        profile_summary = {"skills": skills, "developer_score": profile.developer_score, "top_language": None}
    else:
        data = github_service.analyze_profile(payload.username)
        skills_map = {s["skill_name"]: s["score"] for s in data.get("skills", [])} if data.get("skills") else github_service.infer_skills_from_repos(data.get("repositories", []))
        profile_summary = {"skills": skills_map, "developer_score": data.get("developer_score"), "top_language": data.get("top_language")}

    rec = ai_service.generate_career_advice(profile_summary, target_role="Full Stack Developer")
    return rec

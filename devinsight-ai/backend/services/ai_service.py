import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def generate_career_advice(profile_summary: dict, target_role: str) -> dict:
    # Enhanced placeholder logic that combines developer_score and top language
    skills = profile_summary.get("skills", {})
    dev_score = profile_summary.get("developer_score", 0)
    top_language = profile_summary.get("top_language")

    role_requirements = {
        "Backend Developer": ["Python", "FastAPI", "Databases"],
        "Full Stack Developer": ["React", "JavaScript", "Backend Development"],
        "AI/ML Engineer": ["Machine Learning", "Python", "Data Science"],
        "Data Scientist": ["Python", "Data Analysis", "Statistics"],
    }

    reqs = role_requirements.get(target_role, [])
    missing = [r for r in reqs if r not in skills]

    strengths = sorted(list(skills.keys()), key=lambda k: -skills.get(k, 0))[:5]
    weaknesses = missing

    recommended_skills = missing[:5]
    project_ideas = []
    career_paths = []

    # Simple rules for project ideas
    if top_language:
        project_ideas.append(f"Build a portfolio project using {top_language}")

    if dev_score > 70:
        career_paths.append("Senior Developer / Tech Lead")
    elif dev_score > 45:
        career_paths.append("Mid-level Developer")
    else:
        career_paths.append("Junior Developer / Bootcamp Learner")

    project_ideas += [f"Implement a {target_role} sample project: TODO features based on {', '.join(recommended_skills)}"]

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommended_skills": recommended_skills,
        "project_ideas": project_ideas,
        "career_paths": career_paths,
    }

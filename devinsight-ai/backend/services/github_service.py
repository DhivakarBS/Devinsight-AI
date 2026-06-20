import os
import requests
from collections import Counter

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Accept": "application/vnd.github.v3+json"}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"token {GITHUB_TOKEN}"


def fetch_user(username: str):
    url = f"https://api.github.com/users/{username}"
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    return resp.json()


def fetch_repos(username: str):
    url = f"https://api.github.com/users/{username}/repos?per_page=100"
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    return resp.json()


def analyze_profile(username: str):
    user = fetch_user(username)
    repos = fetch_repos(username)

    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    total_forks = sum(r.get("forks_count", 0) for r in repos)
    languages = Counter()
    simplified_repos = []
    for r in repos:
        simplified_repos.append({
            "name": r.get("name"),
            "description": r.get("description"),
            "stars": r.get("stargazers_count", 0),
            "forks": r.get("forks_count", 0),
            "language": r.get("language"),
            "topics": r.get("topics", []),
            "html_url": r.get("html_url"),
        })
        if r.get("language"):
            languages.update([r.get("language")])

    # compute developer score and top language
    developer_score = compute_developer_score(repos, total_stars, user.get("followers", 0))
    top_language = languages.most_common(1)[0][0] if languages else None

    # strengths = top skills inferred
    skills_map = infer_skills_from_repos(simplified_repos)
    strengths = sorted(list(skills_map.keys()), key=lambda k: -skills_map.get(k, 0))[:6]

    # short summary
    summary = f"{user.get('login')} has {len(repos)} public repositories with top language {top_language or 'N/A'} and {total_stars} total stars."

    # format skills list
    skills_list = [
        {"skill_name": k, "score": float(v)} for k, v in skills_map.items()
    ]

    return {
        "login": user.get("login"),
        "followers": user.get("followers", 0),
        "following": user.get("following", 0),
        "repositories": simplified_repos,
        "public_repos": user.get("public_repos", len(repos)),
        "total_stars": total_stars,
        "stars": total_stars,
        "forks": total_forks,
        "language_distribution": dict(languages),
        # enhanced profile fields
        "avatar_url": user.get("avatar_url"),
        "bio": user.get("bio"),
        "location": user.get("location"),
        "company": user.get("company"),
        "html_url": user.get("html_url"),
        "blog": user.get("blog"),
        "developer_score": developer_score,
        "top_language": top_language,
        "strengths": strengths,
        "summary": summary,
        "skills": skills_list,
    }


def infer_skills_from_repos(repos):
    # Simple heuristics: map languages/topics to skills and produce confidence scores
    weight = Counter()
    for r in repos:
        lang = r.get("language")
        if lang:
            weight[lang.lower()] += 1
        for t in (r.get("topics") or []):
            weight[t.lower()] += 0.8

    # normalize to 0..1
    if not weight:
        return {}
    maxv = max(weight.values())
    skills = {k: round(v / maxv, 2) for k, v in weight.items()}
    # map common languages/keywords to canonical skills
    mapping = {
        "js": "JavaScript",
        "javascript": "JavaScript",
        "python": "Python",
        "java": "Java",
        "react": "React",
        "fastapi": "FastAPI",
        "machine-learning": "Machine Learning",
        "ml": "Machine Learning",
    }
    out = {}
    for k, v in skills.items():
        key = mapping.get(k, k.title())
        out[key] = max(out.get(key, 0), v)

    return out


def compute_developer_score(repos, total_stars, followers):
    # Basic scoring heuristic: combine repo count, stars, followers, language diversity
    repo_count = len(repos)
    language_set = set(r.get("language") for r in repos if r.get("language"))
    language_diversity = len(language_set)

    # normalize components
    score = 0.0
    score += min(repo_count, 50) * 1.2  # up to 60
    score += min(total_stars, 200) * 0.3  # up to 60
    score += min(followers, 1000) * 0.02  # up to 20
    score += min(language_diversity, 10) * 2  # up to 20

    # scale to 0-100
    final = max(0.0, min(100.0, round(score, 2)))
    return final
import requests
from collections import Counter


def get_github_profile(username: str):

    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos"

    user_response = requests.get(user_url)
    repos_response = requests.get(repos_url)

    if user_response.status_code != 200:
        return None

    user_data = user_response.json()
    repos_data = repos_response.json()

    total_stars = 0
    languages = []

    for repo in repos_data:

        total_stars += repo["stargazers_count"]

        if repo["language"]:
            languages.append(repo["language"])

    top_language = "Unknown"

    if languages:
        top_language = Counter(languages).most_common(1)[0][0]

    developer_score = min(
        100,
        (
            user_data["followers"] // 1000
            + total_stars // 50
            + user_data["public_repos"]
        )
    )

    return {
        "username": user_data["login"],
        "name": user_data["name"],
        "public_repos": user_data["public_repos"],
        "followers": user_data["followers"],
        "following": user_data["following"],
        "total_stars": total_stars,
        "top_language": top_language,
        "developer_score": developer_score
    }
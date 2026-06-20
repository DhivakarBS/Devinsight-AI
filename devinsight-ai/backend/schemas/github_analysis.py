from pydantic import BaseModel

class GithubAnalysisResponse(BaseModel):
    id: int
    username: str
    top_language: str
    followers: int
    public_repos: int
    total_stars: int
    developer_score: int
    summary: str

    class Config:
        from_attributes = True
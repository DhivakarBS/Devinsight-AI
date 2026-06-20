from sqlalchemy import Column, Integer, String
from database import Base

class GithubAnalysis(Base):
    __tablename__ = "github_analyses"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)
    top_language = Column(String)

    followers = Column(Integer)
    public_repos = Column(Integer)

    total_stars = Column(Integer)

    developer_score = Column(Integer)

    summary = Column(String)
from pydantic import BaseModel

class GithubRequest(BaseModel):
    username: str
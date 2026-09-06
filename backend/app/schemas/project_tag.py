from pydantic import BaseModel
from datetime import datetime


class ProjectTagCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    project_id: int
    name: str


class ProjectTagResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    project_id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

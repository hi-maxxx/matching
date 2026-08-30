from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ProjectCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    other_user_id: int
    title: str
    comment: Optional[str] = None
    genre: str
    deadline: Optional[date] = None


class ProjectResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    title: str
    comment: Optional[str] = None
    genre: str
    deadline: Optional[date] = None
    user_id1: int
    user_id2: int
    created_at: datetime

    class Config:
        from_attributes = True

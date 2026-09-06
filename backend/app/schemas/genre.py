from pydantic import BaseModel
from datetime import datetime


class GenreCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    name: str


class GenreResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel
from datetime import datetime


class ProjectTaskCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    project_id: int
    content: str


class ProjectTaskUpdate(BaseModel):
    """PATCH リクエスト時に受け取るデータ（完了/未完了の切り替え）"""
    is_done: bool


class ProjectTaskResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    project_id: int
    content: str
    is_done: bool
    created_at: datetime

    class Config:
        from_attributes = True

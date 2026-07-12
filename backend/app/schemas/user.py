from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional


class UserCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    name: str
    email: EmailStr
    password: str #← 追加


class UserUpdate(BaseModel):
    """PUT リクエスト時に受け取るデータ（全項目を一括更新）"""
    name: str
    email: EmailStr
    birth_date: Optional[date] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    name: str
    email: str
    is_active: bool
    birth_date: Optional[date] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy モデルからの変換を許可

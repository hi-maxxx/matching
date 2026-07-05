from pydantic import BaseModel
from datetime import datetime

class LikeCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    from_user_id: int
    to_user_id: int

class LikeResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    from_user_id: int
    to_user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

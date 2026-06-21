from pydantic import BaseModel, EmailStr
from datetime import datetime

class MatchingCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""

    user_id1: int
    user_id2: int
#なにを入力するかを決める
class MatchingResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id : int
    user_id1: int
    user_id2: int
    created_at: datetime
#どんあ値で返ってくるかを決める
    class Config:
        from_attributes = True

from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    sender_id: int
    receiver_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

#chatroom_idを削除MessageCreateからsender_idを削除しました。理由は、教材のスライド7枚目にあった通り、**「本人しか名乗れない情報（誰が送ったか）は、フロントから送らせずサーバー側でJWTから取り出す」**のが正しい設計だからです。sender_idは크ライアントが指定するのではなく、ログイン中のユーザー情報（JWT）から自動的に決まるべきですMessageResponseには表示用としてsender_id・receiver_id両方を残しています

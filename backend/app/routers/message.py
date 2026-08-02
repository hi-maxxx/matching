from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.message import MessageCreate, MessageResponse
from app import crud

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/", response_model=list[MessageResponse])
def read_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_messages(db, skip=skip, limit=limit)

@router.get("/{user_id}/{other_user_id}", response_model=list[MessageResponse])
def read_conversation(user_id: int, other_user_id: int, db: Session = Depends(get_db)):
    """2人のユーザー間の会話を取得"""
    return crud.get_conversation(db, user_id=user_id, other_user_id=other_user_id)

@router.post("/", response_model=MessageResponse, status_code=201)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """メッセージ送信（sender_idはJWTから自動取得）"""
    return crud.create_message(db, message=message, sender_id=current_user.id)

# ここでDepends(get_current_user)を使い、JWTからsender_idを取り出す処理を組み込みます（これが教材スライド7枚目・10枚目で説明されていた「なりすまし防止」の実装部分です）。

# 変更点
# from app.core.dependencies import get_current_userを追加
# エンドポイントを/chatroom/{chatroom_id} → /{user_id}/{other_user_id}に戻し、get_conversationを呼ぶ形に変更
# create_messageエンドポイントにcurrent_user = Depends(get_current_user)を追加。これにより、リクエストのCookieに含まれるJWTから自動的にログイン中のユーザー情報が取得されます
# crud.create_messageを呼ぶ際、sender_id=current_user.idを渡しています。フロントエンドはsender_idを一切送る必要がなく、送っても無視されます。これにより「なりすまし」を防いでいます

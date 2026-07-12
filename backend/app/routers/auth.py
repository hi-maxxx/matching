from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserResponse
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_user
from app import crud

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """ログイン：メールアドレス・パスワードを照合しJWTを発行する"""
    user = crud.get_user_by_email(db, email=request.email)
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="メールアドレスまたはパスワードが違います")

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token)

@router.get("/me", response_model=UserResponse)
def read_me(current_user = Depends(get_current_user)):
    """現在ログイン中のユーザー情報を返す（フロントのContext初期化用）"""
    return current_user

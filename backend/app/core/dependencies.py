from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.config import settings
from app import crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="認証情報が正しくありません")
    except JWTError:
        raise HTTPException(status_code=401, detail="認証情報が正しくありません")

    user = crud.get_user(db, user_id=int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")
    return user

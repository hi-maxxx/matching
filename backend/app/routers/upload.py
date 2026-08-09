import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
):
    """アイコン画像をアップロードし、保存先のURLを返す"""

    # 拡張子チェック
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="対応していないファイル形式です（jpg, png, gif, webpのみ）")

    # ファイルサイズチェック
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="ファイルサイズが大きすぎます（5MBまで）")

    # 保存先フォルダがなければ作成
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # ファイル名の重複を避けるため、ユニークな名前に変える
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(content)

    # フロントから直接アクセスできるURLを返す
    return {"url": f"/uploads/{filename}"}

#解説
#UploadFile・File(...)：FastAPIが「これはファイルアップロード用の項目です」と認識するための書き方です
#Depends(get_current_user)：以前メッセージ機能で使ったのと同じ仕組みで、ログイン中の本人しかアップロードできないようにしています
#拡張子チェック・サイズチェック：不正なファイルが送られてくるのを防ぐ、最低限の安全対策です
#uuid.uuid4().hex：ランダムな文字列を生成します。これを使うことで、複数の人が同じファイル名（例: icon.png）をアップロードしても、上書きされずに済みます
#保存先はuploadsフォルダ（①で用意したDockerボリュームと連動する場所）

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import user_router
from app.routers import matching_router
from app.routers import chatroom_router
from app.routers import likes_router
from app.routers import message_router
from app.routers import user_router, auth_router
from app.routers.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My API", version="1.0.0")

 #CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(matching_router)
app.include_router(chatroom_router)
app.include_router(likes_router)
app.include_router(message_router)
app.include_router(auth_router)
app.include_router(upload_router)

# アップロードされた画像を配信できるようにする
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

#変更点
#from fastapi.staticfiles import StaticFilesを追加：これがファイルをそのまま配信するための機能です
#from app.routers.upload import router as upload_routerを追加：先ほど作ったupload.pyの中身を読み込みます
#app.include_router(upload_router)を追加：他のルーターと同様に登録
#app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")を追加：これにより、uploadsフォルダに保存された画像が、http://localhost:8001/uploads/ファイル名というURLでブラウザから直接見られるようになります

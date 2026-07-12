from fastapi import FastAPI
from app.routers import user_router
from app.routers import matching_router
from app.routers import chatroom_router
from app.routers import likes_router
from app.routers import message_router
from app.routers import user_router, auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My API", version="1.0.0")

 #CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Next.js のオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(matching_router)
app.include_router(chatroom_router)
app.include_router(likes_router)
app.include_router(message_router)  # ← 追加
app.include_router(auth_router)  # ← 追加

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

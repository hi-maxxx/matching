// GET レスポンス用（FastAPI の MessageResponse に対応）
export type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
};

// POST リクエスト用（FastAPI の MessageCreate に対応）
export type MessageCreate = {
  receiver_id: number;
  content: string;
};

//型定義（types/message.ts）— バックエンドのMessageCreate/MessageResponseに対応する型
//ポイント: バックエンドのschemas/message.pyと1対1で対応させています。MessageCreateにsender_idが無いのは、以前直した通り「サーバー側がJWTから自動取得するため、フロントから送る必要がない」ためです。

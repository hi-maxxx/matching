import { User } from "./user";

export type { User };

// GET レスポンス用(FastAPI の LikeResponse に対応)
export type Like = {
  id: number;
  from_user_id: number;
  to_user_id: number;
  created_at: string;
};

// POST リクエスト用(FastAPI の LikeCreate に対応)
export type LikeCreate = {
  from_user_id: number;
  to_user_id: number;
};

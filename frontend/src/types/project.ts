// GET レスポンス用（FastAPI の ProjectResponse に対応）
export type Project = {
  id: number;
  title: string;
  comment: string | null;
  genre: string;
  deadline: string | null;
  user_id1: number;
  user_id2: number;
  created_at: string;
};

// POST リクエスト用（FastAPI の ProjectCreate に対応）
export type ProjectCreate = {
  other_user_id: number;
  title: string;
  comment?: string | null;
  genre: string;
  deadline?: string | null;
};

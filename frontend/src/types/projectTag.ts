// GET レスポンス用（FastAPI の ProjectTagResponse に対応）
export type ProjectTag = {
  id: number;
  project_id: number;
  name: string;
  created_at: string;
};

// POST リクエスト用（FastAPI の ProjectTagCreate に対応）
export type ProjectTagCreate = {
  project_id: number;
  name: string;
};

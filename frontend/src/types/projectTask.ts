// GET レスポンス用（FastAPI の ProjectTaskResponse に対応）
export type ProjectTask = {
  id: number;
  project_id: number;
  content: string;
  is_done: boolean;
  created_at: string;
};

// POST リクエスト用（FastAPI の ProjectTaskCreate に対応）
export type ProjectTaskCreate = {
  project_id: number;
  content: string;
};

// PATCH リクエスト用（FastAPI の ProjectTaskUpdate に対応）
export type ProjectTaskUpdate = {
  is_done: boolean;
};

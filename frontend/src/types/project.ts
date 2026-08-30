// ジャンルの選択肢（この配列がプルダウンの選択肢そのもの。バックエンドは文字列として受け取るだけ）
export const GENRES = [
  "マンガ",
  "小説",
  "イラスト",
  "ゲーム",
  "サスペンス",
  "コメディ",
  "ギャグ",
  "恋愛",
] as const;

export type Genre = (typeof GENRES)[number];

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
  genre: Genre;
  deadline?: string | null;
};

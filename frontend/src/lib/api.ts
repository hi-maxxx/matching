import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

/*変更点は2箇所だけです：

type RequestOptionsのmethodに"PATCH"を追加
apiオブジェクトにpatchメソッドを追加

*/
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

/**
 * API から返ってきたエラー。
 * fieldErrors には { email: "メールの形式が正しくありません" } のように
 * 入力欄ごとのエラーが入る（バリデーションエラー = 422 のとき）。
 */
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// FastAPI のエラー形式を ApiError に変換する
function toApiError(status: number, data: unknown): ApiError {
  const detail = (data as { detail?: unknown })?.detail;

  // 422 バリデーションエラー: detail が配列で返ってくる
  // 例) [{ loc: ["body", "email"], msg: "..." }]
  if (Array.isArray(detail)) {
    const fieldErrors: Record<string, string> = {};
    for (const item of detail) {
      const loc = (item as { loc?: unknown[] })?.loc;
      const field = Array.isArray(loc) ? String(loc[loc.length - 1]) : "";
      const msg = (item as { msg?: string })?.msg ?? "入力内容が正しくありません";
      if (field && !fieldErrors[field]) fieldErrors[field] = msg;
    }
    const first = Object.values(fieldErrors)[0];
    return new ApiError(first ?? "入力内容を確認してください", status, fieldErrors);
  }

  if (typeof detail === "string") return new ApiError(detail, status);
  return new ApiError(`HTTP error: ${status}`, status);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;
  const token = Cookies.get("access_token"); // クッキーからアクセストークンを取得 追加

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),// アクセストークンが存在する場合のみ Authorization ヘッダーを追加　追加
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw toApiError(res.status, data);
  }

  // 204 No Content など body が空の場合の考慮
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// 各メソッドのショートハンド
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

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
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP error: ${res.status}`);
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

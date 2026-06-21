"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function UserDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { user, loading, error, updateUser } = useUser(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          エラー: {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500">ユーザーが見つかりません</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.is_active ? "有効" : "無効"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                生年月日
              </dt>
              <dd className="mt-1 text-sm text-gray-800">
                {user.birth_date ?? "未設定"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                登録日時
              </dt>
              <dd className="mt-1 text-sm text-gray-800">
                {new Date(user.created_at).toLocaleString("ja-JP")}
              </dd>
            </div>
            {user.bio && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  自己紹介
                </dt>
                <dd className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                  {user.bio}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </main>
  );
}

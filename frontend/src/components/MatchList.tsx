"use client";

import { useMatching } from "@/hooks/useMatching";
import { useAuth } from "@/hooks/useAuth";
import MatchCard from "./MatchCard";

export default function MatchList() {
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user ? user.id : null;
  const { users, loading, error, sendLike, hasLiked } = useMatching(currentUserId);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        ログインしてください
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-400 text-sm">読み込み中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">エラー: {error}</p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            マッチング相手一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              {users.length} 件
            </span>
          </h2>

          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              相手がいません
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => (
                <MatchCard
                  key={u.id}
                  user={u}
                  liked={hasLiked(u.id)}
                  onLike={sendLike}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

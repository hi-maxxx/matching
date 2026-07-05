"use client";

import { useState } from "react";
import { useMatching } from "@/hooks/useMatching";
import MatchCard from "./MatchCard";

export default function MatchList() {
  // ログイン機能ができるまでの暫定処置:自分のIDを手動選択する
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { users, loading, error, sendLike, hasLiked } = useMatching(currentUserId);

  return (
    <div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
        <label className="text-xs font-medium text-yellow-800 block mb-1">
          [暫定] 自分のユーザーIDを入力(ログイン機能実装後に削除予定)
        </label>
        <input
          type="number"
          value={currentUserId ?? ""}
          onChange={(e) =>
            setCurrentUserId(e.target.value ? Number(e.target.value) : null)
          }
          placeholder="例: 1"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32"
        />
      </div>

      {currentUserId === null ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          自分のユーザーIDを入力してください
        </div>
      ) : loading ? (
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
              {users.map((user) => (
                <MatchCard
                  key={user.id}
                  user={user}
                  liked={hasLiked(user.id)}
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

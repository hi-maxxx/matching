"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { User, Like, LikeCreate } from "@/types/match";

export function useMatching(currentUserId: number | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (currentUserId === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [allUsers, likes] = await Promise.all([
        api.get<User[]>("/users/"),
        api.get<Like[]>(`/likes/sent/${currentUserId}`),
      ]);
      // 自分自身は一覧から除外する
      setUsers(allUsers.filter((u) => u.id !== currentUserId));
      setSentLikes(likes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // 「いいね」送信
  const sendLike = async (toUserId: number) => {
    if (currentUserId === null) return;
    const input: LikeCreate = { from_user_id: currentUserId, to_user_id: toUserId };
    try {
      const newLike = await api.post<Like>("/likes/", input);
      setSentLikes((prev) => [...prev, newLike]);
    } catch (e) {
      throw e instanceof Error ? e : new Error("いいねの送信に失敗しました");
    }
  };

  // 既にいいね済みかどうかの判定
  const hasLiked = (userId: number) =>
    sentLikes.some((like) => like.to_user_id === userId);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, loading, error, sendLike, hasLiked, refetch: fetchData };
}

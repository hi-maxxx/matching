"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, UserUpdate } from "@/types/user";

export function useUser(id: number) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<User>(`/users/${id}`);
        setUser(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  // プロフィール更新（PUT）
  const updateUser = async (input: UserUpdate) => {
    try {
      const updated = await api.put<User>(`/users/${id}`, input);
      setUser(updated);
      return updated;
    } catch (e) {
      throw e instanceof Error ? e : new Error("更新に失敗しました");
    }
  };

  return { user, loading, error, updateUser};
}

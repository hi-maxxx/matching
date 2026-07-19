"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, UserCreate } from "@/types/user";

export function useUsers() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // 一覧取得
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<User[]>("/users/");
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // ユーザー作成
  const createUser = async (input: UserCreate) => {
    try {
      const newUser = await api.post<User>("/users/", input);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (e) {
      throw e instanceof Error ? e : new Error("作成に失敗しました");
    }
  };

  // ユーザー無効化
  const deactivateUser = async (id: number) => {
    try {
      await api.patch<User>(`/users/${id}/deactivate`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      throw e instanceof Error ? e : new Error("無効化に失敗しました");
    }
  };

// ユーザー削除
  //const deleteUser = async (id: number) => {
   // try {
   //   await api.delete(`/users/${id}`);
     // setUsers((prev) => prev.filter((u) => u.id !== id));
   // } catch (e) {
   ///   throw e instanceof Error ? e : new Error("削除に失敗しました");
   // }
  //};


  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, createUser, deactivateUser, refetch: fetchUsers };
}

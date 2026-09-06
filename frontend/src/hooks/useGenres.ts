"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Genre = {
  id: number;
  name: string;
  created_at: string;
};

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Genre[]>("/genres/");
        setGenres(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "ジャンルの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return { genres, loading, error };
}

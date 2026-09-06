"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { ProjectTag, ProjectTagCreate } from "@/types/projectTag";

export function useProjectTags(projectId: number) {
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タグ一覧を取得（追加・削除後にも呼び直す）
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ProjectTag[]>(`/project-tags/${projectId}`);
      setTags(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "タグの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // タグ追加 → 成功したら一覧を取り直す
  const addTag = async (name: string) => {
    const body: ProjectTagCreate = { project_id: projectId, name };
    try {
      await api.post<ProjectTag>("/project-tags/", body);
      await fetchTags();
    } catch (e) {
      throw e instanceof Error ? e : new Error("タグの追加に失敗しました");
    }
  };

  // タグ削除 → 成功したら一覧を取り直す
  const removeTag = async (tagId: number) => {
    try {
      await api.delete(`/project-tags/${tagId}`);
      await fetchTags();
    } catch (e) {
      throw e instanceof Error ? e : new Error("タグの削除に失敗しました");
    }
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, addTag, removeTag };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { ProjectTask, ProjectTaskCreate, ProjectTaskUpdate } from "@/types/projectTask";

export function useProjectTasks(projectId: number) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 作業項目一覧を取得（追加・切り替え・削除後にも呼び直す）
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ProjectTask[]>(`/project-tasks/${projectId}`);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "作業項目の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 作業項目を追加 → 成功したら一覧を取り直す
  const addTask = async (content: string) => {
    const body: ProjectTaskCreate = { project_id: projectId, content };
    try {
      await api.post<ProjectTask>("/project-tasks/", body);
      await fetchTasks();
    } catch (e) {
      throw e instanceof Error ? e : new Error("作業項目の追加に失敗しました");
    }
  };

  // 完了/未完了を切り替え → 成功したら一覧を取り直す
  const toggleTask = async (taskId: number, isDone: boolean) => {
    const body: ProjectTaskUpdate = { is_done: isDone };
    try {
      await api.patch<ProjectTask>(`/project-tasks/${taskId}`, body);
      await fetchTasks();
    } catch (e) {
      throw e instanceof Error ? e : new Error("更新に失敗しました");
    }
  };

  // 作業項目を削除 → 成功したら一覧を取り直す
  const removeTask = async (taskId: number) => {
    try {
      await api.delete(`/project-tasks/${taskId}`);
      await fetchTasks();
    } catch (e) {
      throw e instanceof Error ? e : new Error("削除に失敗しました");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 進捗率（％）を計算。作業項目が0件のときは0%にする
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((tasks.filter((t) => t.is_done).length / tasks.length) * 100);

  return { tasks, loading, error, addTask, toggleTask, removeTask, progress };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Project, ProjectCreate } from "@/types/project";

export function useProjects(currentUserId: number | null, otherUserId: number | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (currentUserId === null || otherUserId === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Project[]>(`/projects/${currentUserId}/${otherUserId}`);
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, otherUserId]);

  const createProject = async (input: Omit<ProjectCreate, "other_user_id">) => {
    if (otherUserId === null) return;
    const body: ProjectCreate = { ...input, other_user_id: otherUserId };
    try {
      await api.post<Project>("/projects/", body);
      await fetchProjects();
    } catch (e) {
      throw e instanceof Error ? e : new Error("プロジェクトの作成に失敗しました");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, createProject, refetch: fetchProjects };
}

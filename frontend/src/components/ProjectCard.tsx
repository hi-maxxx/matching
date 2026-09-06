"use client";

import { useState } from "react";
import { useProjectTags } from "@/hooks/useProjectTags";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { tags, loading, addTag, removeTag } = useProjectTags(project.id);
  const [newTag, setNewTag] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setAdding(true);
    try {
      await addTag(newTag.trim());
      setNewTag("");
    } catch {
      // 必要であればここでエラー表示を追加
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{project.title}</p>
        <span className="text-xs bg-pink-50 text-pink-600 rounded-full px-2 py-0.5">
          {project.genre}
        </span>
      </div>

      {project.comment && (
        <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{project.comment}</p>
      )}
      {project.deadline && (
        <p className="text-xs text-gray-400 mt-1">期限: {project.deadline}</p>
      )}

      {/* タグ一覧 */}
      <div className="flex flex-wrap gap-1 mt-2">
        {loading ? (
          <span className="text-xs text-gray-300">タグ読み込み中...</span>
        ) : (
          tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5"
            >
              #{tag.name}
              <button
                onClick={() => removeTag(tag.id)}
                className="text-blue-400 hover:text-blue-700"
                aria-label="タグを削除"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* タグ追加フォーム */}
      <form onSubmit={handleAddTag} className="flex gap-1 mt-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="タグを追加"
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={adding || !newTag.trim()}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg px-2 py-1"
        >
          追加
        </button>
      </form>
    </div>
  );
}

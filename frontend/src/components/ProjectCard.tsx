"use client";

import { useState } from "react";
import { useProjectTags } from "@/hooks/useProjectTags";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { tags, loading: tagsLoading, addTag, removeTag } = useProjectTags(project.id);
  const [newTag, setNewTag] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    toggleTask,
    removeTask,
    progress,
  } = useProjectTasks(project.id);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setAddingTag(true);
    try {
      await addTag(newTag.trim());
      setNewTag("");
    } catch {
      // 必要であればここでエラー表示を追加
    } finally {
      setAddingTag(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    setAddingTask(true);
    try {
      await addTask(newTaskContent.trim());
      setNewTaskContent("");
    } catch {
      // 必要であればここでエラー表示を追加
    } finally {
      setAddingTask(false);
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

      {/* 進捗バー */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">進捗</span>
          <span className="text-xs font-semibold text-gray-800">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 作業項目一覧 */}
      <div className="mt-3 space-y-1">
        {tasksLoading ? (
          <span className="text-xs text-gray-300">読み込み中...</span>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={(e) => toggleTask(task.id, e.target.checked)}
                className="w-4 h-4 accent-green-500"
              />
              <span
                className={`text-xs flex-1 ${
                  task.is_done ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {task.content}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="text-gray-300 hover:text-red-500 text-xs"
                aria-label="作業項目を削除"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* 作業項目追加フォーム */}
      <form onSubmit={handleAddTask} className="flex gap-1 mt-2">
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="作業項目を追加"
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          disabled={addingTask || !newTaskContent.trim()}
          className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg px-2 py-1"
        >
          追加
        </button>
      </form>

      {/* タグ一覧 */}
      <div className="flex flex-wrap gap-1 mt-3">
        {tagsLoading ? (
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
          disabled={addingTag || !newTag.trim()}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg px-2 py-1"
        >
          追加
        </button>
      </form>
    </div>
  );
}

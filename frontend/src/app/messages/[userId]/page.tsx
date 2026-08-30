"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useConversation } from "@/hooks/useConversation";
import { useProjects } from "@/hooks/useProjects";
import { GENRES, Genre } from "@/types/project";
import Link from "next/link";

export default function ConversationPage() {
  const params = useParams();
  const otherUserId = Number(params.userId);
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user ? user.id : null;

  const { user: otherUser, loading: otherUserLoading } = useUser(otherUserId);
  const { messages, loading, error, sendMessage } = useConversation(currentUserId, otherUserId);
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    createProject,
  } = useProjects(currentUserId, otherUserId);

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  // プロジェクト作成フォーム用
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [genre, setGenre] = useState<Genre>(GENRES[0]);
  const [deadline, setDeadline] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectFormError, setProjectFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await sendMessage(content);
      setContent("");
    } catch {
      // 必要であればここでエラー表示を追加
    } finally {
      setSending(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreatingProject(true);
    setProjectFormError(null);
    try {
      await createProject({
        title,
        comment: comment || null,
        genre,
        deadline: deadline || null,
      });
      setTitle("");
      setComment("");
      setGenre(GENRES[0]);
      setDeadline("");
      setShowProjectForm(false);
    } catch (e) {
      setProjectFormError(e instanceof Error ? e.message : "作成に失敗しました");
    } finally {
      setCreatingProject(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          エラー: {error}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex flex-col flex-1">
        <Link
          href="/matching"
          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mb-4"
        >
          ← 一覧に戻る
        </Link>

        {/* 相手の名前 */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-base font-semibold text-gray-900">
            {otherUserLoading ? "読み込み中..." : otherUser?.name ?? "不明なユーザー"}
          </p>
        </div>

        {/* 2カラムレイアウト：左＝プロジェクト、右＝チャット */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">

          {/* 左: プロジェクト一覧・作成エリア */}
          <div className="md:w-2/5 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-800">プロジェクト</h2>
                <button
                  onClick={() => setShowProjectForm((v) => !v)}
                  className="text-xs bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg px-3 py-1.5 transition-colors"
                >
                  {showProjectForm ? "閉じる" : "＋ プロジェクト"}
                </button>
              </div>

              {/* 作成フォーム */}
              {showProjectForm && (
                <form onSubmit={handleCreateProject} className="mb-4 space-y-2 border border-gray-200 rounded-lg p-3">
                  {projectFormError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                      {projectFormError}
                    </p>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">タイトル</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">コメント</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ジャンル</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value as Genre)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {GENRES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">期限</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingProject || !title.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {creatingProject ? "作成中..." : "作成する"}
                  </button>
                </form>
              )}

              {/* プロジェクト一覧 */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {projectsLoading ? (
                  <p className="text-xs text-gray-400 text-center py-4">読み込み中...</p>
                ) : projectsError ? (
                  <p className="text-xs text-red-600 text-center py-4">{projectsError}</p>
                ) : projects.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">まだプロジェクトはありません</p>
                ) : (
                  projects.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                        <span className="text-xs bg-pink-50 text-pink-600 rounded-full px-2 py-0.5">
                          {p.genre}
                        </span>
                      </div>
                      {p.comment && (
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{p.comment}</p>
                      )}
                      {p.deadline && (
                        <p className="text-xs text-gray-400 mt-1">期限: {p.deadline}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 右: チャット */}
          <div className="md:w-3/5 flex flex-col">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3 overflow-y-auto min-h-[400px]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  まだメッセージはありません
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className="w-full flex">
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          isMine
                            ? "bg-pink-600 text-white ml-auto"
                            : "bg-gray-100 text-gray-900 mr-auto"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="メッセージを入力…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white text-sm font-medium rounded-lg px-5 py-2 transition-colors"
              >
                {sending ? "送信中..." : "送信"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { User } from "@/types/user";

export default function Topframe() {
  const { user, loading, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [personality, setPersonality] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setBirthDate(user?.birth_date ?? "");
    setAvatarUrl(user?.avatar_url ?? "");
    setBio(user?.bio ?? "");
    setPersonality(user?.personality ?? "");
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await api.put<User>(`/users/${user.id}`, {
        name,
        email,
        birth_date: birthDate || null,
        avatar_url: avatarUrl || null,
        bio,
        personality,
      });
      await refreshUser();
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-amber-400 rounded-3xl p-6 w-full mb-10">
        {/* アイコン＋名前 */}
        <div className="flex items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border border-white shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-center text-sm font-medium text-gray-700 shrink-0">
              アイコン
              <br />
              画像
            </div>
          )}
          <div className="flex-1 bg-white rounded-2xl px-4 py-5 text-center">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前（ペンネーム）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <p className="font-bold text-gray-900">
                {loading ? "読み込み中..." : user?.name ?? "名前（ペンネーム）"}
              </p>
            )}
          </div>
        </div>

        {/* メールアドレス */}
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 text-gray-900">
          <p className="font-medium text-center mb-2">メールアドレス</p>
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-center">{user?.email}</p>
          )}
        </div>

        {/* 生年月日 */}
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 text-gray-900">
          <p className="font-medium text-center mb-2">生年月日</p>
          {editing ? (
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-center">{user?.birth_date ?? "未設定"}</p>
          )}
        </div>

        {/* アイコン画像URL */}
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 text-gray-900">
          <p className="font-medium text-center mb-2">アイコン画像URL</p>
          {editing ? (
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-center text-sm text-gray-500 truncate">{user?.avatar_url ?? "未設定"}</p>
          )}
        </div>

        {/* 作品URL */}
        <div className="bg-white rounded-2xl px-6 py-6 mb-4 text-center text-gray-900">
          <p className="font-medium mb-2">作品URLを記載するところ</p>
        </div>

        {/* 自己紹介文 */}
        <div className="bg-white rounded-2xl px-6 py-6 mb-4 text-gray-900">
          <p className="font-medium text-center mb-2">自己紹介文</p>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-center whitespace-pre-wrap">{user?.bio || "未設定"}</p>
          )}
        </div>

        {/* 自分の性格 */}
        <div className="bg-white rounded-2xl px-6 py-6 text-gray-900">
          <p className="font-medium text-center mb-2">自分の性格</p>
          {editing ? (
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-center whitespace-pre-wrap">{user?.personality || "未設定"}</p>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
            {error}
          </p>
        )}

        {/* 編集/保存ボタン */}
        {user && (
          <div className="flex justify-center mt-4">
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-4 py-2"
                >
                  {saving ? "保存中..." : "保存する"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-white text-gray-700 text-sm font-medium rounded-lg px-4 py-2 border border-gray-300"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <button
                onClick={startEditing}
                className="bg-white text-gray-700 text-sm font-medium rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                編集する
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

//name・email・birthDate・avatarUrlの状態（useState）を追加
//それぞれの項目に「編集中は入力欄、それ以外は表示のみ」という同じパターンで欄を追加
//handleSaveで全項目を送るように変更、エラーメッセージの表示も追加
//startEditingで、編集開始時に現在の値を全項目分セットするよう変更

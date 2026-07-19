"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { User } from "@/types/user";

export default function Topframe() {
  const { user, loading, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [personality, setPersonality] = useState("");
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setBio(user?.bio ?? "");
    setPersonality(user?.personality ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.put<User>(`/users/${user.id}`, {
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        avatar_url: user.avatar_url,
        bio,
        personality,
      });
      await refreshUser();
      setEditing(false);
    } catch {
      // 必要であればここでエラー表示を追加
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
            <p className="font-bold text-gray-900">
              {loading ? "読み込み中..." : user?.name ?? "名前（ペンネーム）"}
            </p>
          </div>
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

"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

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
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = Cookies.get("access_token");
      const res = await fetch(`${API_BASE}/upload/avatar`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("画像のアップロードに失敗しました");
      }

      const data = await res.json();
      // バックエンドは相対パス（/uploads/xxx.png）を返すので、フルURLに組み立てる
      const fullUrl = `${API_BASE}${data.url}`;
      setAvatarUrl(fullUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
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

        {/* アイコン画像 */}
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 text-gray-900">
          <p className="font-medium text-center mb-2">アイコン画像</p>
          {editing ? (
            <div className="flex flex-col items-center gap-2">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="プレビュー"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="text-sm"
              />
              {uploading && <p className="text-xs text-gray-400">アップロード中...</p>}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {user?.avatar_url ? "設定済み" : "未設定"}
            </p>
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
                  disabled={saving || uploading}
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

//④ Frontend: ファイル選択＋アップロード機能をTopframe.tsxに追加
//最後にフロントエンド側です。今のavatar_urlのテキスト入力欄を、「ファイルを選ぶ」ボタンに変えます。

//修正の考え方
//<input type="file">でファイルを選ばせる
//選んだら即座にPOST /upload/avatarへ送信（FormDataという特別な形式を使う）
//返ってきたurlをavatarUrlのstateにセットする
//「保存する」ボタンを押したときに、他の項目と一緒にDBへ保存される（この部分は今のままでOK）
//変更箇所: src/components/Topframe.tsxのアイコン画像URL欄
//新しく必要になるhandleFileChange関数とuploading状態（コンポーネントの上部、他のuseStateと一緒に追加）

//なぜapi.tsのapi.postを使わないのか
//api.tsのrequest関数は、送信データを毎回JSON.stringifyでJSON文字列に変換する作りになっています。しかし画像ファイルはFormDataという特別な形式で送る必要があり、JSON文字列には変換できません。そのため、この部分だけはfetchを直接使っています。

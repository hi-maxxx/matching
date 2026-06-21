"use client";

import { useState } from "react";
import { User, UserUpdate } from "@/types/user";

type Props = {
  user: User;
  onSubmit: (input: UserUpdate) => Promise<void>;
};

export default function ProfileEditForm({ user, onSubmit }: Props) {
  const [name, setName]           = useState(user.name);
  const [email, setEmail]         = useState(user.email);
  const [birthDate, setBirthDate] = useState(user.birth_date ?? "");
  const [bio, setBio]             = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit({
        name,
        email,
        birth_date: birthDate || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-6">プロフィール編集</h2>

      {/* 成功メッセージ */}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
          プロフィールを更新しました
        </p>
      )}

      {/* エラーメッセージ */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {error}
        </p>
      )}

      {/* プロフィール画像プレビュー */}
      {avatarUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={avatarUrl}
            alt="プロフィール画像"
            className="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
        </div>
      )}

      <div className="space-y-4">
        {/* 名前 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 生年月日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            生年月日
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            自己紹介
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="自己紹介を入力してください"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* プロフィール画像URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            プロフィール画像URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            画像のURLを入力するとプレビューが表示されます
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        {submitting ? "更新中..." : "プロフィールを更新する"}
      </button>
    </form>
  );
}

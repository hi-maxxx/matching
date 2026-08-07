"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { User, UserUpdate } from "@/types/user";

type Props = {
  user: User;
  onSubmit: (input: UserUpdate) => Promise<void>;
};

// 入力欄ごとのエラーメッセージ（例: { email: "メールアドレスの形式が正しくありません" }）
type FieldErrors = Record<string, string>;

const inputClass =
  "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

// エラーがある入力欄は枠を赤くする
const borderClass = (hasError: boolean) =>
  hasError ? "border-red-400 bg-red-50" : "border-gray-300";

export default function ProfileEditForm({ user, onSubmit }: Props) {
  const [name, setName]               = useState(user.name);
  const [email, setEmail]             = useState(user.email);
  const [birthDate, setBirthDate]     = useState(user.birth_date ?? "");
  const [bio, setBio]                 = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl]     = useState(user.avatar_url ?? "");
  const [personality, setPersonality] = useState(user.personality ?? "");

  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess]         = useState(false);

  // 送信する前に、ブラウザ側でわかる範囲のチェックをする
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!name.trim()) {
      errors.name = "名前を入力してください";
    } else if (name.trim().length > 50) {
      errors.name = "名前は50文字以内で入力してください";
    }

    if (!email.trim()) {
      errors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "メールアドレスの形式が正しくありません";
    }

    if (bio.length > 500) {
      errors.bio = "自己紹介は500文字以内で入力してください";
    }

    if (personality.length > 255) {
      errors.personality = "性格は255文字以内で入力してください";
    }

    if (avatarUrl.trim() && !/^https?:\/\/.+/.test(avatarUrl.trim())) {
      errors.avatar_url = "画像URLは http:// または https:// で始めてください";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setFormError(null);

    // 1. まずブラウザ側のチェック。エラーがあれば送信しない
    const clientErrors = validate();
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setFormError("入力内容に誤りがあります。赤い項目を確認してください");
      return;
    }

    // 2. サーバーへ送る
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        birth_date: birthDate || null,
        bio: bio || null,
        avatar_url: avatarUrl.trim() || null,
        personality: personality.trim() || null,
      });
      setSuccess(true);
    } catch (err) {
      // 3. サーバー側のバリデーションエラーも同じ場所に表示する
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
        setFormError("入力内容に誤りがあります。赤い項目を確認してください");
      } else {
        setFormError(err instanceof Error ? err.message : "更新に失敗しました");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      {/* 成功メッセージ */}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
          プロフィールを更新しました
        </p>
      )}

      {/* フォーム全体のエラー */}
      {formError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {formError}
        </p>
      )}

      {/* プロフィール画像プレビュー */}
      <div className="flex justify-center mb-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="プロフィール画像"
            className="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl font-bold">
            {name.charAt(0) || "?"}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* 名前 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fieldErrors.name}
            className={`${inputClass} ${borderClass(!!fieldErrors.name)}`}
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldErrors.email}
            className={`${inputClass} ${borderClass(!!fieldErrors.email)}`}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* 生年月日 */}
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
            生年月日
          </label>
          <input
            id="birth_date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            aria-invalid={!!fieldErrors.birth_date}
            className={`${inputClass} ${borderClass(!!fieldErrors.birth_date)}`}
          />
          {fieldErrors.birth_date && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.birth_date}</p>
          )}
        </div>

        {/* 性格 */}
        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-1">
            性格
          </label>
          <input
            id="personality"
            type="text"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="例) おだやか / 明るい / インドア派"
            aria-invalid={!!fieldErrors.personality}
            className={`${inputClass} ${borderClass(!!fieldErrors.personality)}`}
          />
          {fieldErrors.personality && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.personality}</p>
          )}
        </div>

        {/* 自己紹介 */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            自己紹介
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="自己紹介を入力してください"
            aria-invalid={!!fieldErrors.bio}
            className={`${inputClass} ${borderClass(!!fieldErrors.bio)} resize-none`}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-red-600">{fieldErrors.bio ?? ""}</p>
            <p className={`text-xs ${bio.length > 500 ? "text-red-600" : "text-gray-400"}`}>
              {bio.length} / 500
            </p>
          </div>
        </div>

        {/* プロフィール画像URL */}
        <div>
          <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
            プロフィール画像URL
          </label>
          <input
            id="avatar_url"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            aria-invalid={!!fieldErrors.avatar_url}
            className={`${inputClass} ${borderClass(!!fieldErrors.avatar_url)}`}
          />
          {fieldErrors.avatar_url ? (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.avatar_url}</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              画像のURLを入力するとプレビューが表示されます
            </p>
          )}
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

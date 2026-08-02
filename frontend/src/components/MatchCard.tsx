"use client";

//了解です、A案で進めましょう。MatchCard.tsxを修正して、いいね済みの相手だけチャットボタンを表示するようにします。
//変更点
//likedがtrueの時だけ、実際に/messages/{user.id}へ遷移できる「チャット」リンクを表示
//likedがfalseの時は、クリックできないグレーアウトした「チャット」ボタン（disabledのただのボタン）を表示。title属性でホバー時に理由が分かるようにしています

import { useState } from "react";
import Link from "next/link";
import { User } from "@/types/match";

type Props = {
  user: User;
  liked: boolean;
  onLike: (id: number) => Promise<void>;
};

export default function MatchCard({ user, liked, onLike }: Props) {
  const [sending, setSending] = useState(false);

  const handleLike = async () => {
    setSending(true);
    try {
      await onLike(user.id);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-bold">
            {user.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-base font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{user.bio}</p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleLike}
          disabled={liked || sending}
          className={`flex-1 text-sm font-medium rounded-lg px-3 py-2 transition-colors ${
            liked
              ? "bg-pink-50 text-pink-400 border border-pink-100 cursor-not-allowed"
              : "bg-pink-600 text-white hover:bg-pink-700"
          }`}
        >
          {liked ? "いいね済み" : sending ? "送信中..." : "♡ いいね"}
        </button>

        {liked ? (
          <Link
            href={`/messages/${user.id}`}
            className="flex-1 text-center text-sm text-blue-600 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors"
          >
            チャット
          </Link>
        ) : (
          <button
            disabled
            title="いいねを送るとチャットできるようになります"
            className="flex-1 text-sm text-gray-300 border border-gray-100 rounded-lg px-3 py-2 cursor-not-allowed"
          >
            チャット
          </button>
        )}
      </div>
    </div>
  );
}

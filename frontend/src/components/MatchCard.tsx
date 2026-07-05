"use client";

import { useState } from "react";
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

      <button
        onClick={handleLike}
        disabled={liked || sending}
        className={`w-full mt-4 text-sm font-medium rounded-lg px-3 py-2 transition-colors ${
          liked
            ? "bg-pink-50 text-pink-400 border border-pink-100 cursor-not-allowed"
            : "bg-pink-600 text-white hover:bg-pink-700"
        }`}
      >
        {liked ? "いいね済み" : sending ? "送信中..." : "♡ いいね"}
      </button>
    </div>
  );
}

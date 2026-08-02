"use client";

//画面本体: src/app/messages/[userId]/page.tsx（新規作成）
//教材のスライド11枚目「吹き出し + 入力欄 + 送信ボタン」のデザインを参考に、Topframe.tsxと似た構成で作ります。自分が送ったメッセージと相手からのメッセージで、吹き出しの位置・色を変えます。
//ポイント
//useParams()でURLの[userId]部分（相手のID）を取得
//useAuth()で自分のログイン情報を取得
//msg.sender_id === currentUserIdで「自分が送った吹き出しか、相手が送った吹き出しか」を判定し、右寄せ・左寄せと色を切り替え
//送信中は多重送信を防ぐためdisabledにしている
//ファイルの配置場所について
//Next.js App Routerでは、[userId]という**角括弧付きのフォルダ名が「動的ルート」**になります。以下のパスに配置してください。
//frontend/src/app/messages/[userId]/page.tsx

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import Link from "next/link";

export default function ConversationPage() {
  const params = useParams();
  const otherUserId = Number(params.userId);
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user ? user.id : null;

  const { messages, loading, error, sendMessage } = useConversation(currentUserId, otherUserId);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

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
      <div className="max-w-2xl w-full mx-auto px-4 py-6 flex flex-col flex-1">
        <Link
          href="/matching"
          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mb-4"
        >
          ← 一覧に戻る
        </Link>

        {/* メッセージ一覧 */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3 overflow-y-auto min-h-[400px]">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              まだメッセージはありません
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      isMine
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-900"
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
    </main>
  );
}

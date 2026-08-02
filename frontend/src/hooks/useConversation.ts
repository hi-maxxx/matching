"use client";

//教材スライド12枚目の「画面をDBの鏡として扱う」考え方に従い、送信後は必ずDBから会話全体を取り直す設計にします（送信した1件だけをその場で足すのではなく）。以前作ったuseUsers.tsやuseMatching.tsと同じパターンです。
//ポイント
//sendMessageの中で、送信成功後にsetMessages(prev => [...prev, 新しいメッセージ])のようにその場で足すのではなく、await fetchMessages()でサーバーから会話全体を取り直しています。これが教材の「送信失敗時に表示だけされてDBに保存されていない、というズレを防ぐ」設計方針です。
//currentUserId（自分）とotherUserId（相手）の両方が必要なので、引数として受け取ります

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Message, MessageCreate } from "@/types/message";

export function useConversation(currentUserId: number | null, otherUserId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 会話を取得（送信後にも呼び直す）
  const fetchMessages = useCallback(async () => {
    if (currentUserId === null || otherUserId === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Message[]>(`/messages/${currentUserId}/${otherUserId}`);
      setMessages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, otherUserId]);

  // メッセージ送信 → 成功したら会話を丸ごと取り直す
  const sendMessage = async (content: string) => {
    if (otherUserId === null) return;
    const input: MessageCreate = { receiver_id: otherUserId, content };
    try {
      await api.post<Message>("/messages/", input);
      await fetchMessages();
    } catch (e) {
      throw e instanceof Error ? e : new Error("メッセージの送信に失敗しました");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}

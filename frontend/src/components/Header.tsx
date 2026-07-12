"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    //console.log("ログアウト処理を実行");
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900">
          バグマン（仮）
        </Link>

        {loading ? (
          <span className="text-sm text-gray-400">読み込み中...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user.name} さん
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:underline"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}

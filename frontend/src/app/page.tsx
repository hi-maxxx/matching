import Link from "next/link";
import UserList from "@/components/UserList";
import Topframe from "@/components/Topframe";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center pt-10">バクマン（仮）</h1>

      <Topframe />

      <div className="max-w-5xl mx-auto px-4">
        <UserList />

        <div className="flex justify-center mb-8 mt-10">
          <Link
            href="/matching"
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-full px-8 py-3 shadow-sm transition-colors"
          >
            ♡ マッチング相手を探す
          </Link>
        </div>
      </div>
    </main>
  );
}

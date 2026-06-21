import UserList from "@/components/UserList";
import Topframe from "@/components/Topframe";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center pt-10">バクマン（仮）</h1>

      <Topframe />

      <div className="max-w-5xl mx-auto px-4">
        <UserList />
        <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-10 text-center">検索一覧</h1>
      </div>
    </main>
  );
}

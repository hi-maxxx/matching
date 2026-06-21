import UserList from "@/components/UserList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">ユーザー管理</h1>
        <UserList />
      </div>
    </main>
  );
}

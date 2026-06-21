"use client";

import { useUsers } from "@/hooks/useUsers";
import UserCard from "./UserCard";
import UserForm from "./UserForm";

export default function UserList() {
  const { users, loading, error, createUser, deleteUser } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        <p className="text-sm text-red-600">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <UserForm onSubmit={async (input) => { await createUser(input); }} />

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        ユーザー一覧
        <span className="ml-2 text-sm font-normal text-gray-400">
          {users.length} 件
        </span>
      </h2>

      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          ユーザーがいません
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onDelete={deleteUser} />
          ))}
        </div>
      )}
    </div>
  );
}

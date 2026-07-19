import Link from "next/link";
import { User } from "@/types/user";

type Props = {
  user: User;
  onDeactivate: (id: number) => void; //PropsのonDelete → onDeactivate
};

export default function UserCard({ user, onDeactivate }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            user.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {user.is_active ? "有効" : "無効"}
        </span>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        作成日時: {new Date(user.created_at).toLocaleString("ja-JP")}
      </p>

      <div className="flex gap-2 mt-4">
        <Link
          href={`/users/${user.id}`}
          className="flex-1 text-center text-sm text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
        >
          詳細
        </Link>
        <button
          onClick={() => onDeactivate(user.id)}//ボタンのonClickをonDeactivate呼び出しに、文言を「削除」→「無効にする」に、色をred→orangeに変更
          className="flex-1 text-sm text-orange-600 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors"
        >
          無効化
        </button>
      </div>
    </div>
  );
}

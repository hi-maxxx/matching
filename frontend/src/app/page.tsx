import UserList from "@/components/UserList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center pt-10">バクマン（仮）</h1>

      {/* プロフィールカード（ワイヤーフレーム）：max-w上限なし、画面幅100% */}
      <div className="bg-amber-400 rounded-3xl p-6 w-full mb-10">
        {/* アイコン＋名前 */}
        <div className="flex items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-center text-sm font-medium text-gray-700 shrink-0">
            アイコン
            <br />
            画像
          </div>
          <div className="flex-1 bg-white rounded-2xl px-4 py-5 text-center">
            <p className="font-bold text-gray-900">名前（ペンネーム）</p>
            <p className="text-gray-700"></p>
          </div>
        </div>

        {/* 作品URL */}
        <div className="bg-white rounded-2xl px-6 py-6 mb-4 text-center text-gray-900">
          <p className="font-medium mb-2">作品URLを記載するところ</p>
          <p className="leading-tight"></p>
          <p className="leading-tight"></p>
          <p className="leading-tight"></p>
        </div>

        {/* 自己紹介文 */}
        <div className="bg-white rounded-2xl px-6 py-10 mb-4 text-center text-gray-900">
          <p className="font-medium">自己紹介文</p>
          <p className="font-bold"></p>
        </div>

        {/* 自分の性格 */}
        <div className="bg-white rounded-2xl px-6 py-10 text-center text-gray-900">
          <p className="font-medium">自分の性格</p>
          <p className="font-bold"></p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* <UserList /> */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-10 text-center">マッチング検索一覧</h1>
      </div>
    </main>
  );
}

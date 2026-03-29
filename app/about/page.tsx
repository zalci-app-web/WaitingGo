import Link from "next/link";

export const metadata = {
  title: "使い方・アプリについて | WaitingGo",
};

export default function AboutPage() {
  return (
    <main className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 text-slate-800 flex flex-col pt-12 pb-24 px-6 shadow-2xl">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 w-max">
          <span>&larr;</span> トップへ戻る
        </Link>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-8 border-b-2 border-slate-200 pb-4">
        WaitingGoについて
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <p className="font-bold text-slate-700 mb-3">「あの辺りにいるはずなんだけど、見つからない…」</p>
          <p>WaitingGoは、そんな「ラストワンマイルの待ち合わせ」を解決するための、超近距離特化型コンパスアプリです。</p>
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900 mb-5">■ 使い方（3ステップ）</h2>
          <div className="space-y-6">
            <section className="relative pl-6">
              <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-500 rounded-full" />
              <h3 className="text-base font-bold text-slate-900 mb-2">1. URLを発行する</h3>
              <p>あなたが待っている場所で「ここに来て！と送る」ボタンをタップし、URLを発行します。</p>
            </section>

            <section className="relative pl-6">
              <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-400 rounded-full" />
              <h3 className="text-base font-bold text-slate-900 mb-2">2. 相手に送る</h3>
              <p>発行されたURLを、LINEやX（Twitter）などのメッセージアプリで、合流したい相手に送信します。自分はそこから動かずに待っていてください。</p>
            </section>

            <section className="relative pl-6">
              <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-indigo-500 rounded-full" />
              <h3 className="text-base font-bold text-slate-900 mb-2">3. 矢印に向かって歩く</h3>
              <p>URLを受け取った相手がリンクを開くと、あなたのいる方向を指し示すコンパスが起動します。あとは矢印の方向に向かって歩くだけで合流完了です。</p>
            </section>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
          <p className="font-bold text-slate-500 text-xs">※アプリのインストールやログインは一切不要です。</p>
        </div>
      </div>
    </main>
  );
}

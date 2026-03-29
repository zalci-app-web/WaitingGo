import Link from "next/link";

export const metadata = {
  title: "利用規約 | WaitingGo",
};

export default function TermsPage() {
  return (
    <main className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 text-slate-800 flex flex-col pt-12 pb-24 px-6 shadow-2xl">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 w-max">
          <span>&larr;</span> トップへ戻る
        </Link>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-8 border-b-2 border-slate-200 pb-4">
        利用規約
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <div className="mb-6">
          <p>
            この利用規約（以下、「本規約」）は、「WaitingGo」（以下、「当サイト」）の利用条件を定めるもの
            です。ユーザーの皆さまには、本規約に従って当サイトをご利用いただきます。
          </p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">第1条（安全な利用）</h2>
          <p>
            ユーザーは、当サイトのナビゲーション機能を利用する際、周囲の安全を十分に確認し、歩きスマホなどの危険な行為を行わないものとします。必ず交通ルールに従い、立ち止まって画面を確認してください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">第2条（保証の否認および免責事項）</h2>
          <p className="whitespace-pre-wrap">
            ・当サイトは、端末のGPSおよび電子コンパスの仕様に依存するため、方向や距離の正確性、確実性を保証するものではありません。{"\n"}
            ・運営者は、当サイトの利用によってユーザーに生じたあらゆる損害（歩行中の事故、迷子、遅刻等を含む）について、一切の責任を負いません。{"\n"}
            ・当サイトは、事前の通知なく機能の変更、停止、または終了をすることがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">第3条（禁止事項）</h2>
          <p>
            当サイトの利用にあたり、法令に違反する行為、公序良俗に反する行為、または当サイトのサーバーに過度な負担をかける行為を禁止します。
          </p>
        </section>
      </div>
    </main>
  );
}

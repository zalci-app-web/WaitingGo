import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | WaitingGo",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 text-slate-800 flex flex-col pt-12 pb-24 px-6 shadow-2xl">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 w-max">
          <span>&larr;</span> トップへ戻る
        </Link>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-8 border-b-2 border-slate-200 pb-4">
        プライバシーポリシー
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">1. 位置情報の取り扱いについて</h2>
          <p>
            本サービス「WaitingGo」（以下、「当サイト」）は、待ち合わせのためのナビゲーション機能を提供するため、ユーザーの端末の位置情報（GPSおよびジャイロセンサー）を取得します。取得した位置情報は、招待URLの生成およびコンパスの方向計算のみにブラウザ上で使用され、当サイトのサーバーやデータベースに保存・蓄積されることは一切ありません。また、第三者に提供されることもありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">2. 広告の配信について</h2>
          <p>
            当サイトは、第三者配信の広告サービス（Google AdSense等）を利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。Cookieを無効にする設定およびGoogleアドセンスに関する詳細は「Googleポリシーと規約」をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">3. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、トラフィックデータの収集のためにアクセス解析ツールを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">4. 免責事項</h2>
          <p>
            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また、当サイトのナビゲーション機能は端末のハードウェア精度に依存するため、完全な正確性を保証するものではありません。当サイトの利用によって生じたトラブルや損害について、運営者は一切の責任を負いかねます。
          </p>
        </section>
      </div>
    </main>
  );
}

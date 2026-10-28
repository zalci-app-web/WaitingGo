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
          <div className="space-y-3">
            <p>
              本サービス「WaitingGo」（以下、「当サイト」）は、待ち合わせのためのナビゲーション機能を提供するため、ユーザーの端末の位置情報（GPS）とコンパス（方位センサー）を利用します。
            </p>
            <p>
              <strong className="text-slate-800">招待URLを発行する側</strong>
              では、端末で取得した位置（緯度・経度・精度）を招待URLに含めます。座標はURLの「#」以降（フラグメント）に入れるため、ブラウザは座標を当サイトのサーバーへ送信しません。当サイトのサーバーやデータベースに座標が保存されることはありません。
            </p>
            <p>
              <strong className="text-slate-800">招待URLを受け取る側</strong>
              の位置情報とコンパスの値は、端末の中だけで方向と距離の計算に使われ、外部へ送信されません。
            </p>
            <p>
              ご注意ください。招待URLには待っている場所の座標が含まれるため、URLを受け取った人はその場所を知ることができます。送信する相手と手段にご注意ください。また、メッセージアプリの履歴やプレビューにURLが残る場合があります。招待は発行から60分を過ぎるとアプリ上で無効になりますが、URLそのものに含まれる座標が見えなくなるわけではありません。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">2. 端末内への一時保存について</h2>
          <p>
            受け取った招待の内容は、ページを再読み込みしても使えるよう、ブラウザの一時領域（sessionStorage）に保存されます。タブを閉じると消え、期限が切れた場合も削除されます。また、回線が混み合う場所でも画面を開けるよう、画面を表示するためのファイルをブラウザにキャッシュします。キャッシュに座標は含まれません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">3. 外部サービスについて</h2>
          <p>
            招待を受け取った画面の「Googleマップで経路案内」を押すと、目的地の座標がGoogleに送信され、Googleマップが開きます。この操作はユーザーが押したときだけ行われます。当サイトでは、広告配信やアクセス解析ツールは現在使用していません。導入する場合は、事前に本ポリシーを改定してお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">4. アクセスログについて</h2>
          <p>
            サイトの運用上、ホスティング事業者によってIPアドレスや端末の種類などの通常のアクセスログが記録される場合があります。座標は上記のとおりURLのフラグメントに入っているため、このログには含まれません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">5. 免責事項</h2>
          <p>
            当サイトからのリンクで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また、当サイトのナビゲーション機能は端末のハードウェア精度に依存し、特に人混みや建物の近くでは数十メートルずれることがあるため、完全な正確性を保証するものではありません。当サイトの利用によって生じたトラブルや損害について、運営者は一切の責任を負いかねます。
          </p>
        </section>
      </div>
    </main>
  );
}

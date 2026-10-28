const isProd = process.env.NODE_ENV === "production";

// 外部へのデータ送信を封じるのが主目的。座標を扱うため、接続先・読み込み元は自ドメインのみに絞る。
// Next.js がハイドレーション用のインラインスクリプトを出力するため script-src に 'unsafe-inline' が必要
// （nonce 方式にすると全ページが動的描画になるため、現時点では採用していない）。
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  {
    key: "Permissions-Policy",
    value:
      "geolocation=(self), accelerometer=(self), gyroscope=(self), magnetometer=(self), screen-wake-lock=(self), camera=(), microphone=(), payment=(), usb=()",
  },
  // 開発サーバーは eval や WebSocket を使うため、CSP は本番ビルドにだけ適用する
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Service Worker は常に最新を取りに行かせる
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

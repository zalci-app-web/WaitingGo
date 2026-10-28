"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrientationPermission } from "@/hooks/useOrientationPermission";

interface PermissionGateProps {
  children: React.ReactNode;
}

export function PermissionGate({ children }: PermissionGateProps) {
  const { permissionGranted, requestPermission, error } = useOrientationPermission();
  const [loading, setLoading] = useState(false);

  const handleStartNavigation = async () => {
    setLoading(true);
    await requestPermission();
    setLoading(false);
  };

  if (permissionGranted) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-gradient-to-b from-blue-50/80 to-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* 背景装飾 */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full z-10 flex flex-col items-center bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
        {/* アイコン */}
        <span className="text-6xl" role="img" aria-label="location">📍</span>

        {/* タイトル */}
        <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center">
          ナビを開始しますか？
        </h1>

        {/* 安心マイクロコピー */}
        <div className="flex items-start gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-base mt-0.5">🔒</span>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            相手の方向を示すために、この画面を開いている間だけ位置情報とコンパスを使用します。<strong className="text-slate-700">あなたの位置情報は端末の外に送信されず、保存もされません。</strong>
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="w-full p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center" role="alert">
            <p className="text-amber-800 text-sm font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={handleStartNavigation}
          disabled={loading}
          className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/30 transition-transform duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          {loading ? "準備中..." : error ? "もう一度試す" : "ナビを開始する"}
        </button>

        {/* プライバシーポリシーリンク */}
        <Link href="/privacy" className="link-touchable text-xs">
          個人情報保護方針
        </Link>
      </div>
    </div>
  );
}

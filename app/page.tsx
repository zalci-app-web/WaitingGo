"use client";

import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Home() {
  const geo = useGeolocation();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (geo.lat !== null && geo.lon !== null && typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      setInviteUrl(`${baseUrl}/invite?lat=${geo.lat}&lon=${geo.lon}`);
    }
  }, [geo.lat, geo.lon]);

  const handleCopy = useCallback(() => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  const handleShare = useCallback(async () => {
    if (!inviteUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "WaitingGo",
          text: "ここ付近で待ってます！タップしてコンパスを起動してね。",
          url: inviteUrl,
        });
      } catch {
        // ユーザーがシェアシートを閉じた場合等
      }
    } else {
      handleCopy();
    }
  }, [inviteUrl, handleCopy]);

  return (
    <main className="max-w-md mx-auto min-h-[100dvh] bg-gradient-to-b from-blue-50/80 to-white shadow-2xl relative overflow-hidden flex flex-col">
      {/* 背景装飾 */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <header className="relative z-10 flex flex-col items-center pt-16 pb-6 px-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
          <span className="text-3xl" role="img" aria-label="compass">🧭</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">WaitingGo</h1>
        <p className="text-slate-500 mt-2 text-center text-sm font-medium leading-relaxed px-4">
          URLを送って合流しよう
        </p>
      </header>

      {/* メインコンテンツ */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6">
        {geo.loading ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-sm">現在地を特定中...</p>
          </div>
        ) : geo.error ? (
          <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center space-y-4 shadow-sm">
            <span className="text-4xl" role="img" aria-label="warning">⚠️</span>
            <div className="space-y-1.5">
              <p className="text-amber-900 text-lg font-black tracking-tight">位置情報が取得できません</p>
              <p className="text-amber-700/80 text-sm font-medium leading-relaxed">
                端末の許可設定を確認し、空が見える場所に<br/>移動してください。
              </p>
            </div>
          </div>
        ) : inviteUrl ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">発行された招待URL</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-mono break-all select-all leading-relaxed">{inviteUrl}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleCopy}
                className="link-touchable text-sm"
              >
                {copied ? "✓ コピーしました" : "URLをコピー"}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* メインアクションボタン（下部固定） */}
      <footer className="relative z-10 px-6 pb-12 pt-4">
        <button
          onClick={handleShare}
          disabled={!inviteUrl}
          className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-full shadow-xl shadow-blue-500/20 transition-all duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <span>ここに来て！と送る</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.59 13.51l3.41-3.41 3.41 3.41M12 21V10.09" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
          </svg>
        </button>
      </footer>
    </main>
  );
}

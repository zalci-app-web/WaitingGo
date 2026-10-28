import Link from "next/link";
import type { ReactNode } from "react";

/**
 * トップページの外枠（ヘッダー・フッター）。副作用を持たないので、
 * 環境判定前のサーバー描画にも使える（検索エンジンや回線が遅い環境でも本文が見える）。
 */
export function HomeShell({ children }: { children?: ReactNode }) {
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

      {children}

      {/* ページフッター（静的ページ・規約へのリンク） */}
      <footer className="relative z-10 px-6 pb-10 pt-4 border-t border-slate-100/50 mt-auto">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[11px] font-bold tracking-widest text-slate-400">
          <li><Link href="/about" className="hover:text-slate-600 transition-colors">使い方</Link></li>
          <li><Link href="/terms" className="hover:text-slate-600 transition-colors">利用規約</Link></li>
          <li><Link href="/privacy" className="hover:text-slate-600 transition-colors">プライバシー</Link></li>
        </ul>
      </footer>
    </main>
  );
}

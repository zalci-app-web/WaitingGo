"use client";

import { ReactNode, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useEnvironment } from "@/hooks/useEnvironment";

interface DeviceGuardProps {
  children: ReactNode;
}

export function DeviceGuard({ children }: DeviceGuardProps) {
  const { isInAppBrowser, isDesktop, isInitialized } = useEnvironment();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!isInitialized) return null;

  if (isInAppBrowser) {
    return (
      <div className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
          <span className="text-6xl drop-shadow-sm" role="img" aria-label="warning">⚠️</span>
          
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">ブラウザを<br/>切り替えてください</h1>
            <p className="text-slate-600 font-medium text-sm leading-relaxed px-2">
              このアプリ（LINEやXなど）の中では、コンパス機能が正しく動作しません。
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-4 space-y-4">
            <p className="font-bold text-slate-800 text-sm">【解決方法】</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              画面右上または右下のメニューボタン<br/>
              <span className="inline-block bg-white border border-slate-200 px-2 py-0.5 mt-1 rounded text-slate-800 font-bold mx-1">⋮</span> や 
              <span className="inline-block bg-white border border-slate-200 px-2 py-0.5 mt-1 rounded text-slate-800 font-bold mx-1">↑</span> 等をタップし、
            </p>
            <div className="bg-white px-3 py-2 rounded-xl border border-blue-100 inline-flex flex-col gap-1 items-center shadow-sm">
              <span className="font-bold text-blue-700 tracking-wider text-xs">「Safariで開く」</span>
              <span className="text-[10px] font-bold text-slate-400">または</span>
              <span className="font-bold text-blue-700 tracking-wider text-xs">「ブラウザで開く」</span>
            </div>
            <p className="text-sm text-slate-600 font-medium">を選択してください。</p>
          </div>
        </div>
      </div>
    );
  }

  if (isDesktop) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-8 text-center text-slate-800">
        <div className="max-w-md w-full bg-white p-10 flex flex-col items-center rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
          <span className="text-6xl mb-2 drop-shadow-sm" role="img" aria-label="mobile phone">📱</span>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            スマートフォン専用<br />アプリです
          </h1>
          
          <p className="text-slate-500 font-medium text-sm px-4">
            本アプリはスマートフォンのコンパスセンサーで動作します。スマホのカメラで下記のQRコードを読み取って起動してください。
          </p>
          
          <div className="bg-white p-4 shadow-sm border-2 border-slate-100 rounded-3xl mt-4">
            <QRCode value={currentUrl} size={180} fgColor="#0f172a" />
          </div>
          
          <p className="text-[10px] text-slate-400 font-medium break-all mt-4 px-4 select-all">
            {currentUrl}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useBestFix } from "@/hooks/useBestFix";
import { DeviceGuard } from "@/components/DeviceGuard";
import { HomeShell } from "@/components/HomeShell";
import { BeaconScreen } from "@/components/BeaconScreen";
import { BEACON_COLORS, INVITE_TTL_MS, buildInviteUrl } from "@/utils/invite";

const LOW_ACCURACY_M = 30;

type CopyStatus = "idle" | "copied" | "failed";

function HomeContent() {
  const geo = useGeolocation();
  const { fix, measuring, restart } = useBestFix(geo);
  const [color] = useState(() => Math.floor(Math.random() * BEACON_COLORS.length));
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [showBeacon, setShowBeacon] = useState(false);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const flashStatus = useCallback((status: CopyStatus) => {
    setCopyStatus(status);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2500);
  }, []);

  // 招待 URL は発行（コピー・共有）の瞬間に作る。有効期限をその時点から数えるため。
  const issueUrl = useCallback((): string | null => {
    if (!fix) return null;
    return buildInviteUrl(window.location.origin, fix, color);
  }, [fix, color]);

  const copyUrl = useCallback(
    async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        flashStatus("copied");
      } catch {
        flashStatus("failed");
      }
    },
    [flashStatus]
  );

  const handleCopy = useCallback(() => {
    const url = issueUrl();
    if (url) void copyUrl(url);
  }, [issueUrl, copyUrl]);

  const handleShare = useCallback(async () => {
    const url = issueUrl();
    if (!url) return;

    if (!navigator.share) {
      await copyUrl(url);
      return;
    }

    try {
      await navigator.share({
        title: "WaitingGo",
        text: `ここ付近で待ってます！タップしてコンパスを起動してね。（${BEACON_COLORS[color].name}の画面が目印・${INVITE_TTL_MS / 60000}分間有効）`,
        url,
      });
    } catch (err) {
      // 共有シートを閉じただけなら何もしない。それ以外の失敗はコピーで代替する。
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        await copyUrl(url);
      }
    }
  }, [issueUrl, copyUrl, color]);

  const beacon = BEACON_COLORS[color];
  const isLowAccuracy = fix !== null && fix.accuracy > LOW_ACCURACY_M;

  return (
    <>
      {/* メインコンテンツ */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 space-y-6">
        {geo.loading ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-sm">現在地を特定中...</p>
          </div>
        ) : geo.error && !fix ? (
          <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center space-y-4 shadow-sm" role="alert">
            <span className="text-4xl" role="img" aria-label="warning">⚠️</span>
            <div className="space-y-1.5">
              <p className="text-amber-900 text-lg font-black tracking-tight">位置情報が取得できません</p>
              <p className="text-amber-700/80 text-sm font-medium leading-relaxed">
                端末の許可設定を確認し、空が見える場所に<br />移動してください。
              </p>
            </div>
          </div>
        ) : fix ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-3">
              {measuring ? (
                <div className="w-5 h-5 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <span className="text-lg" role="img" aria-label="done">✅</span>
              )}
              <p className="text-slate-800 font-black text-base">
                {measuring ? "位置の精度を高めています..." : "待ち合わせ場所を確定しました"}
              </p>
            </div>

            <p className="text-sm text-slate-500 font-medium">
              精度 約{Math.round(fix.accuracy)}m
            </p>

            {isLowAccuracy && !measuring && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3" role="alert">
                <p className="text-amber-800 text-sm font-bold leading-relaxed">
                  精度が低めです。空が開けた場所に移動してから測り直すと、相手を正しく案内できます。
                </p>
                <button onClick={restart} className="link-touchable text-sm">
                  測り直す
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span
                className="inline-block w-6 h-6 rounded-full border border-slate-200 shrink-0"
                style={{ backgroundColor: beacon.bg }}
                aria-hidden="true"
              />
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                あなたの目印色は<strong className="text-slate-800">「{beacon.name}」</strong>。相手の画面にも表示されます。
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button onClick={() => setShowBeacon(true)} className="link-touchable text-sm">
                目印モードを開く
              </button>
              {!isLowAccuracy && !measuring && (
                <button onClick={restart} className="link-touchable text-sm">
                  測り直す
                </button>
              )}
              <button onClick={handleCopy} className="link-touchable text-sm">
                {copyStatus === "copied"
                  ? "✓ コピーしました"
                  : copyStatus === "failed"
                    ? "コピーできませんでした"
                    : "URLをコピー"}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-medium leading-relaxed text-center">
              招待URLは{INVITE_TTL_MS / 60000}分で期限切れになります。URLには待っている場所が含まれるため、送る相手に気を付けてください。
            </p>
          </div>
        ) : null}
      </section>

      {/* メインアクションボタン（下部固定） */}
      <div className="relative z-10 px-6 pb-4 pt-4 mt-auto">
        <button
          onClick={handleShare}
          disabled={!fix || measuring}
          className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-full shadow-xl shadow-blue-500/20 transition-all duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <span>{measuring ? "測位中..." : "ここに来て！と送る"}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.59 13.51l3.41-3.41 3.41 3.41M12 21V10.09" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
          </svg>
        </button>
      </div>

      {showBeacon && <BeaconScreen color={color} onClose={() => setShowBeacon(false)} />}
    </>
  );
}

export default function Home() {
  return (
    <DeviceGuard placeholder={<HomeShell />}>
      <HomeShell>
        <HomeContent />
      </HomeShell>
    </DeviceGuard>
  );
}

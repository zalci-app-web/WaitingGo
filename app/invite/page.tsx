"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/PermissionGate";
import { Compass } from "@/components/Compass";
import { DistanceDisplay } from "@/components/DistanceDisplay";
import { DeviceGuard } from "@/components/DeviceGuard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCompassHeading } from "@/hooks/useCompassHeading";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useInvite } from "@/hooks/useInvite";
import { calculateDistance, calculateBearing } from "@/utils/geoMath";
import { combineUncertainty, nearbyRadius } from "@/utils/distance";
import { getMagneticDeclination } from "@/utils/magneticDeclination";
import { BEACON_COLORS, INVITE_TTL_MS, type InviteData } from "@/utils/invite";
import { motion, AnimatePresence } from "framer-motion";

// GPS精度低下の検知（accuracy > 30m をしきい値とする）
const LOW_ACCURACY_M = 30;
// 招待者の精度が不明な古い形式のリンクで仮定する値
const DEFAULT_ACCURACY_M = 15;

function InviteContent({ invite }: { invite: InviteData }) {
  const geo = useGeolocation();
  useWakeLock();

  const declination = useMemo(
    () => (geo.lat !== null && geo.lon !== null ? getMagneticDeclination(geo.lat, geo.lon) : 0),
    [geo.lat, geo.lon]
  );
  const heading = useCompassHeading(declination);

  const { distance, bearing } = useMemo(() => {
    if (geo.lat === null || geo.lon === null) return { distance: null, bearing: 0 };
    return {
      distance: calculateDistance(geo.lat, geo.lon, invite.lat, invite.lon),
      bearing: calculateBearing(geo.lat, geo.lon, invite.lat, invite.lon),
    };
  }, [geo.lat, geo.lon, invite.lat, invite.lon]);

  const isAccuracyLow = geo.accuracy !== null && geo.accuracy > LOW_ACCURACY_M;
  const uncertainty = combineUncertainty(invite.accuracy ?? DEFAULT_ACCURACY_M, geo.accuracy ?? DEFAULT_ACCURACY_M);
  const isNearby = distance !== null && distance <= nearbyRadius(uncertainty);
  const beacon = BEACON_COLORS[invite.color];

  // --- ローディング ---
  if (geo.loading) {
    return (
      <div className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-sm">位置情報を初期化中...</p>
        </div>
      </div>
    );
  }

  // --- GPSエラー ---
  if (geo.error) {
    return (
      <div className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6">
        <div className="w-full bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] text-center space-y-4 shadow-sm" role="alert">
          <span className="text-5xl drop-shadow-sm mb-2" role="img" aria-label="warning">⚠️</span>
          <p className="text-amber-900 font-black text-xl tracking-tight">位置情報エラー</p>
          <p className="text-amber-700/90 font-medium text-sm leading-relaxed px-2">
            位置情報が取得できません。<br />空が見える場所に移動するか、端末の許可設定を確認してください。
          </p>
        </div>
      </div>
    );
  }

  // --- メインナビゲーション ---
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-gradient-to-b from-blue-50/60 to-white shadow-2xl relative overflow-hidden flex flex-col">
      {/* キャリブレーショントースト */}
      <AnimatePresence>
        {isAccuracyLow && (
          <motion.div
            key="accuracy-toast"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute top-4 left-4 right-4 z-50 bg-slate-800 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
            role="status"
          >
            <span className="text-lg">🔄</span>
            <div className="flex-1">
              <p className="text-sm font-bold">精度が低下しています</p>
              <p className="text-xs text-slate-300 mt-0.5">スマホを8の字に回して調整してください</p>
            </div>
          </motion.div>
        )}

        {/* 近づいたとき：レーダー波紋演出 */}
        {isNearby && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1.5] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] z-0 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.2)_0%,_transparent_60%)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 上部: 距離表示 */}
      <section className="relative z-10 flex-shrink-0 flex flex-col items-center justify-center pt-16 pb-4 space-y-3">
        <DistanceDisplay distance={distance} uncertainty={uncertainty} />
        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <span
            className="inline-block w-4 h-4 rounded-full border border-slate-200"
            style={{ backgroundColor: beacon.bg }}
            aria-hidden="true"
          />
          <p className="text-xs font-bold text-slate-600">相手の画面は「{beacon.name}」</p>
        </div>
      </section>

      {/* 中央: コンパス */}
      <section className="relative z-10 flex-1 flex items-center justify-center">
        <Compass bearing={bearing} heading={heading} />
      </section>

      {/* 下部: GPSステータスバッジ & Google Maps連携 */}
      <section className="relative z-10 flex-shrink-0 flex flex-col items-center justify-center pb-12 pt-4 space-y-4">
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isAccuracyLow || heading === null ? "bg-amber-400" : "bg-emerald-400"} shadow-sm animate-pulse`} />
          <p className="text-[11px] font-black tracking-widest text-slate-500">
            {heading === null
              ? "コンパスを初期化中..."
              : isAccuracyLow
                ? `精度を調整中（約${Math.round(geo.accuracy ?? 0)}m）`
                : `方向を更新中（精度 約${Math.round(geo.accuracy ?? 0)}m）`}
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${invite.lat},${invite.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest text-slate-400 bg-transparent border border-slate-200 rounded-full px-5 py-2 hover:bg-slate-50 transition-colors shadow-sm"
        >
          🗺 Googleマップで経路案内
        </a>
      </section>

      {/* 検証用（招待URLのフラグメントに d=1 を付けたときだけ表示） */}
      {invite.debug && (
        <pre className="relative z-10 mx-4 mb-4 p-3 rounded-xl bg-slate-900 text-emerald-300 text-[10px] leading-relaxed overflow-x-auto">
          {[
            `self accuracy : ${geo.accuracy?.toFixed(1) ?? "-"} m`,
            `sender accuracy: ${invite.accuracy ?? "-"} m`,
            `uncertainty   : ${uncertainty.toFixed(1)} m`,
            `distance      : ${distance?.toFixed(1) ?? "-"} m`,
            `bearing       : ${bearing.toFixed(1)} deg`,
            `heading(true) : ${heading?.toFixed(1) ?? "-"} deg`,
            `declination   : ${declination.toFixed(1)} deg`,
          ].join("\n")}
        </pre>
      )}
    </div>
  );
}

function InviteMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="w-full bg-white border border-slate-100 p-8 rounded-[2rem] text-center space-y-4 shadow-sm">
        <span className="text-5xl" role="img" aria-label="clock">⏰</span>
        <h1 className="text-slate-900 font-black text-xl tracking-tight">{title}</h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">{body}</p>
        <Link href="/" className="link-touchable text-sm inline-block">
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}

function InviteGate() {
  const invite = useInvite();
  const router = useRouter();

  useEffect(() => {
    if (invite.status === "invalid") router.replace("/");
  }, [invite.status, router]);

  if (invite.status === "loading" || invite.status === "invalid") return null;

  if (invite.status === "expired") {
    return (
      <InviteMessage
        title="招待の期限が切れました"
        body={`招待URLは発行から${INVITE_TTL_MS / 60000}分で無効になります。相手にもう一度URLを送ってもらってください。`}
      />
    );
  }

  return (
    <PermissionGate>
      <InviteContent invite={invite.data} />
    </PermissionGate>
  );
}

export default function InvitePage() {
  return (
    <DeviceGuard>
      <InviteGate />
    </DeviceGuard>
  );
}

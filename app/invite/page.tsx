"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGate } from "@/components/PermissionGate";
import { Compass } from "@/components/Compass";
import { DistanceDisplay } from "@/components/DistanceDisplay";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { useWakeLock } from "@/hooks/useWakeLock";
import { calculateDistance, calculateBearing } from "@/utils/geoMath";
import { geoCoordinatesSchema } from "@/utils/validation";
import { motion, AnimatePresence } from "framer-motion";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const geo = useGeolocation();
  const orientation = useDeviceOrientation();
  useWakeLock();

  const [targetLat, setTargetLat] = useState<number | null>(null);
  const [targetLon, setTargetLon] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number>(0);

  // GPS精度低下の検知（accuracy > 30m をしきい値とする）
  const isAccuracyLow = geo.accuracy !== null && geo.accuracy > 30;

  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    const parsed = geoCoordinatesSchema.safeParse({ lat: latParam, lon: lonParam });
    if (!parsed.success) {
      router.push("/");
      return;
    }
    setTargetLat(parsed.data.lat);
    setTargetLon(parsed.data.lon);
  }, [searchParams, router]);

  useEffect(() => {
    if (geo.lat === null || geo.lon === null || targetLat === null || targetLon === null) return;

    const d = calculateDistance(geo.lat, geo.lon, targetLat, targetLon);
    const b = calculateBearing(geo.lat, geo.lon, targetLat, targetLon);

    setDistance(d);
    setBearing(b);
  }, [geo.lat, geo.lon, targetLat, targetLon]);

  // --- ローディング ---
  if (geo.loading || targetLat === null) {
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
        <div className="w-full bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] text-center space-y-4 shadow-sm">
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
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute top-4 left-4 right-4 z-50 bg-slate-800 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <span className="text-lg">🔄</span>
            <div className="flex-1">
              <p className="text-sm font-bold">精度が低下しています</p>
              <p className="text-xs text-slate-300 mt-0.5">スマホを8の字に回して調整してください</p>
            </div>
          </motion.div>
        )}

        {/* 5m未満：レーダー波紋演出 */}
        {distance !== null && distance < 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1.5] }}
            exit={{ opacity: 0 }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.max(0.3, distance / 5), 
              ease: "easeOut" 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] z-0 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.2)_0%,_transparent_60%)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 上部: 距離表示 */}
      <section className="relative z-10 flex-shrink-0 flex items-center justify-center pt-16 pb-4">
        <DistanceDisplay distance={distance} />
      </section>

      {/* 中央: コンパス */}
      <section className="relative z-10 flex-1 flex items-center justify-center">
        <Compass bearing={bearing} alpha={orientation.alpha} />
      </section>

      {/* 下部: GPSステータスバッジ & Google Maps連携 */}
      <section className="relative z-10 flex-shrink-0 flex flex-col items-center justify-center pb-12 pt-4 space-y-4">
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isAccuracyLow ? "bg-amber-400" : "bg-emerald-400"} shadow-sm animate-pulse`} />
          <p className="text-[11px] font-black tracking-widest text-slate-500 uppercase">
            {isAccuracyLow ? "精度を調整中..." : "精度: 高・方向を更新中"}
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest text-slate-400 bg-transparent border border-slate-200 rounded-full px-5 py-2 hover:bg-slate-50 transition-colors shadow-sm"
        >
          🗺 Googleマップで経路案内
        </a>
      </section>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto min-h-[100dvh] bg-slate-50 shadow-2xl" />}>
      <PermissionGate onPermissionGranted={() => {}}>
        <InviteContent />
      </PermissionGate>
    </Suspense>
  );
}

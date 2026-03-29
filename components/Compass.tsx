"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CompassProps {
  bearing: number;
  alpha: number | null;
}

export function Compass({ bearing, alpha }: CompassProps) {
  const [rotation, setRotation] = useState<number>(0);
  const prevRotationRef = useRef<number>(0);

  useEffect(() => {
    if (alpha === null) return;
    const targetBase = bearing - alpha;

    let diff = targetBase - (prevRotationRef.current % 360);
    // 最短距離になるよう -180 ~ +180 の範囲に正規化
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const newRotation = prevRotationRef.current + diff;
    prevRotationRef.current = newRotation;
    setRotation(newRotation);
  }, [bearing, alpha]);

  return (
    <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
      {/* 外枠の円（盤面） */}
      <div className="absolute inset-0 rounded-full bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-slate-100" />

      {/* 内側カーディナル方向のティックマーク（N,E,S,W） */}
      <div className="absolute inset-4 rounded-full border border-slate-100/80" />

      {/* 北マーカー */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-300 tracking-widest z-0">N</div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-300 tracking-widest z-0">S</div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-300 tracking-widest z-0">W</div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-300 tracking-widest z-0">E</div>

      {/* SVG矢印（Framer Motion で回転） */}
      <motion.div
        className="relative z-10 flex justify-center items-center"
        style={{ filter: "drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3))" }}
        animate={{ rotate: rotation }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 18,
          mass: 1.2,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-44 h-44 sm:w-52 sm:h-52"
        >
          <defs>
            <linearGradient id="arrowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="arrowShadow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#3730a3" />
            </linearGradient>
          </defs>
          {/* 矢印の影 (奥行きの付与) */}
          <path
            d="M50 8 L22 82 A4 4 0 0 0 26 88 L50 72 L74 88 A4 4 0 0 0 78 82 Z"
            fill="url(#arrowShadow)"
            opacity="0.15"
            transform="translate(2, 3)"
          />
          {/* メインの矢印 */}
          <path
            d="M50 8 L22 82 A4 4 0 0 0 26 88 L50 72 L74 88 A4 4 0 0 0 78 82 Z"
            fill="url(#arrowGrad)"
            stroke="#1e3a8a"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* 矢印先端のハイライト */}
          <path
            d="M50 12 L38 55 L50 48 L62 55 Z"
            fill="white"
            opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* 中心のピン */}
      <div className="absolute w-6 h-6 rounded-full bg-white border-[3px] border-indigo-500 shadow-sm z-20" />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { nearbyRadius, roundDistance } from "@/utils/distance";

interface DistanceDisplayProps {
  distance: number | null;
  /** 相対位置の不確かさ(m)。表示の丸めと「このあたり」の判定に使う */
  uncertainty: number;
}

export function DistanceDisplay({ distance, uncertainty }: DistanceDisplayProps) {
  const radius = nearbyRadius(uncertainty);
  const isNearby = distance !== null && distance <= radius;
  const rounded = distance === null ? 0 : roundDistance(distance, uncertainty);

  const springDist = useSpring(rounded, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    springDist.set(rounded);
  }, [rounded, springDist]);

  const numValue = useTransform(springDist, (latest) =>
    latest >= 1000 ? (latest / 1000).toFixed(1) : Math.round(latest).toString()
  );
  const unitValue = useTransform(springDist, (latest): string => (latest >= 1000 ? "km" : "m"));

  if (distance === null) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">目的地まで</p>
        <div className="h-16 w-40 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (isNearby) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">目的地まで</p>
        <p className="text-5xl font-black text-slate-900 tracking-tight leading-none">このあたり</p>
        <p className="text-sm font-bold text-slate-400 mt-3">
          半径約{Math.round(radius)}m以内。まわりを見渡して探してください
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
        目的地まで
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-400">約</span>
        <motion.span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
          {numValue}
        </motion.span>
        <motion.span className="text-2xl font-bold text-slate-400">
          {unitValue}
        </motion.span>
      </div>
    </div>
  );
}

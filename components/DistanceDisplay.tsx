"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface DistanceDisplayProps {
  distance: number | null;
}

export function DistanceDisplay({ distance }: DistanceDisplayProps) {
  const springDist = useSpring(distance ?? 0, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    if (distance !== null) {
      springDist.set(distance);
    }
  }, [distance, springDist]);

  const numValue = useTransform(springDist, (latest) => {
    if (latest >= 1000) return (latest / 1000).toFixed(1);
    if (latest >= 10) return latest.toFixed(1);
    return Math.round(latest * 100).toString();
  });

  const unitValue = useTransform(springDist, (latest): string => {
    if (latest >= 1000) return "km";
    if (latest >= 10) return "m";
    return "cm";
  });

  if (distance === null) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">目的地まで</p>
        <div className="h-16 w-40 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
        目的地まで
      </p>
      <div className="flex items-baseline gap-1">
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

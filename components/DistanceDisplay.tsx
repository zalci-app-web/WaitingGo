"use client";

interface DistanceDisplayProps {
  distance: number | null;
}

export function DistanceDisplay({ distance }: DistanceDisplayProps) {
  if (distance === null) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">目的地まで</p>
        <div className="h-16 w-40 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  const isKm = distance >= 1000;
  const numValue = isKm ? (distance / 1000).toFixed(1) : Math.round(distance).toString();
  const unit = isKm ? "km" : "m";

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
        目的地まで
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
          {numValue}
        </span>
        <span className="text-2xl font-bold text-slate-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

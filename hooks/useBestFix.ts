"use client";

import { useCallback, useEffect, useState } from "react";

interface GeoSample {
  lat: number | null;
  lon: number | null;
  accuracy: number | null;
}

export interface Fix {
  lat: number;
  lon: number;
  accuracy: number;
}

const MEASURE_WINDOW_MS = 8000; // 最初の測位から、この間に得た中で最も精度の良い値を採用する
const GOOD_ENOUGH_M = 8; // これより良い精度が出たら、すぐ確定する

/**
 * 招待を発行する側のために、数秒間の測位から最も精度の良い値を選ぶ。
 * 最初の 1 回は精度が悪いことが多く、そのまま使うと相手を誤った地点へ案内してしまうため。
 */
export function useBestFix(sample: GeoSample) {
  const [fix, setFix] = useState<Fix | null>(null);
  const [measuring, setMeasuring] = useState(true);
  const hasFix = fix !== null;

  const { lat, lon, accuracy } = sample;

  useEffect(() => {
    if (!measuring || lat === null || lon === null || accuracy === null) return;

    setFix((prev) => (prev === null || accuracy < prev.accuracy ? { lat, lon, accuracy } : prev));
    if (accuracy <= GOOD_ENOUGH_M) setMeasuring(false);
  }, [measuring, lat, lon, accuracy]);

  useEffect(() => {
    if (!measuring || !hasFix) return;
    const timer = setTimeout(() => setMeasuring(false), MEASURE_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [measuring, hasFix]);

  const restart = useCallback(() => {
    setFix(null);
    setMeasuring(true);
  }, []);

  return { fix, measuring, restart };
}

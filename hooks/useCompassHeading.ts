"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigationStore } from "@/store/useNavigationStore";
import { normalize360, shortestDelta } from "@/utils/angle";
import { magneticHeadingFromEvent } from "@/utils/heading";

// 小さいほど滑らか（その分、追従は遅い）
const SMOOTHING = 0.25;
// これ未満の変化では再描画しない
const MIN_UPDATE_DEG = 0.5;

/**
 * 端末が向いている方位（真北基準・度）を返す。センサーの値が来るまでは null。
 *
 * 端末のコンパスは磁北基準なので、磁気偏角を足して真北基準にそろえる。
 * 値は円周上のローパスフィルタでならし、矢印のふらつきを抑える。
 * 権限の許可は PermissionGate が共有ストアに書くため、このフックは許可後にだけリスナーを付ける。
 */
export function useCompassHeading(declinationDeg: number): number | null {
  const granted = useNavigationStore((s) => s.orientationGranted);
  const [heading, setHeading] = useState<number | null>(null);
  const declinationRef = useRef(declinationDeg);
  const smoothedRef = useRef<number | null>(null);

  useEffect(() => {
    declinationRef.current = declinationDeg;
  }, [declinationDeg]);

  useEffect(() => {
    if (!granted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const magnetic = magneticHeadingFromEvent(event);
      if (magnetic === null) return;

      const trueHeading = normalize360(magnetic + declinationRef.current);
      const prev = smoothedRef.current;
      const next =
        prev === null ? trueHeading : normalize360(prev + SMOOTHING * shortestDelta(trueHeading - prev));

      if (prev !== null && Math.abs(shortestDelta(next - prev)) < MIN_UPDATE_DEG) return;
      smoothedRef.current = next;
      setHeading(next);
    };

    // Chrome(Android) は絶対方位専用のイベントがある。それ以外は deviceorientation を使う。
    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handleOrientation as EventListener);
    return () => window.removeEventListener(eventName, handleOrientation as EventListener);
  }, [granted]);

  return heading;
}

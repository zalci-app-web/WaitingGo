"use client";

import { useState, useCallback } from "react";
import { useNavigationStore } from "@/store/useNavigationStore";

const PROBE_TIMEOUT_MS = 2000;

type PermissionErrorKind = "denied" | "unsupported" | "failed";

const ERROR_MESSAGES: Record<PermissionErrorKind, string> = {
  denied:
    "コンパスへのアクセスが拒否されました。ブラウザを一度閉じて開き直し、許可してください。",
  unsupported: "コンパスのデータを取得できませんでした。もう一度お試しください。",
  failed: "センサーの初期化に失敗しました。",
};

/** 実際にセンサー値が届くかを短時間だけ待って確かめる（PC など非対応環境の判定） */
function probeSensor(): Promise<boolean> {
  return new Promise((resolve) => {
    let hasValue = false;

    const handler = (event: DeviceOrientationEvent) => {
      const ios = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
      if (typeof ios === "number" || event.alpha !== null) hasValue = true;
    };

    window.addEventListener("deviceorientationabsolute", handler as EventListener);
    window.addEventListener("deviceorientation", handler as EventListener);

    setTimeout(() => {
      window.removeEventListener("deviceorientationabsolute", handler as EventListener);
      window.removeEventListener("deviceorientation", handler as EventListener);
      resolve(hasValue);
    }, PROBE_TIMEOUT_MS);
  });
}

/**
 * コンパス（方位センサー）の利用許可を取る。
 * iOS 13+ はユーザー操作の中で requestPermission を呼ぶ必要がある。
 * 許可の結果は共有ストアに置き、ナビ画面側のフックからも参照できるようにする。
 */
export function useOrientationPermission() {
  const granted = useNavigationStore((s) => s.orientationGranted);
  const setGranted = useNavigationStore((s) => s.setOrientationGranted);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      const requestable = (
        typeof DeviceOrientationEvent !== "undefined"
          ? (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          : undefined
      )?.requestPermission;

      if (typeof requestable === "function") {
        const state = await requestable.call(DeviceOrientationEvent);
        if (state !== "granted") {
          setError(ERROR_MESSAGES.denied);
          return false;
        }
      }

      if (!(await probeSensor())) {
        setError(ERROR_MESSAGES.unsupported);
        return false;
      }

      setGranted(true);
      return true;
    } catch {
      setError(ERROR_MESSAGES.failed);
      return false;
    }
  }, [setGranted]);

  return { permissionGranted: granted, requestPermission, error };
}

import { useState, useEffect, useCallback } from "react";

interface OrientationState {
  alpha: number | null; // コンパスの向き（北を0度とする角度）
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  error: string | null;
}

export function useDeviceOrientation(): OrientationState {
  const [alpha, setAlpha] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      let isiOS = false;
      // iOS Safari の特有の権限リクエスト
      if (
        typeof (DeviceOrientationEvent as any) !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        isiOS = true;
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState !== "granted") {
          setError("コンパスへのアクセスが拒否されました");
          return false;
        }
      }

      // 権限が通った後、実際にセンサー値が取得できるかテストしPC環境のフォールバックを行う
      return new Promise<boolean>((resolve) => {
        let hasValue = false;
        
        const testHandler = (event: DeviceOrientationEvent) => {
          if (
            ("webkitCompassHeading" in event && (event as any).webkitCompassHeading !== null) ||
            event.alpha !== null
          ) {
            hasValue = true;
          }
        };

        window.addEventListener("deviceorientationabsolute", testHandler as EventListener);
        window.addEventListener("deviceorientation", testHandler as EventListener);

        // 1秒間センサー値が来なければ非対応とみなす
        setTimeout(() => {
          window.removeEventListener("deviceorientationabsolute", testHandler as EventListener);
          window.removeEventListener("deviceorientation", testHandler as EventListener);
          
          if (hasValue) {
            setPermissionGranted(true);
            setError(null);
            resolve(true);
          } else {
            setError("デバイスがコンパスに対応していません");
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError("センサーの初期化に失敗しました");
      return false;
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // iOS Safari用の絶対方位 (北が0度)
      if ("webkitCompassHeading" in event && (event as any).webkitCompassHeading !== null) {
        setAlpha((event as any).webkitCompassHeading);
      } 
      // Android Chrome等用の絶対方位 (北が0度になるように 360 - alpha で計算)
      else if (event.alpha !== null) {
        setAlpha(360 - event.alpha);
      }
    };

    // クロスブラウザ対応：deviceorientationabsolute を最優先
    if (typeof window !== "undefined") {
      if ("ondeviceorientationabsolute" in window) {
        (window as any).addEventListener("deviceorientationabsolute", handleOrientation);
      } else {
        (window as any).addEventListener("deviceorientation", handleOrientation);
      }
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener);
      window.removeEventListener("deviceorientation", handleOrientation as EventListener);
    };
  }, [permissionGranted]);

  return { alpha, permissionGranted, requestPermission, error };
}

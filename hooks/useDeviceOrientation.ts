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

  // iOS Safari用の権限リクエスト関数
  const requestPermission = useCallback(async () => {
    try {
      if (
        typeof (DeviceOrientationEvent as any) !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === "granted") {
          setPermissionGranted(true);
          return true;
        } else {
          setError("コンパスへのアクセスが拒否されました");
          return false;
        }
      } else {
        // iOS 13未満、もしくはAndroid等（デフォルトで権限あり）
        setPermissionGranted(true);
        return true;
      }
    } catch (err) {
      setError(String(err));
      return false;
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading は iOS Safari のみ存在し、より正確な北を示す
      if ("webkitCompassHeading" in event) {
        setAlpha((event as any).webkitCompassHeading);
      } else if (event.alpha !== null) {
        // Android等
        setAlpha(360 - event.alpha); 
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener);
    window.addEventListener("deviceorientation", handleOrientation as EventListener);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener);
      window.removeEventListener("deviceorientation", handleOrientation as EventListener);
    };
  }, [permissionGranted]);

  return { alpha, permissionGranted, requestPermission, error };
}

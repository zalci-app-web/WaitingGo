import { normalize360 } from "@/utils/angle";

/**
 * DeviceOrientation の Euler 角（絶対方位基準）から、磁北基準の方位（度）を求める。
 *
 * - ほぼ水平に持っているとき（|beta| <= 45°）: 端末の上端が向く方位（360 - alpha）
 * - 立てて持っているとき: 端末の背面が向く方位（W3C 仕様の補正式）。
 *   立てた状態で alpha をそのまま使うと、傾きの分だけ方位がずれるため。
 */
export function headingFromEuler(alpha: number, beta: number, gamma: number): number {
  if (Math.abs(beta) <= 45) {
    return normalize360(360 - alpha);
  }

  const rad = Math.PI / 180;
  const x = beta * rad;
  const y = gamma * rad;
  const z = alpha * rad;

  const vx = -Math.cos(z) * Math.sin(y) - Math.sin(z) * Math.sin(x) * Math.cos(y);
  const vy = -Math.sin(z) * Math.sin(y) + Math.cos(z) * Math.sin(x) * Math.cos(y);

  return normalize360((Math.atan2(vx, vy) * 180) / Math.PI);
}

/**
 * イベントから磁北基準の方位（度）を取り出す。取れなければ null。
 * iOS Safari は傾き補正済みの webkitCompassHeading を優先する。
 */
export function magneticHeadingFromEvent(event: DeviceOrientationEvent): number | null {
  const ios = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (typeof ios === "number" && Number.isFinite(ios)) {
    return normalize360(ios);
  }
  if (event.alpha === null) return null;
  return headingFromEuler(event.alpha, event.beta ?? 0, event.gamma ?? 0);
}

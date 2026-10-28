/** 角度を 0 以上 360 未満に正規化する */
export function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * 角度差を最短経路になる -180 以上 180 未満の範囲に正規化する。
 * 入力がどれだけ大きくても（負でも）1 回の計算で収まる。
 */
export function shortestDelta(deltaDeg: number): number {
  return (((deltaDeg % 360) + 540) % 360) - 180;
}

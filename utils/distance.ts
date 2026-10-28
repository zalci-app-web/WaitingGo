/** 2 つの測位誤差(m)から、相対位置の不確かさ(m)を見積もる */
export function combineUncertainty(a: number, b: number): number {
  return Math.min(200, Math.max(5, Math.hypot(a, b)));
}

/**
 * 不確かさに見合う粒度に距離を丸める。
 * GPS の誤差が数十mあるのに cm 単位で出すと、実態より正確に見えてしまう。
 */
export function roundDistance(distance: number, uncertainty: number): number {
  if (distance >= 1000) return Math.round(distance / 100) * 100;
  const step = distance >= 100 || uncertainty >= 40 ? 10 : 5;
  return Math.max(step, Math.round(distance / step) * step);
}

/** この距離以内なら「このあたり」として方向案内より目視を促す */
export function nearbyRadius(uncertainty: number): number {
  return Math.max(8, uncertainty);
}

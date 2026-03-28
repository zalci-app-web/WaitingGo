/**
 * 2つの座標（緯度・経度）間の直線距離（メートル）を計算する (Haversine公式)
 * 
 * @param lat1 出発地の緯度
 * @param lon1 出発地の経度
 * @param lat2 目的地の緯度
 * @param lon2 目的地の経度
 * @returns 距離 (メートル)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // 地球の半径 (メートル)
  const toRad = (value: number) => (value * Math.PI) / 180;
  
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 出発地から目的地への方位角（度）を計算する
 * 北を0度とし、時計回りに0〜360度で返す標準的な方位角計算
 * 
 * @param lat1 出発地の緯度
 * @param lon1 出発地の経度
 * @param lat2 目的地の緯度
 * @param lon2 目的地の経度
 * @returns 方位角 (度, 0〜360)
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const toDeg = (value: number) => (value * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  // Math.atan2(y, x) で方位角を計算。
  let bearing = toDeg(Math.atan2(y, x));
  
  // 0~360の範囲に正規化
  bearing = (bearing + 360) % 360;
  return bearing;
}

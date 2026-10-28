"use client";

import { useWakeLock } from "@/hooks/useWakeLock";
import { BEACON_COLORS } from "@/utils/invite";

interface BeaconScreenProps {
  color: number;
  onClose: () => void;
}

/**
 * 目印モード: 画面全体を目印色で光らせる。
 * GPS の誤差で最後の数 m が絞れないとき、相手が「この色の画面」を目視で探せるようにする。
 */
export function BeaconScreen({ color, onClose }: BeaconScreenProps) {
  useWakeLock();
  const { name, bg, fg } = BEACON_COLORS[color] ?? BEACON_COLORS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: bg, color: fg }}
      role="dialog"
      aria-label={`目印モード: ${name}`}
    >
      <p className="text-sm font-bold tracking-widest opacity-80">この画面を相手に見せてください</p>
      <p className="text-6xl font-black tracking-tight mt-4">{name}</p>
      <p className="text-sm font-medium mt-6 opacity-80 leading-relaxed">
        相手のアプリにも「{name}」と表示されています。
        <br />
        画面の明るさを上げて、頭の上にかざすと見つけやすくなります。
      </p>
      <button
        onClick={onClose}
        className="mt-12 px-8 py-4 rounded-full border-2 font-bold text-base active:scale-95 transition-transform"
        style={{ borderColor: fg, color: fg }}
      >
        目印モードを終了
      </button>
    </div>
  );
}

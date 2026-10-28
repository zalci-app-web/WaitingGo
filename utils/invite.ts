import { z } from "zod";

/**
 * 招待 URL の形式:
 *   /invite#v=1&lat=35.681200&lon=139.767100&t=<発行時刻(秒)>&c=<目印色>&a=<精度(m)>
 *
 * 座標は URL フラグメント（#以降）に入れる。フラグメントはブラウザがサーバーへ送らないため、
 * ホスティングのアクセスログやリンクプレビューのクローラーに座標が渡らない。
 * 期限は端末側で判定する（URL を読める人が座標を見られること自体は防げない）。
 */

export const INVITE_TTL_MS = 60 * 60 * 1000; // 有効期限: 60分
const FUTURE_SKEW_MS = 5 * 60 * 1000; // 端末間の時計ずれの許容（未来側）
const MAX_FRAGMENT_LENGTH = 200;

export const BEACON_COLORS = [
  { name: "オレンジ", bg: "#f97316", fg: "#ffffff" },
  { name: "ピンク", bg: "#ec4899", fg: "#ffffff" },
  { name: "ライム", bg: "#84cc16", fg: "#1a2e05" },
  { name: "シアン", bg: "#06b6d4", fg: "#083344" },
  { name: "パープル", bg: "#8b5cf6", fg: "#ffffff" },
  { name: "イエロー", bg: "#facc15", fg: "#422006" },
] as const;

const coordinate = (min: number, max: number) =>
  z
    .string()
    .regex(/^-?\d{1,3}(\.\d{1,8})?$/)
    .transform(Number)
    .pipe(z.number().finite().min(min).max(max));

const inviteSchema = z.object({
  v: z.literal("1"),
  lat: coordinate(-90, 90),
  lon: coordinate(-180, 180),
  t: z
    .string()
    .regex(/^\d{9,11}$/)
    .transform(Number),
  c: z
    .string()
    .regex(/^\d$/)
    .transform(Number)
    .optional(),
  a: z
    .string()
    .regex(/^\d{1,4}$/)
    .transform(Number)
    .optional(),
  d: z.literal("1").optional(),
});

export interface InviteData {
  lat: number;
  lon: number;
  issuedAt: number; // ms
  color: number; // BEACON_COLORS のインデックス
  accuracy: number | null; // 招待者側の測位精度 (m)
  debug: boolean;
}

export type InviteParseResult =
  | { status: "ok"; data: InviteData }
  | { status: "expired" }
  | { status: "invalid" };

export function parseInviteFragment(fragment: string, now: number = Date.now()): InviteParseResult {
  if (fragment.length > MAX_FRAGMENT_LENGTH) return { status: "invalid" };

  const params = new URLSearchParams(fragment.replace(/^#/, ""));
  const raw: Record<string, string> = {};
  for (const key of ["v", "lat", "lon", "t", "c", "a", "d"]) {
    const value = params.get(key);
    if (value !== null) raw[key] = value;
  }

  const parsed = inviteSchema.safeParse(raw);
  if (!parsed.success) return { status: "invalid" };

  const issuedAt = parsed.data.t * 1000;
  if (issuedAt > now + FUTURE_SKEW_MS) return { status: "invalid" };
  if (now - issuedAt > INVITE_TTL_MS) return { status: "expired" };

  const color = parsed.data.c !== undefined && parsed.data.c < BEACON_COLORS.length ? parsed.data.c : 0;

  return {
    status: "ok",
    data: {
      lat: parsed.data.lat,
      lon: parsed.data.lon,
      issuedAt,
      color,
      accuracy: parsed.data.a ?? null,
      debug: parsed.data.d === "1",
    },
  };
}

export function buildInviteUrl(
  origin: string,
  fix: { lat: number; lon: number; accuracy: number },
  color: number,
  now: number = Date.now()
): string {
  const params = new URLSearchParams({
    v: "1",
    lat: fix.lat.toFixed(6),
    lon: fix.lon.toFixed(6),
    t: String(Math.floor(now / 1000)),
    c: String(color),
    a: String(Math.min(9999, Math.max(0, Math.round(fix.accuracy)))),
  });
  return `${origin}/invite#${params.toString()}`;
}

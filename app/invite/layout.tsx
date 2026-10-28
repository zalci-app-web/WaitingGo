import type { Metadata } from "next";

// 招待ページは検索結果に出さない（座標を含む招待を扱うため）
export const metadata: Metadata = {
  title: "WaitingGo",
  robots: { index: false, follow: false },
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

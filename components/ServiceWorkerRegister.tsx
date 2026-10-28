"use client";

import { useEffect } from "react";

/**
 * Service Worker を登録する。回線が混み合う会場でも、一度開いた画面は再読み込みなしで使えるようにする。
 * 開発中はキャッシュが邪魔になるため、本番ビルドでのみ有効。
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // 登録に失敗してもアプリ自体は動く
    });
  }, []);

  return null;
}

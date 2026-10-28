"use client";

import { useEffect, useState } from "react";
import { InviteData, parseInviteFragment } from "@/utils/invite";

const STORAGE_KEY = "waitinggo:invite";

export type InviteState =
  | { status: "loading" }
  | { status: "ok"; data: InviteData }
  | { status: "expired" }
  | { status: "invalid" };

/**
 * 招待情報を URL フラグメントから読み取る。
 *
 * 読み取ったらアドレスバーからフラグメントを消し、元の値はこのタブの sessionStorage にだけ残す。
 * 履歴・スクリーンショット・画面共有から座標が見えにくくなり、リロードしても復元できる。
 * 期限は復元のたびに判定し、無効になったら sessionStorage からも消す。
 */
export function useInvite(): InviteState {
  const [state, setState] = useState<InviteState>({ status: "loading" });

  useEffect(() => {
    const load = () => {
      let source: string | null = null;

      if (window.location.hash.length > 1) {
        source = window.location.hash;
        try {
          sessionStorage.setItem(STORAGE_KEY, source);
        } catch {
          // sessionStorage が使えない環境ではリロードで復元できないだけ
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        try {
          source = sessionStorage.getItem(STORAGE_KEY);
        } catch {
          source = null;
        }
      }

      if (source === null) {
        setState({ status: "invalid" });
        return;
      }

      const result = parseInviteFragment(source);
      if (result.status !== "ok") {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // 無視してよい
        }
      }
      setState(result);
    };

    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, []);

  return state;
}

"use client";

import { useState, useEffect } from "react";

export function useEnvironment() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    // 1. アプリ内ブラウザの検知（LINE, Twitter, Instagram, Facebook等）
    const inAppRegex = /Line|Twitter|Instagram|FBAN|FBAV|Threads/i;
    setIsInAppBrowser(inAppRegex.test(ua));

    // 2. PC(デスクトップ)の検知
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    
    if (!isMobileDevice && !hasTouch) {
      setIsDesktop(true);
    }

    setIsInitialized(true);
  }, []);

  return { isInAppBrowser, isDesktop, isInitialized };
}

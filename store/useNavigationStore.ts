import { create } from "zustand";

/**
 * 画面をまたいで共有する端末センサーの状態。
 * 権限ゲート(PermissionGate)で得た許可を、ナビ画面側のフックからも参照するために使う。
 */
interface NavigationState {
  orientationGranted: boolean;
  setOrientationGranted: (granted: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  orientationGranted: false,
  setOrientationGranted: (granted) => set({ orientationGranted: granted }),
}));

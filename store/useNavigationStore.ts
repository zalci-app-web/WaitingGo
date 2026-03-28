import { create } from "zustand";

interface NavigationState {
  targetLat: number | null;
  targetLon: number | null;
  currentLat: number | null;
  currentLon: number | null;
  alpha: number | null;
  
  setTarget: (lat: number, lon: number) => void;
  setCurrentPosition: (lat: number | null, lon: number | null) => void;
  setAlpha: (alpha: number | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  targetLat: null,
  targetLon: null,
  currentLat: null,
  currentLon: null,
  alpha: null,

  setTarget: (lat, lon) => set({ targetLat: lat, targetLon: lon }),
  setCurrentPosition: (lat, lon) => set({ currentLat: lat, currentLon: lon }),
  setAlpha: (alpha) => set({ alpha }),
}));

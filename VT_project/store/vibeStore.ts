import { create } from 'zustand';

export type VibeType = 'chill' | 'party' | 'nature' | 'city' | 'mystery' | null;

type VibeState = {
  selectedVibe: VibeType;
  setSelectedVibe: (vibe: VibeType) => void;
  clearSelectedVibe: () => void;
};

export const useVibeStore = create<VibeState>((set) => ({
  selectedVibe: null,
  setSelectedVibe: (vibe) => set({ selectedVibe: vibe }),
  clearSelectedVibe: () => set({ selectedVibe: null }),
}));
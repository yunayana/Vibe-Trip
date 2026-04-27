import { create } from 'zustand';
import type { VibeType } from './vibeStore';

export type TripPlace = {
  id: string;
  name: string;
  vibe: VibeType;
  createdAt: string;
};

type TripState = {
  currentTrip: TripPlace | null;
  history: TripPlace[];
  setCurrentTrip: (trip: TripPlace) => void;
  addToHistory: (trip: TripPlace) => void;
  clearHistory: () => void;
};

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  history: [],
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addToHistory: (trip) =>
    set((state) => ({
      history: [trip, ...state.history],
    })),
  clearHistory: () => set({ history: [] }),
}));
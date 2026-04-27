import { create } from 'zustand';

export type FavoritePlace = {
  id: string;
  name: string;
  country?: string;
  vibe: string;
};

type FavoritesState = {
  favorites: FavoritePlace[];
  addFavorite: (place: FavoritePlace) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  addFavorite: (place) =>
    set((state) => ({
      favorites: [...state.favorites, place],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((p) => p.id !== id),
    })),
  clearFavorites: () => set({ favorites: [] }),
}));
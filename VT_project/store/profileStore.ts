import { create } from 'zustand';

export type TravelStyle = 'solo' | 'friends' | 'couple' | '';
export type BudgetLevel = 'low' | 'medium' | 'high' | '';

export type ProfileData = {
  nickname: string;
  homeLocation: string;
  travelStyle: TravelStyle;
  budget: BudgetLevel;
};

type ProfileState = {
  profile: ProfileData;
  updateProfile: (data: ProfileData) => void;
  resetProfile: () => void;
};

const initialProfile: ProfileData = {
  nickname: '',
  homeLocation: '',
  travelStyle: '',
  budget: '',
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: initialProfile,
  updateProfile: (data) => set({ profile: data }),
  resetProfile: () => set({ profile: initialProfile }),
}));
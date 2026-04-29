import { supabase } from '../lib/supabase';

export type SupabaseProfile = {
  id: string;
  email: string | null;
  nickname: string | null;
  home_location: string | null;
  travel_style: string | null;
  budget: string | null;
};

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, nickname, home_location, travel_style, budget')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as SupabaseProfile | null;
}

export async function upsertProfile(profile: SupabaseProfile) {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        ...profile,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    throw error;
  }
}
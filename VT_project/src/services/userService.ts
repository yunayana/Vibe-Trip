import { supabase } from "../lib/supabase";

// Typy danych dla lepszej kontroli kodu
export type Place = {
  name: string;
  lat: number;
  lng: number;
  vibe: string;
  description: string;
};

export type ProfileUpdates = {
  username?: string;
  avatar_url?: string;
  full_name?: string;
};

/**
 * HISTORIA I REKOMENDACJE
 */

// Zapisywanie nowej rekomendacji do historii
export const saveRecommendation = async (userId: string, place: Place) => {
  return await supabase.from("history").insert({
    user_id: userId,
    place_name: place.name,
    latitude: place.lat,
    longitude: place.lng,
    vibe: place.vibe,
    description: place.description,
  });
};

// Pobieranie historii użytkownika (od najnowszych)
export const getUserHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * PROFIL UŻYTKOWNIKA
 */

// Pobieranie danych profilowych (z tabeli public.profiles)
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Błąd podczas pobierania profilu:", error.message);
    return null;
  }
  return data;
};

// Aktualizacja danych w profilu (np. zmiana nazwy użytkownika)
export const updateProfile = async (userId: string, updates: ProfileUpdates) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data;
};
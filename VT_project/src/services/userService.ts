import { supabase } from "../lib/supabase"

type Place = {
  name: string
  lat: number
  lng: number
  vibe: string
  description: string
}


export const saveRecommendation = async (userId: string, place: Place) => {
  return await supabase.from("history").insert({
    user_id: userId,
    place_name: place.name,
    latitude: place.lat,
    longitude: place.lng,
    vibe: place.vibe,
    description: place.description
  })
}

export const getUserHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return data
}
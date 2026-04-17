const places = [
  {
    name: "Barcelona",
    vibe: "party",
    lat: 41.3851,
    lng: 2.1734,
    description: "Miasto imprez i plaż"
  },
  {
    name: "Alpy",
    vibe: "nature",
    lat: 46.8876,
    lng: 9.6570,
    description: "Góry i natura"
  }
]

export const searchPlaces = (vibe: string) => {
  const filtered = places.filter(p => p.vibe === vibe)

  return filtered[Math.floor(Math.random() * filtered.length)]
}
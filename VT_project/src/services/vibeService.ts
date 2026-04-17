type Vibe = "chill" | "party" | "nature" | "city" | "mystery"

export const analyzeVibe = (vibe: Vibe) => {
  const config: Record<Vibe, string[]> = {
    chill: ["beach", "relax", "sun"],
    party: ["nightlife", "clubs", "bars"],
    nature: ["mountains", "forest", "lake"],
    city: ["architecture", "museum", "urban"],
    mystery: ["random"]
  }

  return config[vibe]
}
import { useState } from "react"

interface Coords {
  latitude: number
  longitude: number
}

interface UseDirectionsReturn {
  isActive: boolean
  from: Coords | null
  to: Coords | null
  startDirections: (from: Coords, to: Coords) => void
  clearDirections: () => void
}

export function useDirections(): UseDirectionsReturn {
  const [isActive, setIsActive] = useState(false)
  const [from, setFrom] = useState<Coords | null>(null)
  const [to, setTo] = useState<Coords | null>(null)

  const startDirections = (fromCoords: Coords, toCoords: Coords) => {
    setFrom(fromCoords)
    setTo(toCoords)
    setIsActive(true)
  }

  const clearDirections = () => {
    setFrom(null)
    setTo(null)
    setIsActive(false)
  }

  return { isActive, from, to, startDirections, clearDirections }
}
import { useState } from "react"
import { toast } from "sonner"

interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

interface UseUserLocationReturn {
  fetchLocation: () => Promise<UserLocation | null>
  isLoading: boolean
  error: string | null
}

export function useUserLocation(): UseUserLocationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLocation = (): Promise<UserLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const msg = "Geolocation is not supported by your browser."
        setError(msg)
        toast.error(msg)
        resolve(null)
        return
      }

      setIsLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (err) => {
          setIsLoading(false)
          let msg = "Unable to retrieve your location."
          if (err.code === err.PERMISSION_DENIED) {
            msg = "Location permission denied. Please enable it in your browser settings."
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            msg = "Location information is unavailable."
          } else if (err.code === err.TIMEOUT) {
            msg = "Location request timed out. Please try again."
          }
          setError(msg)
          toast.error(msg)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    })
  }

  return { fetchLocation, isLoading, error }
}
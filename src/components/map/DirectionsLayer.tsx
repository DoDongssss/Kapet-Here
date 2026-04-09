import { useEffect, useState } from "react"
import { Polyline, useMap } from "react-leaflet"
import type { LatLngTuple } from "leaflet"

interface DirectionsLayerProps {
  from: { latitude: number; longitude: number }
  to: { latitude: number; longitude: number }
}

interface OSRMResponse {
  routes: {
    geometry: {
      coordinates: [number, number][]
    }
  }[]
}

export default function DirectionsLayer({ from, to }: DirectionsLayerProps) {
  const map = useMap()
  const [route, setRoute] = useState<LatLngTuple[]>([])
//   const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRoute = async () => {
    //   setIsLoading(true)
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`
        const res = await fetch(url)
        const data: OSRMResponse = await res.json()

        if (data.routes?.[0]) {
          const coords: LatLngTuple[] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          )
          setRoute(coords)

          // Fit map to show full route
          if (coords.length > 0) {
            map.fitBounds(coords, { padding: [50, 50] })
          }
        }
      } catch (err) {
        console.error("Failed to fetch route:", err)
      } finally {
        // setIsLoading(false)
      }
    }

    fetchRoute()
  }, [from.latitude, from.longitude, to.latitude, to.longitude, map])

  if (route.length === 0) return null

  return (
    <>
      {/* Shadow/outline stroke */}
      <Polyline
        positions={route}
        pathOptions={{
          color: "#2A1208",
          weight: 6,
          opacity: 0.15,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {/* Main route stroke */}
      <Polyline
        positions={route}
        pathOptions={{
          color: "#6B3F1F",
          weight: 4,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
          dashArray: undefined,
        }}
      />
    </>
  )
}
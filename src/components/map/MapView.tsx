import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM,
  MAP_MIN_ZOOM, MAP_MAX_ZOOM,
  TILE_URL, TILE_ATTRIBUTION,
} from "@/constants/map"
import { useMapStore } from "@/store/useMapStore"
import CoffeeShopMarker from "./CoffeeShopMarker"
import UserLocationMarker from "./UserLocationMarker"
import DirectionsLayer from "./DirectionsLayer"
import type { CoffeeShop } from "@/types/coffeeShop"

import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon   from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

/** Pans map when a shop is selected */
function MapPanner() {
  const map = useMap()
  const { selectedShop } = useMapStore()
  useEffect(() => {
    if (selectedShop)
      map.flyTo([selectedShop.latitude, selectedShop.longitude], 15, { animate: true, duration: 0.8 })
  }, [selectedShop, map])
  return null
}

/**
 * Listens for the "kapet:locate" custom event dispatched by useMapStore.locateUser()
 * and pans the map to the user's position.
 * This keeps Leaflet's imperative API inside a map-context component
 * while allowing external UI (floating buttons) to trigger panning.
 */
function LocateListener() {
  const map = useMap()
  useEffect(() => {
    const handler = (e: Event) => {
      const { latitude, longitude } = (e as CustomEvent).detail
      map.flyTo([latitude, longitude], 16, { animate: true, duration: 0.8 })
    }
    window.addEventListener("kapet:locate", handler)
    return () => window.removeEventListener("kapet:locate", handler)
  }, [map])
  return null
}

interface MapViewProps {
  shops: CoffeeShop[]
  className?: string
}

export default function MapView({ shops, className }: MapViewProps) {
  const mapRef = useRef(null)
  const { userLocation, directionsShop, showDirections, setSelectedShop } = useMapStore()
  const shouldShowDirections = showDirections && !!userLocation && !!directionsShop

  return (
    <div className={`relative w-full h-full overflow-hidden ${className ?? ""}`}>
      <MapContainer
        ref={mapRef}
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

        <MapPanner />
        <LocateListener />

        {userLocation && (
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            accuracy={userLocation.accuracy}
          />
        )}

        {shops.map((shop) => (
          <CoffeeShopMarker
            key={shop.id}
            shop={shop}
            onClick={() => setSelectedShop(shop)}
          />
        ))}

        {shouldShowDirections && (
          <DirectionsLayer
            from={{ latitude: userLocation!.latitude, longitude: userLocation!.longitude }}
            to={{ latitude: directionsShop!.latitude, longitude: directionsShop!.longitude }}
          />
        )}
      </MapContainer>

      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none z-10" />
    </div>
  )
}
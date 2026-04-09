import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MIN_ZOOM,
  MAP_MAX_ZOOM,
  TILE_URL,
  TILE_ATTRIBUTION,
} from "@/constants/map"
import { useMapStore } from "@/store/useMapStore"
import CoffeeShopMarker from "./CoffeeShopMarker"
import UserLocationMarker from "./UserLocationMarker"
import MapControls from "./MapControls"
import DirectionsLayer from "./DirectionsLayer"
import type { CoffeeShop } from "@/types/coffeeShop"

// Fix Leaflet default icon issue with Vite
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

/** Syncs selected shop → smooth map pan. Must live inside MapContainer. */
function MapPanner() {
  const map = useMap()
  const { selectedShop } = useMapStore()

  useEffect(() => {
    if (selectedShop) {
      map.flyTo([selectedShop.latitude, selectedShop.longitude], 15, {
        animate: true,
        duration: 0.8,
      })
    }
  }, [selectedShop, map])

  return null
}

interface MapViewProps {
  shops: CoffeeShop[]
  className?: string
}

export default function MapView({ shops, className }: MapViewProps) {
  const mapRef = useRef(null)

  // selectedShop and userLocation are read directly from the store
  // by MapPanner and CoffeeShopMarker child components — no need to
  // destructure selectedShop here in the outer component scope.
  const { userLocation, directionsShop, showDirections, setSelectedShop } =
    useMapStore()

  // Use directionsShop (not selectedShop) so route stays alive after drawer closes
  const shouldShowDirections =
    showDirections && !!userLocation && !!directionsShop

  return (
    <div
      className={`relative w-full h-full overflow-hidden shadow-lg ${className ?? ""}`}
    >
      <MapContainer
        ref={mapRef}
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

        {/* Auto-pan map when a shop is selected */}
        <MapPanner />

        {/* Custom zoom + locate-me button overlay */}
        <MapControls />

        {/* Blue dot for user's GPS position */}
        {userLocation && (
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            accuracy={userLocation.accuracy}
          />
        )}

        {/* One marker per coffee shop */}
        {shops.map((shop) => (
          <CoffeeShopMarker
            key={shop.id}
            shop={shop}
            onClick={() => setSelectedShop(shop)}
          />
        ))}

        {/*
          ✅ DirectionsLayer MUST be rendered inside <MapContainer>.
          It uses useMap() via react-leaflet's Polyline internally.
          Placing it outside MapContainer causes a "No map context" error.
        */}
        {shouldShowDirections && (
          <DirectionsLayer
            from={{
              latitude: userLocation!.latitude,
              longitude: userLocation!.longitude,
            }}
            to={{
              latitude: directionsShop!.latitude,
              longitude: directionsShop!.longitude,
            }}
          />
        )}
      </MapContainer>

      {/* Non-interactive vignette ring overlay */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none z-10" />
    </div>
  )
}
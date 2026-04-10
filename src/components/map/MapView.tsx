import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet"
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
import { Coffee } from "lucide-react"

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

function MapPanner() {
  const map = useMap()
  const { selectedShop } = useMapStore()
  useEffect(() => {
    if (selectedShop)
      map.flyTo([selectedShop.latitude, selectedShop.longitude], 15, {
        animate: true,
        duration: 0.8,
      })
  }, [selectedShop, map])
  return null
}

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

function TileReadyWatcher({ onReady }: { onReady: () => void }) {
  // const map = useMap()
  const fired = useRef(false)

  useMapEvents({
    load: () => {
      if (!fired.current) {
        fired.current = true
        onReady()
      }
    },
  })


  useEffect(() => {
    const id = setTimeout(() => {
      if (!fired.current) {
        fired.current = true
        onReady()
      }
    }, 3000)
    return () => clearTimeout(id)
  }, [onReady])

  return null
}


function MapSplash() {
  return (
    <div className="absolute inset-0 z-9999 bg-[#FAF7F2] flex flex-col items-center justify-center gap-5 pointer-events-none">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[#EDE3D8] flex items-center justify-center">
          <Coffee className="w-9 h-9 text-[#6B3F1F]" strokeWidth={1.6} />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#6B3F1F] animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <p
          className="text-lg font-bold text-[#2A1208]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Kape't Here
        </p>
        <p className="text-xs text-[#9C7A5B]">Loading the map…</p>
      </div>
    </div>
  )
}


interface MapViewProps {
  shops: CoffeeShop[]
  className?: string
}

export default function MapView({ shops, className }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef(null)

  const { userLocation, directionsShop, showDirections, setSelectedShop } =
    useMapStore()

  const shouldShowDirections =
    showDirections && !!userLocation && !!directionsShop

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

        <TileReadyWatcher onReady={() => setMapReady(true)} />
        <MapPanner />
        <LocateListener />

        {userLocation && (
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            accuracy={userLocation.accuracy}
          />
        )}

        {shops.map(shop => (
          <CoffeeShopMarker
            key={shop.id}
            shop={shop}
            onClick={() => setSelectedShop(shop)}
          />
        ))}

        {shouldShowDirections && (
          <DirectionsLayer
            from={{
              latitude:  userLocation!.latitude,
              longitude: userLocation!.longitude,
            }}
            to={{
              latitude:  directionsShop!.latitude,
              longitude: directionsShop!.longitude,
            }}
          />
        )}
      </MapContainer>

      {!mapReady && <MapSplash />}

      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none z-10" />
    </div>
  )
}
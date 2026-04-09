import { create } from "zustand"
import type { CoffeeShop } from "@/types/coffeeShop"

interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

interface MapStore {
  selectedShop: CoffeeShop | null
  directionsShop: CoffeeShop | null
  userLocation: UserLocation | null
  showDirections: boolean
  setSelectedShop: (shop: CoffeeShop | null) => void
  setUserLocation: (location: UserLocation | null) => void
  setShowDirections: (show: boolean) => void
  startDirections: (shop: CoffeeShop) => void
  clearDirections: () => void
  locateUser: () => void
}

export const useMapStore = create<MapStore>((set) => ({
  selectedShop: null,
  directionsShop: null,
  userLocation: null,
  showDirections: false,

  setSelectedShop: (shop) => set({ selectedShop: shop }),
  setUserLocation: (location) => set({ userLocation: location }),
  setShowDirections: (show) => set({ showDirections: show }),

  startDirections: (shop) =>
    set({ directionsShop: shop, showDirections: true }),

  clearDirections: () =>
    set({ directionsShop: null, showDirections: false }),

  locateUser: () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        set({
          userLocation: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
        }),
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  },
}))
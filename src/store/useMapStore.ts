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
  isLocating: boolean

  setSelectedShop: (shop: CoffeeShop | null) => void
  setUserLocation: (location: UserLocation | null) => void
  setShowDirections: (show: boolean) => void
  startDirections: (shop: CoffeeShop) => void
  clearDirections: () => void

  /**
   * Triggers geolocation, stores the result, and emits a custom DOM event
   * so MapView (which owns the Leaflet instance) can fly to the position.
   * This keeps Leaflet's imperative API out of Zustand while still allowing
   * non-map UI (floating buttons) to trigger map panning.
   */
  locateUser: () => Promise<void>
}

export const useMapStore = create<MapStore>((set, get) => ({
  selectedShop:   null,
  directionsShop: null,
  userLocation:   null,
  showDirections: false,
  isLocating:     false,

  setSelectedShop:  (shop)     => set({ selectedShop: shop }),
  setUserLocation:  (location) => set({ userLocation: location }),
  setShowDirections:(show)     => set({ showDirections: show }),

  startDirections: (shop) =>
    set({ directionsShop: shop, showDirections: true }),

  clearDirections: () =>
    set({ directionsShop: null, showDirections: false }),

  locateUser: async () => {
    if (get().isLocating) return
    if (!navigator.geolocation) return

    set({ isLocating: true })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location: UserLocation = {
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        }
        set({ userLocation: location, isLocating: false })

        // Dispatch a custom event that MapView listens for
        // so it can call map.flyTo() with the Leaflet instance
        window.dispatchEvent(
          new CustomEvent("kapet:locate", { detail: location })
        )
      },
      () => set({ isLocating: false }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  },
}))
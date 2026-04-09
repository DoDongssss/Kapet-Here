import { create } from "zustand"
import type { CoffeeShop } from "@/types/coffeeShop"

interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

interface MapStore {
  // The shop whose popup/drawer is currently open
  selectedShop: CoffeeShop | null
  // The shop being navigated TO — kept alive even after drawer closes
  directionsShop: CoffeeShop | null
  userLocation: UserLocation | null
  showDirections: boolean
  setSelectedShop: (shop: CoffeeShop | null) => void
  setUserLocation: (location: UserLocation | null) => void
  setShowDirections: (show: boolean) => void
  startDirections: (shop: CoffeeShop) => void
  clearDirections: () => void
}

export const useMapStore = create<MapStore>((set) => ({
  selectedShop: null,
  directionsShop: null,
  userLocation: null,
  showDirections: false,

  // Closing the popup (selectedShop = null) no longer touches directions
  setSelectedShop: (shop) => set({ selectedShop: shop }),

  setUserLocation: (location) => set({ userLocation: location }),

  setShowDirections: (show) => set({ showDirections: show }),

  // Start directions: lock in the destination shop separately from the popup
  startDirections: (shop) =>
    set({ directionsShop: shop, showDirections: true }),

  // Explicitly clear the route (e.g. user taps "Clear route" banner)
  clearDirections: () =>
    set({ directionsShop: null, showDirections: false }),
}))
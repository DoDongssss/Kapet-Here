import { create } from "zustand"

interface UIStore {
  isShopDrawerOpen: boolean
  isMobileSidebarOpen: boolean
  setShopDrawerOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isShopDrawerOpen: false,
  isMobileSidebarOpen: false,
  setShopDrawerOpen: (open) => set({ isShopDrawerOpen: open }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
}))
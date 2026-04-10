import { useState, useEffect, useMemo } from "react"
import { Trophy } from "lucide-react"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import { useMapStore } from "@/store/useMapStore"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

import MapView from "@/components/map/MapView"

import MapSearchBar        from "@/components/home/MapSearchBar"
import FloatingControls    from "@/components/home/FloatingControls"
import WeeklyBestPanel     from "@/components/home/WeeklyBestPanel"
import LocationPermissionPopup from "@/components/home/LocationPermissionPopup"

import CoffeeShopDrawer from "@/components/coffee-shop/CoffeeShopDrawer"
import BrandWatermark   from "@/components/shared/BrandWaterMark"

import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"
import type { Feedback } from "@/types/feedback"


function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(new Date(now).setDate(diff))
  return monday.toISOString().slice(0, 10)
}

function useWeeklyBest(shops: CoffeeShopWithPhotos[]) {
  const weekStart = getWeekStart()

  const { data: allFeedback = [] } = useQuery<Feedback[]>({
    queryKey: ["weekly_feedback", weekStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .gte("created_at", weekStart)
      if (error) throw error
      return data as Feedback[]
    },
    staleTime: 1000 * 60 * 10,
  })

  return useMemo(() => {
    if (!allFeedback.length || !shops.length) return []

    const byShop: Record<string, { total: number; count: number }> = {}
    for (const f of allFeedback) {
      if (!byShop[f.coffee_shop_id])
        byShop[f.coffee_shop_id] = { total: 0, count: 0 }
      byShop[f.coffee_shop_id].total += f.rating
      byShop[f.coffee_shop_id].count += 1
    }

    return shops
      .filter(s => byShop[s.id])
      .map(s => ({
        shop: s,
        avg: byShop[s.id].total / byShop[s.id].count,
        count: byShop[s.id].count,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5)
  }, [allFeedback, shops])
}


export default function HomePage() {
  const [weeklyOpen,        setWeeklyOpen]        = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)

  const { data: shops = [], isLoading } = useCoffeeShops()
  const { setSelectedShop, selectedShop, userLocation, locateUser } = useMapStore()
  const weeklyBest  = useWeeklyBest(shops)
  const isDrawerOpen = !!selectedShop

  useEffect(() => {
    const seen = localStorage.getItem("kapet:locationPopupSeen")
    if (!seen && !userLocation) {
      const t = setTimeout(() => setShowLocationPopup(true), 1000)
      return () => clearTimeout(t)
    }
  }, [userLocation])

  const handleAllowLocation = () => {
    localStorage.setItem("kapet:locationPopupSeen", "true")
    setShowLocationPopup(false)
    locateUser()
  }

  const handleDismissLocation = () => {
    localStorage.setItem("kapet:locationPopupSeen", "true")
    setShowLocationPopup(false)
  }

  const handleShopSelect = (shop: CoffeeShopWithPhotos) => {
    setSelectedShop(shop)
    setWeeklyOpen(false)
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden">

      <MapView shops={shops} className="absolute inset-0 w-full h-full" />

      <div
        className={cn(
          "absolute top-3 left-1/2 -translate-x-1/2 w-[88vw] max-w-md",
          "flex flex-col items-center gap-2 transition-all",
          isDrawerOpen ? "z-[400]" : "z-[500]"
        )}
      >
        <BrandWatermark isDrawerOpen={isDrawerOpen} />

        <MapSearchBar
          shops={shops}
          isLoading={isLoading}
          onSelect={handleShopSelect}
        />
      </div>

      <FloatingControls
        className={cn(
          "absolute bottom-8 right-4 transition-all",
          isDrawerOpen ? "z-40" : "z-50"
        )}
      />

      <div
        className={cn(
          "absolute bottom-8 left-4 transition-all",
          isDrawerOpen ? "z-40" : "z-50"
        )}
      >
        <button
          onClick={() => setWeeklyOpen(v => !v)}
          aria-label="Finest this week"
          className={cn(
            "flex items-center gap-2 px-4 h-12 rounded-[18px] border-[1.5px] shadow-lg transition-all active:scale-95",
            weeklyOpen
              ? "bg-[#2A1208] text-[#FFD49A] border-[#2A1208]"
              : "bg-white/96 backdrop-blur-md border-white/80 text-[#5C3A1E]"
          )}
        >
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
            "bg-gradient-to-br from-[#D4863A] to-[#C07830]"
          )}>
            <Trophy className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
            weeklyOpen
              ? "bg-[#3D1F09] text-[#FFD49A]"
              : "bg-[#FFF0DC] text-[#A0560A]"
          )}>
            {weeklyBest.length}
          </span>
        </button>
      </div>

      {weeklyOpen && !isDrawerOpen && (
        <WeeklyBestPanel
          entries={weeklyBest}
          onSelect={handleShopSelect}
          onClose={() => setWeeklyOpen(false)}
        />
      )}

      <LocationPermissionPopup
        open={showLocationPopup}
        onAllow={handleAllowLocation}
        onDismiss={handleDismissLocation}
      />

      <CoffeeShopDrawer />
    </div>
  )
}
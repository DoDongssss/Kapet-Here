import { useState, useRef, useEffect, useMemo } from "react"
import {
  Search, X, Coffee, MapPin, Navigation,
  MessageSquarePlus, LocateFixed, Loader2,
  Trophy, Star, ChevronRight, MapPinned,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import { useMapStore } from "@/store/useMapStore"
import MapView from "@/components/map/MapView"
import CoffeeShopDrawer from "@/components/coffee-shop/CoffeeShopDrawer"
import { cn } from "@/lib/utils"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Feedback } from "@/types/feedback"
import { motion, AnimatePresence } from "framer-motion"
import BrandWatermark from "@/components/shared/BrandWaterMark"

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
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
      if (!byShop[f.coffee_shop_id]) byShop[f.coffee_shop_id] = { total: 0, count: 0 }
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

interface LocationPermissionPopupProps {
  onAllow: () => void
  onDismiss: () => void
}

function LocationPermissionPopup({ onAllow, onDismiss }: LocationPermissionPopupProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[600]"
        onClick={onDismiss}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[700] w-[90vw] max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8DDD0]"
      >
        <div className="p-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4863A] to-[#C07830] flex items-center justify-center mx-auto mb-4">
            <MapPinned className="w-8 h-8 text-white" strokeWidth={2} />
          </div>

          <h3
            className="text-xl font-bold text-[#2A1208] text-center mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Enable Location
          </h3>

          <p className="text-sm text-[#9C7A5B] text-center mb-6 leading-relaxed">
            Allow location access to find nearby coffee shops and get directions to your favorite spots.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={onAllow}
              className="w-full py-3 px-4 rounded-xl bg-[#6B3F1F] text-white font-semibold text-sm hover:bg-[#5C3519] active:scale-[0.98] transition-all"
            >
              Enable Location
            </button>
            <button
              onClick={onDismiss}
              className="w-full py-3 px-4 rounded-xl bg-[#F5F0E8] text-[#9C7A5B] font-semibold text-sm hover:bg-[#EDE3D8] active:scale-[0.98] transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

interface WeeklyBestPanelProps {
  entries: { shop: CoffeeShopWithPhotos; avg: number; count: number }[]
  onSelect: (shop: CoffeeShopWithPhotos) => void
  onClose: () => void
}

function WeeklyBestPanel({ entries, onSelect, onClose }: WeeklyBestPanelProps) {
  const medals = ["🥇", "🥈", "🥉", "4th", "5th"]

  return (
    <div className="absolute inset-x-0 bottom-0 z-[500] md:inset-auto md:left-4 md:bottom-24 md:w-80">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden border border-[#E8DDD0]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4863A] to-[#C07830] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-sm font-bold text-[#2A1208]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Finest This Week
              </p>
              <p className="text-[10px] text-[#9C7A5B]">Resets every Monday</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#9C7A5B] hover:bg-[#EDE3D8] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F5F0E8] pb-3">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center px-5">
              <Trophy className="w-8 h-8 text-[#E8DDD0]" strokeWidth={1.5} />
              <p className="text-sm text-[#9C7A5B] font-medium">No ratings this week yet</p>
              <p className="text-xs text-[#C4A882]">Be the first to leave a review!</p>
            </div>
          ) : (
            entries.map(({ shop, avg, count }, idx) => {
              const cover = shop.coffee_shop_photos?.[0]?.image_url
              return (
                <button
                  key={shop.id}
                  onClick={() => { onSelect(shop); onClose() }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#FFF8F0] active:bg-[#EDE3D8] transition-colors text-left"
                >
                  <span className="text-base w-6 flex-shrink-0 text-center">
                    {idx < 3 ? medals[idx] : (
                      <span className="text-xs font-bold text-[#9C7A5B]">{idx + 1}</span>
                    )}
                  </span>

                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#EDE3D8]">
                    {cover
                      ? <img src={cover} alt="" className="w-full h-full object-cover" />
                      : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Coffee className="w-4 h-4 text-[#C4A882]" strokeWidth={1.5} />
                        </div>
                      )
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold text-[#2A1208] truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {shop.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-[#D4863A] fill-[#D4863A]" />
                      <span className="text-xs font-semibold text-[#5C3A1E]">{avg.toFixed(1)}</span>
                      <span className="text-[10px] text-[#C4A882]">({count})</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#D8C9B8] flex-shrink-0" />
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="flex justify-center -mt-6 md:hidden pointer-events-none absolute top-0 left-0 right-0">
        <div className="w-10 h-1 rounded-full bg-[#D8C9B8] mt-2" />
      </div>
    </div>
  )
}

// ── Home page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [weeklyOpen, setWeeklyOpen] = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: shops = [], isLoading } = useCoffeeShops()
  const { setSelectedShop, selectedShop, userLocation, isLocating, locateUser } = useMapStore()
  const weeklyBest = useWeeklyBest(shops)

  const results: CoffeeShopWithPhotos[] = query.trim().length > 0
    ? shops.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    const hasSeenLocationPopup = localStorage.getItem('hasSeenLocationPopup')
    if (!hasSeenLocationPopup && !userLocation) {
      const timer = setTimeout(() => {
        setShowLocationPopup(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [userLocation])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (shop: CoffeeShopWithPhotos) => {
    setSelectedShop(shop)
    setQuery("")
    setSearchOpen(false)
    inputRef.current?.blur()
  }

  const handleAllowLocation = () => {
    localStorage.setItem('hasSeenLocationPopup', 'true')
    setShowLocationPopup(false)
    locateUser()
  }

  const handleDismissLocation = () => {
    localStorage.setItem('hasSeenLocationPopup', 'true')
    setShowLocationPopup(false)
  }

  const isDrawerOpen = !!selectedShop

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <MapView shops={shops} className="absolute inset-0 w-full h-full" />

      {/* ── Brand name — top-left watermark ── */}
      <BrandWatermark isDrawerOpen={isDrawerOpen} />

      {/* ── Search bar ── */}
      <div
        ref={searchRef}
        className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2 w-[88vw] max-w-md transition-all",
          isDrawerOpen ? "z-[400]" : "z-[500]"
        )}
      >
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 mt-16",
          "bg-white/96 backdrop-blur-lg shadow-xl border transition-all duration-200",
          searchOpen && query.trim().length > 0
            ? "rounded-t-2xl border-[#D4B896] border-b-transparent"
            : "rounded-2xl border-white/80"
        )}>
          <Search
            className={cn("w-4 h-4 shrink-0 transition-colors",
              searchOpen ? "text-[#6B3F1F]" : "text-[#C4A882]")}
            strokeWidth={2.2}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search coffee shops…"
            className="flex-1 bg-transparent text-sm text-[#2A1208] placeholder-[#C4A882] outline-none min-w-0"
          />
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-[#E8DDD0] border-t-[#6B3F1F] animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus() }}
              className="w-6 h-6 rounded-full bg-[#EDE3D8] text-[#9C7A5B] flex items-center justify-center hover:bg-[#D8C9B8] transition-colors shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE3D8] shrink-0">
              <Coffee className="w-3 h-3 text-[#6B3F1F]" />
              <span className="text-[11px] font-semibold text-[#6B3F1F]">{shops.length}</span>
            </div>
          )}
        </div>

        {searchOpen && query.trim().length > 0 && (
          <div className="bg-white/97 backdrop-blur-lg border border-[#D4B896] border-t-0 rounded-b-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D8C9B8]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[#9C7A5B]">No shops match</p>
                <p className="text-xs text-[#C4A882]">"{query}"</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#F5F0E8]">
                {results.map(shop => {
                  const cover = shop.coffee_shop_photos?.[0]?.image_url
                  return (
                    <li key={shop.id}>
                      <button
                        onClick={() => handleSelect(shop)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FFF8F0] active:bg-[#EDE3D8] transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-[#EDE3D8]">
                          {cover
                            ? <img src={cover} alt="" className="w-full h-full object-cover" />
                            : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Coffee className="w-4 h-4 text-[#C4A882]" strokeWidth={1.5} />
                              </div>
                            )
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-[#2A1208] truncate"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {shop.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#C4A882] shrink-0" strokeWidth={2} />
                            <p className="text-xs text-[#9C7A5B] truncate">{shop.location}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#D8C9B8] shrink-0" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ── Right FABs (locate + feedback) ── */}
      <div className={cn(
        "absolute bottom-8 right-4 flex flex-col gap-2.5 items-center transition-all",
        isDrawerOpen ? "z-[400]" : "z-[500]"
      )}>
        <button
          onClick={locateUser}
          aria-label="Go to my location"
          className={cn(
            "w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-95",
            userLocation
              ? "bg-[#6B3F1F] text-white"
              : "bg-white text-[#5C3A1E] border border-[#E8DDD0] hover:border-[#D4B896]"
          )}
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : userLocation ? (
            <span className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-white/25 animate-ping" />
              <Navigation className="w-5 h-5 relative" strokeWidth={2} />
            </span>
          ) : (
            <LocateFixed className="w-5 h-5" strokeWidth={2} />
          )}
        </button>

        <Link
          to="/feedback"
          aria-label="Submit feedback"
          className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-[#E8DDD0] flex items-center justify-center text-[#5C3A1E] hover:border-[#D4B896] hover:text-[#6B3F1F] active:scale-95 transition-all"
        >
          <MessageSquarePlus className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>

      {/* ── Finest This Week button (Option C) ── */}
      <div className={cn(
        "absolute bottom-8 left-4 transition-all",
        isDrawerOpen ? "z-[400]" : "z-[500]"
      )}>
        <button
          onClick={() => setWeeklyOpen(v => !v)}
          aria-label="Finest this week"
          className={cn(
            "flex items-center gap-2 px-4 h-12 rounded-[18px] border-[1.5px] shadow-lg transition-all active:scale-95",
            weeklyOpen
              ? "bg-[#2A1208] text-[#FFD49A] border-[#2A1208]"
              : "bg-white text-[#3D1F09] border-[#D4863A] hover:border-[#C07830]"
          )}
        >
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
            weeklyOpen
              ? "bg-[#D4863A]"
              : "bg-gradient-to-br from-[#D4863A] to-[#C07830]"
          )}>
            <Trophy className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-[13px] font-semibold">Finest This Week</span>
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

      {/* ── Weekly best panel ── */}
      {weeklyOpen && !isDrawerOpen && (
        <WeeklyBestPanel
          entries={weeklyBest}
          onSelect={handleSelect}
          onClose={() => setWeeklyOpen(false)}
        />
      )}

      {/* ── Location permission popup ── */}
      <AnimatePresence>
        {showLocationPopup && (
          <LocationPermissionPopup
            onAllow={handleAllowLocation}
            onDismiss={handleDismissLocation}
          />
        )}
      </AnimatePresence>

      <CoffeeShopDrawer />
    </div>
  )
}
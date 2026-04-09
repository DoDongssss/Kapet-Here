import { useState, useRef, useEffect } from "react"
import { Search, X, Coffee, MapPin, Navigation, MessageSquarePlus, Compass } from "lucide-react"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import { useMapStore } from "@/store/useMapStore"
import MapView from "@/components/map/MapView"
import CoffeeShopDrawer from "@/components/coffee-shop/CoffeeShopDrawer"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

function FloatingNav() {
  const { userLocation, locateUser } = useMapStore()
  const navigate = useNavigate()

  return (
    <div className="absolute bottom-6 left-4 z-[500] flex flex-col-reverse gap-2.5 md:hidden">

      <button
        onClick={locateUser}
        aria-label="Go to my location"
        className={cn(
          "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95",
          userLocation
            ? "bg-[#6B3F1F] text-white"
            : "bg-white text-[#9C7A5B] border border-[#E8DDD0]"
        )}
      >
        {userLocation ? (
          <span className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-white/20 animate-ping" />
            <Navigation className="w-5 h-5 relative" strokeWidth={2} />
          </span>
        ) : (
          <Navigation className="w-5 h-5" strokeWidth={2} />
        )}
      </button>

      <button
        onClick={() => navigate("/feedback")}
        aria-label="Submit feedback"
        className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#E8DDD0] flex items-center justify-center text-[#9C7A5B] hover:text-[#6B3F1F] hover:border-[#D4B896] transition-all active:scale-95"
      >
        <MessageSquarePlus className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        onClick={() => navigate("/explore")}
        aria-label="Explore map"
        className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#E8DDD0] flex items-center justify-center text-[#9C7A5B] hover:text-[#6B3F1F] hover:border-[#D4B896] transition-all active:scale-95"
      >
        <Compass className="w-5 h-5" strokeWidth={2} />
      </button>

    </div>
  )
}

function DesktopFAB() {
  const { userLocation, locateUser } = useMapStore()
  const navigate = useNavigate()

  return (
    <div className="absolute bottom-8 left-4 z-[400] hidden md:flex flex-col gap-2">
      <button
        onClick={locateUser}
        aria-label="Go to my location"
        className={cn(
          "group w-11 h-11 rounded-xl shadow-md flex items-center justify-center transition-all active:scale-95",
          userLocation
            ? "bg-[#6B3F1F] text-white"
            : "bg-white text-[#9C7A5B] border border-[#E8DDD0] hover:border-[#D4B896] hover:text-[#6B3F1F]"
        )}
      >
        {userLocation ? (
          <span className="relative flex items-center justify-center">
            <span className="absolute w-6 h-6 rounded-full bg-white/20 animate-ping" />
            <Navigation className="w-4 h-4 relative" strokeWidth={2} />
          </span>
        ) : (
          <Navigation className="w-4 h-4" strokeWidth={2} />
        )}
      </button>

      <button
        onClick={() => navigate("/feedback")}
        aria-label="Submit feedback"
        className="w-11 h-11 rounded-xl bg-white shadow-md border border-[#E8DDD0] flex items-center justify-center text-[#9C7A5B] hover:text-[#6B3F1F] hover:border-[#D4B896] transition-all active:scale-95"
      >
        <MessageSquarePlus className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  )
}

export default function HomePage() {
  const [query, setQuery]           = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef  = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: shops = [], isLoading } = useCoffeeShops()
  const { setSelectedShop } = useMapStore()

  const results: CoffeeShopWithPhotos[] = query.trim().length > 0
    ? shops.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase())
      )
    : []

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

  return (
    <div className="relative w-full h-dvh overflow-hidden">

      <MapView shops={shops} className="absolute inset-0 w-full h-full" />

      <DesktopFAB />

      <FloatingNav />

      <div
        ref={searchRef}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-[88vw] max-w-md md:w-96 md:left-1/2"
      >
        <div className={cn(
          "flex items-center gap-3 px-4 py-3",
          "bg-white/95 backdrop-blur-lg shadow-xl border transition-all duration-200",
          searchOpen && query.trim().length > 0
            ? "rounded-t-2xl border-[#D4B896] border-b-transparent"
            : "rounded-2xl border-white/80"
        )}>
          <Search
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              searchOpen ? "text-[#6B3F1F]" : "text-[#C4A882]"
            )}
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
            <div className="w-4 h-4 rounded-full border-2 border-[#E8DDD0] border-t-[#6B3F1F] animate-spin flex-shrink-0" />
          ) : query ? (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus() }}
              className="w-6 h-6 rounded-full bg-[#EDE3D8] text-[#9C7A5B] flex items-center justify-center hover:bg-[#D8C9B8] transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE3D8] flex-shrink-0">
              <Coffee className="w-3 h-3 text-[#6B3F1F]" />
              <span className="text-[11px] font-semibold text-[#6B3F1F]">{shops.length}</span>
            </div>
          )}
        </div>

        {searchOpen && query.trim().length > 0 && (
          <div
            className={cn(
              "bg-white/97 backdrop-blur-lg border border-[#D4B896] border-t-0",
              "rounded-b-2xl shadow-2xl overflow-hidden",
              "max-h-72 overflow-y-auto"
            )}
          >
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
                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[#EDE3D8]">
                          {cover ? (
                            <img src={cover} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="w-4 h-4 text-[#C4A882]" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-[#2A1208] truncate"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {shop.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#C4A882] flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-[#9C7A5B] truncate">{shop.location}</p>
                          </div>
                        </div>

                        <div className="w-6 h-6 rounded-full bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3 text-[#9C7A5B]" strokeWidth={2} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <CoffeeShopDrawer />
    </div>
  )
}
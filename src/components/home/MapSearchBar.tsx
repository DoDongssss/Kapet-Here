import { useRef, useEffect, useState } from "react"
import { Search, X, Coffee, MapPin, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

interface MapSearchBarProps {
  shops: CoffeeShopWithPhotos[]
  isLoading: boolean
  onSelect: (shop: CoffeeShopWithPhotos) => void
  className?: string
}

export default function MapSearchBar({
  shops,
  isLoading,
  onSelect,
  className,
}: MapSearchBarProps) {
  const [query, setQuery]         = useState("")
  const [open, setOpen]           = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const results: CoffeeShopWithPhotos[] = query.trim().length > 0
    ? shops.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSelect = (shop: CoffeeShopWithPhotos) => {
    onSelect(shop)
    setQuery("")
    setOpen(false)
    inputRef.current?.blur()
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={wrapRef} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3",
          "bg-white/96 backdrop-blur-lg shadow-xl border transition-all duration-200",
          showDropdown
            ? "rounded-t-2xl border-[#D4B896] border-b-transparent"
            : "rounded-2xl border-white/80"
        )}
      >
        <Search
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            open ? "text-[#6B3F1F]" : "text-[#C4A882]"
          )}
          strokeWidth={2.2}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search coffee shops…"
          className="flex-1 bg-transparent text-sm text-[#2A1208] placeholder-[#C4A882] outline-none min-w-0"
        />

        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-[#E8DDD0] border-t-[#6B3F1F] animate-spin shrink-0" />
        ) : query ? (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus() }}
            className="w-6 h-6 rounded-full bg-[#EDE3D8] text-[#9C7A5B] flex items-center justify-center hover:bg-[#D8C9B8] transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE3D8] shrink-0">
            <Coffee className="w-3 h-3 text-[#6B3F1F]" />
            <span className="text-[11px] font-semibold text-[#6B3F1F]">
              {shops.length}
            </span>
          </div>
        )}
      </div>

      {showDropdown && (
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
                        {cover ? (
                          <img src={cover} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Coffee className="w-4 h-4 text-[#C4A882]" strokeWidth={1.5} />
                          </div>
                        )}
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
  )
}
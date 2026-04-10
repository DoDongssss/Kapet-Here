import { useEffect, useState } from "react"
import { X, Trophy, Coffee, Star, ChevronRight, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

const MEDALS = ["🥇", "🥈", "🥉"]

export interface WeeklyEntry {
  shop: CoffeeShopWithPhotos
  avg: number
  count: number
}

interface WeeklyBestPanelProps {
  entries: WeeklyEntry[]
  onSelect: (shop: CoffeeShopWithPhotos) => void
  onClose: () => void
  isLoading?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton row
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 animate-pulse">
      <div className="w-6 h-4 rounded bg-[#EDE3D8] flex-shrink-0" />
      <div className="w-10 h-10 rounded-xl bg-[#EDE3D8] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full bg-[#EDE3D8] w-3/4" />
        <div className="h-2.5 rounded-full bg-[#F5F0E8] w-1/3" />
      </div>
      <div className="w-4 h-4 rounded bg-[#F5F0E8] flex-shrink-0" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry row — staggers in on mount
// ─────────────────────────────────────────────────────────────────────────────

interface EntryRowProps {
  entry: WeeklyEntry
  idx: number
  onSelect: (shop: CoffeeShopWithPhotos) => void
  onClose: () => void
  visible: boolean
}

function EntryRow({ entry, idx, onSelect, onClose, visible }: EntryRowProps) {
  const { shop, avg, count } = entry
  const cover = shop.coffee_shop_photos?.[0]?.image_url
  const isTop3 = idx < 3

  return (
    <button
      onClick={() => { onSelect(shop); onClose() }}
      style={{ transitionDelay: `${idx * 60}ms` }}
      className={cn(
        "w-full flex items-center gap-3 px-5 py-3 text-left",
        "hover:bg-[#FFF8F0] active:bg-[#EDE3D8] transition-all duration-200",
        "transform",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
    >
      {/* Rank */}
      <span className="w-6 text-center flex-shrink-0">
        {isTop3
          ? <span className="text-base leading-none">{MEDALS[idx]}</span>
          : <span className="text-xs font-bold text-[#9C7A5B]">{idx + 1}</span>
        }
      </span>

      {/* Thumbnail */}
      <div className={cn(
        "w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#EDE3D8]",
        isTop3 && "ring-2 ring-offset-1",
        idx === 0 && "ring-[#D4863A]",
        idx === 1 && "ring-[#9C7A5B]",
        idx === 2 && "ring-[#C4A882]",
      )}>
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
          <Star className="w-3 h-3 text-[#D4863A] fill-[#D4863A]" />
          <span className="text-xs font-bold text-[#5C3A1E]">
            {avg.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#C4A882]">· {count} {count === 1 ? "review" : "reviews"}</span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-[#D8C9B8] flex-shrink-0 group-hover:text-[#9C7A5B] transition-colors" />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────────────────────

export default function WeeklyBestPanel({
  entries,
  onSelect,
  onClose,
  isLoading = false,
}: WeeklyBestPanelProps) {
  // Panel mount animation
  const [mounted, setMounted]   = useState(false)
  // Stagger rows after panel lands
  const [rowsVisible, setRowsVisible] = useState(false)
  // Exit animation
  const [closing, setClosing]   = useState(false)

  useEffect(() => {
    // Trigger panel slide-in on next frame
    const t1 = requestAnimationFrame(() => setMounted(true))
    // Stagger rows slightly after panel
    const t2 = setTimeout(() => setRowsVisible(true), 180)
    return () => { cancelAnimationFrame(t1); clearTimeout(t2) }
  }, [])

  const handleClose = () => {
    setClosing(true)
    setRowsVisible(false)
    setTimeout(onClose, 280)
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-500",
        "md:inset-auto md:left-4 md:bottom-24 md:w-80",
        "transition-transform duration-300 ease-out",
        "md:transition-all md:duration-300 md:ease-out",
        mounted && !closing
          ? "translate-y-0"
          : "translate-y-full",
        "md:translate-y-0",
        mounted && !closing
          ? "md:opacity-100 md:scale-100"
          : "md:opacity-0 md:scale-95"
      )}
    >
      <div className="flex justify-center pt-2.5 pb-0 md:hidden">
        <div className="w-10 h-1 rounded-full bg-[#D8C9B8]" />
      </div>

      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden border border-[#E8DDD0]">

        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F5F0E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF3E7] border border-[#F0D5B0] flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4.5 h-4.5 text-[#D4863A]" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p
                  className="text-sm font-bold text-[#2A1208]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Finest This Week
                </p>
                {!isLoading && entries.length > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FDF3E7] border border-[#F0D5B0]">
                    <Flame className="w-2.5 h-2.5 text-[#D4863A]" strokeWidth={2.5} />
                    <span className="text-[9px] font-bold text-[#D4863A]">{entries.length}</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#C4A882] mt-0.5">Resets every Monday</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close weekly best"
            className="w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#9C7A5B] hover:bg-[#EDE3D8] hover:text-[#5C3A1E] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F5F0E8] pb-2">
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : entries.length === 0 ? (
            <div
              className={cn(
                "flex flex-col items-center gap-2 py-10 text-center px-5",
                "transition-all duration-300",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#D8C9B8]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[#9C7A5B]">
                No ratings this week yet
              </p>
              <p className="text-xs text-[#C4A882] leading-relaxed max-w-[180px]">
                Visit a coffee shop and be the first to leave a review!
              </p>
            </div>
          ) : (
            entries.map((entry, idx) => (
              <EntryRow
                key={entry.shop.id}
                entry={entry}
                idx={idx}
                onSelect={onSelect}
                onClose={handleClose}
                visible={rowsVisible}
              />
            ))
          )}
        </div>

        {!isLoading && entries.length > 0 && (
          <div
            className={cn(
              "px-5 py-3 border-t border-[#F5F0E8]",
              "transition-all duration-500 delay-300",
              rowsVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <p className="text-[10px] text-[#C4A882] text-center">
              Ranked by average rating this week
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
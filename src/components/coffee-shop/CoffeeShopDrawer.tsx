import { useEffect } from "react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import {
  Navigation, X, MapPin, Star, ExternalLink, ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useMapStore } from "@/store/useMapStore"
import { useCoffeeShop } from "@/hooks/useCoffeeShop"
import { useFeedback } from "@/hooks/useFeedback"
import { useIsDesktop } from "@/hooks/useMediaQuery"
import CoffeeShopGallery from "./CoffeeShopGallery"
import CoffeeShopRating from "./CoffeeShopRating"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { coffeeShopPath } from "@/constants/routes"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"
import type { Feedback } from "@/types/feedback"
import type { CoffeeShop } from "@/types/coffeeShop"

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components at MODULE level
// ─────────────────────────────────────────────────────────────────────────────

interface DetailContentProps {
  shopDetail: CoffeeShopWithPhotos
  feedback: Feedback[]
  averageRating: number
  googleMapsUrl: string
  onGetDirections: () => void
  onClose: () => void
}

function PhotoCountBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute bottom-2.5 left-3 text-[11px] text-white/80 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
      1 / {count}
    </span>
  )
}

function DetailContent({
  shopDetail,
  feedback,
  averageRating,
  googleMapsUrl,
  onGetDirections,
  onClose,
}: DetailContentProps) {
  const photoCount = shopDetail.coffee_shop_photos?.length ?? 0

  return (
    <div className="flex flex-col">

      {/* Gallery */}
      <div className="relative">
        <CoffeeShopGallery
          photos={shopDetail.coffee_shop_photos ?? []}
          className="rounded-none h-48 overflow-hidden"
        />
        <PhotoCountBadge count={photoCount} />
      </div>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4">

        {/* Name + location + rating */}
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-[1.2rem] font-bold text-[#2A1208] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {shopDetail.name}
          </h2>

          <div className="flex items-center gap-1.5 text-[#9C7A5B]">
            <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-[12px] leading-snug">{shopDetail.location}</span>
          </div>

          {feedback.length > 0 && (
            <CoffeeShopRating
              rating={averageRating}
              count={feedback.length}
              size="sm"
            />
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#EDE3D8]" />

        {/* Stats row */}
        {/* <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl bg-[#F5F0E8] border border-[#E8DDD0]">
            <span className="text-[10px] font-semibold text-[#9C7A5B] uppercase tracking-widest">
              Reviews
            </span>
            <span className="text-[15px] font-bold text-[#2A1208]">
              {feedback.length > 0 ? feedback.length : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl bg-[#F5F0E8] border border-[#E8DDD0]">
            <span className="text-[10px] font-semibold text-[#9C7A5B] uppercase tracking-widest">
              Avg rating
            </span>
            <span className="text-[15px] font-bold text-[#2A1208]">
              {feedback.length > 0 ? `${averageRating.toFixed(1)} ★` : "—"}
            </span>
          </div>
        </div> */}

        {/* Divider */}
        {/* <div className="h-px bg-[#EDE3D8]" /> */}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onGetDirections}
            className={cn(
              "gap-2 bg-[#6B3F1F] hover:bg-[#4A2810] text-white",
              "h-11 text-[13px] font-semibold rounded-xl",
              "transition-all active:scale-[0.97]"
            )}
          >
            <Navigation className="w-4 h-4" />
            Directions
          </Button>
          
          <a  href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="outline"
              className={cn(
                "w-full gap-2 h-11 text-[13px] rounded-xl",
                "border-[#E8DDD0] text-[#5C3A1E] hover:bg-[#EDE3D8]",
                "transition-all active:scale-[0.97]"
              )}
            >
              <ExternalLink className="w-4 h-4" />
              Google Maps
            </Button>
          </a>
        </div>

        {/* Full-page link */}
        <Link
          to={coffeeShopPath(shopDetail.id)}
          onClick={onClose}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3",
            "rounded-xl bg-[#F5F0E8] border border-[#E8DDD0]",
            "hover:bg-[#EDE3D8] transition-colors group"
          )}
        >
          <span className="text-[13px] font-medium text-[#5C3A1E]">
            See all reviews &amp; photos
          </span>
          <ArrowRight className="w-4 h-4 text-[#9C7A5B] group-hover:text-[#6B3F1F] transition-colors" />
        </Link>

      </div>
    </div>
  )
}

interface DirectionsBannerProps {
  directionsShop: CoffeeShop
  onClear: () => void
}

function DirectionsBanner({ directionsShop, onClear }: DirectionsBannerProps) {
  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-[500]",
        "flex items-center gap-3 px-4 py-3 rounded-2xl",
        "bg-[#2A1208]/95 backdrop-blur-sm text-white shadow-2xl",
        "border border-white/10 min-w-[220px] max-w-[300px]"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-[#D4863A]/20 flex items-center justify-center flex-shrink-0">
        <Navigation className="w-4 h-4 text-[#D4863A]" />
      </div>
      <div className="leading-tight flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{directionsShop.name}</p>
        <p className="text-[10px] text-[#9C7A5B] mt-0.5">
          Route active · tap × to clear
        </p>
      </div>
      <button
        onClick={onClear}
        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors flex-shrink-0"
        aria-label="Clear route"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function CoffeeShopDrawer() {
  const isDesktop = useIsDesktop()

  const {
    selectedShop,
    setSelectedShop,
    userLocation,
    startDirections,
    clearDirections,
    showDirections,
    directionsShop,
  } = useMapStore()

  const { data: shopDetail, isLoading } = useCoffeeShop(selectedShop?.id)
  const { data: feedback = [] } = useFeedback(selectedShop?.id)

  const averageRating =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0

  const handleClose = () => setSelectedShop(null)

  const handleGetDirections = () => {
    if (!userLocation) {
      toast.error("Enable your location first — tap the locate button on the map.")
      return
    }
    if (!shopDetail) return
    startDirections(shopDetail)
    setSelectedShop(null)
    toast.success(`Directions set to ${shopDetail.name}`)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedShop) handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedShop])

  const googleMapsUrl = shopDetail
    ? `https://www.google.com/maps/dir/?api=1&destination=${shopDetail.latitude},${shopDetail.longitude}`
    : "#"

  const showBanner = showDirections && !!directionsShop && !selectedShop

  const detailContent = shopDetail ? (
    <DetailContent
      shopDetail={shopDetail}
      feedback={feedback}
      averageRating={averageRating}
      googleMapsUrl={googleMapsUrl}
      onGetDirections={handleGetDirections}
      onClose={handleClose}
    />
  ) : null

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <>
        {showBanner && (
          <DirectionsBanner directionsShop={directionsShop!} onClear={clearDirections} />
        )}

        <div
          className={cn(
            "absolute top-0 right-0 bottom-0",
            "flex flex-col bg-[#FAF7F2]",
            "border-l border-[#E8DDD0] shadow-2xl overflow-hidden h-full",
            "transition-all duration-300 ease-in-out",
            selectedShop ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
        >
          {selectedShop && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DDD0] flex-shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EDE3D8] flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-[#6B3F1F]" strokeWidth={2} />
                  </div>
                  <p className="text-[11px] font-semibold text-[#5C3A1E] uppercase tracking-widest">
                    Shop details
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9C7A5B] hover:bg-[#EDE3D8] hover:text-[#2A1208] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading
                  ? <LoadingSpinner className="py-16" label="Loading..." />
                  : detailContent
                }
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  // ── MOBILE ────────────────────────────────────────────────────────────────
  return (
    <>
      {showBanner && (
        <DirectionsBanner directionsShop={directionsShop!} onClear={clearDirections} />
      )}

      <Drawer
        open={!!selectedShop}
        onOpenChange={(open) => { if (!open) handleClose() }}
      >
        <DrawerContent
          className={cn(
            "bg-[#FAF7F2] border-[#E8DDD0]",
            "max-h-[88dvh] focus:outline-none",
            "rounded-t-2xl"
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-[#D8C9B8]" />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute top-3 right-4 w-7 h-7 rounded-full",
              "bg-[#EDE3D8] flex items-center justify-center",
              "text-[#9C7A5B] hover:bg-[#D8C9B8] transition-colors z-10"
            )}
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {isLoading
              ? <LoadingSpinner className="py-12" label="Loading details..." />
              : detailContent
            }
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
import { useState } from "react"
import { ChevronLeft, ChevronRight, X, ImageOff, Expand } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CoffeeShopPhoto } from "@/types/coffeeShop"

interface CoffeeShopGalleryProps {
  photos: CoffeeShopPhoto[]
  className?: string
}

export default function CoffeeShopGallery({ photos, className }: CoffeeShopGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setActiveIndex((i) => (i + 1) % photos.length)

  if (photos.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-[#EDE3D8] border border-[#E8DDD0]",
        "rounded-2xl h-52",
        className
      )}>
        <ImageOff className="w-9 h-9 text-[#C4A882] mb-2" strokeWidth={1.4} />
        <p className="text-sm text-[#9C7A5B]">No photos yet</p>
      </div>
    )
  }

  return (
    <>
      <div className={cn("space-y-2.5", className)}>
        {/* Hero image */}
        <div className="relative overflow-hidden rounded-2xl bg-[#EDE3D8] h-60 sm:h-72">
          <img
            src={photos[activeIndex].image_url}
            alt={`Photo ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Gradient bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Expand / lightbox button — always visible, top-right */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center active:scale-95 transition-transform"
            aria-label="View fullscreen"
          >
            <Expand className="w-4 h-4" />
          </button>

          {/* Prev / Next — always visible on mobile (not hover-only) */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot indicators + counter */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
            {photos.length <= 6
              ? photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      idx === activeIndex
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/50"
                    )}
                    aria-label={`Go to photo ${idx + 1}`}
                  />
                ))
              : (
                <span className="px-2.5 py-0.5 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                  {activeIndex + 1} / {photos.length}
                </span>
              )
            }
          </div>
        </div>

        {/* Thumbnails — only render if more than 1 photo */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95",
                  idx === activeIndex
                    ? "border-[#6B3F1F] ring-2 ring-[#6B3F1F]/20"
                    : "border-transparent opacity-55 hover:opacity-80"
                )}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
            {activeIndex + 1} / {photos.length}
          </div>

          <img
            src={photos[activeIndex].image_url}
            alt=""
            className="max-h-[85dvh] max-w-[95vw] rounded-xl object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
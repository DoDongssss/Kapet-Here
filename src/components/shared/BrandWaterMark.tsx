import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type BrandWatermarkProps = {
  isDrawerOpen: boolean
  location?: string
}

export default function BrandWatermark({
  isDrawerOpen,
  location = "South Cotabato",
}: BrandWatermarkProps) {
  return (
    <div
      className={cn(
        // No absolute positioning — parent flex container handles placement
        "flex flex-col items-center gap-0",
        // Glass card
        "px-4 py-2.5 rounded-2xl",
        "bg-white/30 backdrop-blur-lg border border-white/50",
        "shadow-[0_2px_16px_rgba(42,18,8,0.10),inset_0_1px_0_rgba(255,255,255,0.6)]",
        // Sizing — shrinks to content width
        "w-auto max-w-full",
        // Fade + scale when drawer open
        "transition-all duration-300 pointer-events-none",
        isDrawerOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
    >
      {/* Logo + name row */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Kape't Here"
          className="h-7.5 w-7.5 rounded-full object-cover drop-shadow-sm flex-shrink-0"
        />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#A67C52]/50 to-transparent mt-2 mb-1.5" />

      {/* Tagline + location */}
      <div className="flex items-center gap-1.5 text-[8px] font-semibold tracking-[0.18em] text-[#A67C52] uppercase">
        <span>Find Your Cup</span>
        {location && (
          <>
            <span className="opacity-40">•</span>
            <MapPin className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
            <span className="truncate max-w-[100px] opacity-80">{location}</span>
          </>
        )}
      </div>
    </div>
  )
}
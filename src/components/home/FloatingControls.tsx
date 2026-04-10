import { Navigation, LocateFixed, Loader2, MessageSquarePlus } from "lucide-react"
import { Link } from "react-router-dom"
import { useMapStore } from "@/store/useMapStore"
import { cn } from "@/lib/utils"

export default function FloatingControls({ className }: { className?: string }) {
  const { userLocation, isLocating, locateUser } = useMapStore()

  return (
    <div className={cn("flex flex-col gap-2.5 items-center", className)}>
      <button
        onClick={locateUser}
        aria-label="Go to my location"
        className={cn(
          "w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-95",
          userLocation
            ? "bg-[#6B3F1F] text-white"
            : "bg-white/96 backdrop-blur-md text-[#5C3A1E] border border-[#E8DDD0] hover:border-[#D4B896]"
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
        className="w-12 h-12 rounded-2xl bg-white/96 backdrop-blur-md shadow-lg border border-[#E8DDD0] flex items-center justify-center text-[#5C3A1E] hover:border-[#D4B896] hover:text-[#6B3F1F] active:scale-95 transition-all"
      >
        <MessageSquarePlus className="w-5 h-5" strokeWidth={2} />
      </Link>
    </div>
  )
}
import { useMap } from "react-leaflet"
import { Plus, Minus, LocateFixed, Loader2 } from "lucide-react"
import { useMapStore } from "@/store/useMapStore"
import { useUserLocation } from "@/hooks/useUserLocation"
import { cn } from "@/lib/utils"

function ControlButton({
  onClick,
  children,
  title,
  disabled,
  className,
}: {
  onClick: () => void
  children: React.ReactNode
  title: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "w-9 h-9 flex items-center justify-center bg-white border border-[#E8DDD0] text-[#5C3A1E]",
        "hover:bg-[#EDE3D8] hover:text-[#3D1F0D] transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
        className
      )}
    >
      {children}
    </button>
  )
}

export default function MapControls() {
  const map = useMap()
  const { setUserLocation } = useMapStore()
  const { fetchLocation, isLoading } = useUserLocation()

  const handleLocate = async () => {
    const location = await fetchLocation()
    if (location) {
      setUserLocation(location)
      map.flyTo([location.latitude, location.longitude], 15, {
        animate: true,
        duration: 0.8,
      })
    }
  }

  return (
    <div className="absolute right-3 bottom-8 z-[400] flex flex-col rounded-xl overflow-hidden shadow-md">
      {/* Zoom controls */}
      <ControlButton
        onClick={() => map.zoomIn()}
        title="Zoom in"
        className="rounded-t-xl border-b-0"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
      </ControlButton>
      <ControlButton
        onClick={() => map.zoomOut()}
        title="Zoom out"
        className="rounded-b-none border-b-0"
      >
        <Minus className="w-4 h-4" strokeWidth={2.5} />
      </ControlButton>

      {/* Divider */}
      <div className="h-px bg-[#E8DDD0]" />

      {/* Locate me */}
      <ControlButton
        onClick={handleLocate}
        title="Find my location"
        disabled={isLoading}
        className="rounded-b-xl"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#6B3F1F]" />
        ) : (
          <LocateFixed className="w-4 h-4" />
        )}
      </ControlButton>
    </div>
  )
}
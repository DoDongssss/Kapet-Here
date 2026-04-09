import { X, Navigation } from "lucide-react"
import { useMapStore } from "@/store/useMapStore"
import { useCoffeeShop } from "@/hooks/useCoffeeShop"
import { useFeedback } from "@/hooks/useFeedback"
import CoffeeShopDetail from "./CoffeeShopDetail"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { toast } from "sonner"

export default function CoffeeShopPanel() {
  const {
    selectedShop,
    setSelectedShop,
    userLocation,
    startDirections,
    showDirections,
    directionsShop,
    clearDirections,
  } = useMapStore()

  const { data: shopDetail, isLoading } = useCoffeeShop(selectedShop?.id)
  const { data: feedback } = useFeedback(selectedShop?.id)

  const handleGetDirections = () => {
    if (!userLocation) {
      toast.error("Enable your location first — tap the locate button on the map.")
      return
    }
    if (!shopDetail) return
    startDirections(shopDetail)
    toast.success(`Directions to ${shopDetail.name}`)
  }

  if (!selectedShop) return null

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8DDD0] flex-shrink-0">
        <p className="text-xs text-[#9C7A5B] font-medium uppercase tracking-wider">
          Shop Details
        </p>
        <button
          onClick={() => setSelectedShop(null)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9C7A5B] hover:bg-[#EDE3D8] hover:text-[#3D1F0D] transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active directions banner */}
      {showDirections && directionsShop && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#2A1208] text-white">
          <Navigation className="w-3.5 h-3.5 text-[#D4863A] flex-shrink-0" />
          <p className="text-xs flex-1">Route to <strong>{directionsShop.name}</strong> active</p>
          <button
            onClick={clearDirections}
            className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <LoadingSpinner className="py-12" label="Loading details..." />
        ) : shopDetail ? (
          <CoffeeShopDetail
            shop={shopDetail}
            feedback={feedback ?? []}
            onGetDirections={handleGetDirections}
          />
        ) : null}
      </div>
    </div>
  )
}
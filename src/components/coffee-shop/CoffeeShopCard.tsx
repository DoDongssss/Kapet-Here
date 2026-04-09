import { MapPin, Star, ChevronRight, Coffee } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { coffeeShopPath } from "@/constants/routes"
import { useMapStore } from "@/store/useMapStore"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

interface CoffeeShopCardProps {
  shop: CoffeeShopWithPhotos
  averageRating?: number
  feedbackCount?: number
  className?: string
}

export default function CoffeeShopCard({
  shop,
  averageRating,
  feedbackCount = 0,
  className,
}: CoffeeShopCardProps) {
  const { selectedShop, setSelectedShop } = useMapStore()
  const isSelected = selectedShop?.id === shop.id
  const coverPhoto = shop.coffee_shop_photos?.[0]?.image_url

  return (
    <div
      onClick={() => setSelectedShop(shop)}
      className={cn(
        "group relative flex gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
        isSelected
          ? "border-[#6B3F1F] bg-[#FFF8F0] shadow-md shadow-[#6B3F1F]/10"
          : "border-[#E8DDD0] bg-white hover:border-[#C4A882] hover:shadow-sm",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#EDE3D8]">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="w-7 h-7 text-[#C4A882]" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3
            className="text-sm font-semibold text-[#2A1208] truncate leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {shop.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#9C7A5B] flex-shrink-0" />
            <p className="text-xs text-[#9C7A5B] truncate">{shop.location}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {averageRating !== undefined && feedbackCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#D4863A] fill-[#D4863A]" />
              <span className="text-xs font-semibold text-[#3D1F0D]">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-[#9C7A5B]">({feedbackCount})</span>
            </div>
          ) : (
            <span className="text-xs text-[#C4A882] italic">No reviews yet</span>
          )}

          <Link
            to={coffeeShopPath(shop.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-0.5 text-xs text-[#6B3F1F] font-medium hover:text-[#D4863A] transition-colors"
          >
            View
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Selected indicator bar */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-[#6B3F1F]" />
      )}
    </div>
  )
}
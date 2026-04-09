import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoffeeShopRatingProps {
  rating: number          // 1–5
  count?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  className?: string
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export default function CoffeeShopRating({
  rating,
  count,
  size = "md",
  showNumber = true,
  className,
}: CoffeeShopRatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating)
          const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0

          return (
            <div key={star} className="relative">
              {/* Empty star */}
              <Star
                className={cn(sizeMap[size], "text-[#E8DDD0] fill-[#E8DDD0]")}
              />
              {/* Filled star (full or partial) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating % 1) * 100}%` : filled ? "100%" : "0%" }}
              >
                <Star
                  className={cn(sizeMap[size], "text-[#D4863A] fill-[#D4863A]")}
                />
              </div>
            </div>
          )
        })}
      </div>

      {showNumber && (
        <span className={cn("font-semibold text-[#3D1F0D]", textSizeMap[size])}>
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className={cn("text-[#9C7A5B]", textSizeMap[size])}>
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  )
}
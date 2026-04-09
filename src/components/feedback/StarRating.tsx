import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
}

const labels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
}

export default function StarRating({
  value,
  onChange,
  size = "md",
  disabled = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => !disabled && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            className={cn(
              "transition-transform duration-100 focus:outline-none",
              !disabled && "hover:scale-110 cursor-pointer",
              disabled && "cursor-default"
            )}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors duration-150",
                star <= active
                  ? "text-[#D4863A] fill-[#D4863A]"
                  : "text-[#E8DDD0] fill-[#E8DDD0]"
              )}
            />
          </button>
        ))}
      </div>

      {/* Label */}
      <div className="h-5">
        {active > 0 && (
          <span className="text-sm font-medium text-[#6B3F1F] animate-in fade-in duration-150">
            {labels[active]}
          </span>
        )}
      </div>
    </div>
  )
}